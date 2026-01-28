import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import './editor.scss';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyBackground from '../../dummy-background.jpg';
import {edit} from "@wordpress/icons";
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {label = "", url = "", background = "", cptId, instanceId, style = {css : ""}} = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const watchedAttributes = [
		'hasCreatedCPT',
		'label',
		'url',
		'background'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "hero_parallax_prod";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-hero-parallax-product-${Uuid}`,
				status: 'publish',
				meta: {
					url: url,
					label: label,
					background: background,
					attributes: JSON.stringify(attributes)
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);
			if (post && post.id) {
				setAttributes({cptId: post.id});
				setHasCreatedCPT(true);
			}

		} catch (error) {
			console.error("Fehler beim Erstellen des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}


	const updateCptEntry = async () => {
		if (isPendingUpdate) {
			return;
		}
		setIsPendingUpdate(true);
		try {
			const cptName = "hero_parallax_prod";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					url: url,
					label: label,
					background: background,
					attributes: JSON.stringify(attributes)
				}
			};

			const updatedPost = await saveEntityRecord(postCategory, cptName, updatedPostReccord);

		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}

	useCptSync({
		clientId,
		attributes,
		setAttributes,
		watchedAttributes,
		createCallback: createCptEntry,
		updateCallback: updateCptEntry,
		debounceDelay: 3000
	});

	const handleAttributeChange = (attribute, value) => {
		setAttributes({ [attribute]: value });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'hero-parallax-prod-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'hero-parallax-prod-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ edit }
						label="Edit Slide-Content"
						onClick={ () => setOpen( true ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps} >
				<RichText
					tagName="span"
					value={label}
					onChange={(value) => handleAttributeChange('label', value)}
					placeholder="Hier Text eingeben..."
				/>
				<div style={{
					marginTop: '10px',
					backgroundImage: `url(${background === "" ? dummyBackground : background})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					height: "80px",
					width: "170px",
					left: '21vw',
				}} />

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<p>{__('URL', 'hero-parallax-prod-block')}</p>
						<TextControl
							label={ __(
								'Url',
								'hero-parallax-prod-block'
							) }
							value={ url }
							onChange={ ( value ) =>
								setAttributes( { url: value } )
							}
						/>

						<p>{__('Hintergrundbild', 'hero-parallax-prod-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ background: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{background ? __('Change Image', 'hero-parallax-prod-block') : __('Select Image', 'hero-parallax-prod-block')}
								</Button>
							)}
						/>
						<br />
						<br />
						<Button variant="secondary" onClick={ () => setOpen( false ) }>
							Schließen
						</Button>
					</Modal>

				) }
			</div>
		</>
	);
}
