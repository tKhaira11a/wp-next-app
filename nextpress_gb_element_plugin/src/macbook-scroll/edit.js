import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl, ToggleControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';
import dummyBackground from '../../assets/dummy-background.jpg';
import {edit} from "@wordpress/icons";
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {boxTitle = "", src = "", showGradient = false, cptId, instanceId, style = {css : ""}} = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps({ className: "mcbook-scroll-block-mcBookBgr" });
	const [ isOpen, setOpen ] = useState( false );
	const [ localBoxTitle, setLocalBoxTitle ] = useState(boxTitle);
	const watchedAttributes = [
		'hasCreatedCPT',
		'boxTitle',
		'src',
		'showGradient'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "macbook_scroll";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-macbook-scroll-${Uuid}`,
				status: 'publish',
				meta: {
					src: src,
					box_title: boxTitle,
					show_gradient: showGradient,
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
			const cptName = "macbook_scroll";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					src: src,
					box_title: boxTitle,
					show_gradient: showGradient,
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
				<PanelBody title={ __( 'Settings', 'macbook-scroll-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'macbook-scroll-block'
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
				{src && (
					<div
						style={{
						backgroundImage: `url(${src === "" ? dummyBackground : src})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						height: "157px",
						width: "461px",
						margin: "0 auto"
					}} />
				)}
				<br />
				<br />
				<RichText
					tagName="span"
					value={boxTitle}
					onChange={(value) => handleAttributeChange('boxTitle', value)}
					placeholder="Box Header"
					className="mcbook-scroll-block-txBox"
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>

						<p>{__('Box Title', 'macbook-scroll-block')}</p>
						<TextControl
							label={ __(
								'Url',
								'macbook-scroll-block'
							) }
							value={ localBoxTitle }
							onChange={ ( value ) =>
								setLocalBoxTitle(value)
							}
							onBlur = { () =>
								handleAttributeChange('boxLabel', localBoxTitle )
							}
						/>
						<br/>
						<br/>

						<ToggleControl
							checked={ showGradient }
							label={ __(
								'Show Gradient',
								'macbook-scroll-block'
							) }
							onChange={ () =>
								setAttributes( {
									showGradient: ! showGradient,
								} )
							}
						/>


						<p>{__('Display Picture', 'macbook-scroll-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ src: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{src ? __('Change Image', 'macbook-scroll-block') : __('Select Image', 'macbook-scroll-block')}
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
