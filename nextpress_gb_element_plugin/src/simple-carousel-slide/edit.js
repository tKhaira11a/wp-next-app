import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyBackground from '../../dummy-background.jpg';
import {edit} from "@wordpress/icons";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const { label = "", background = "", cptId, instanceId, style = {css : ""}} = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localLabel, setLocalLabel ] = useState(label);

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				instanceId: clientId
			});
			setHasCreatedCPT(false);
		}
	}, [instanceId, clientId]);

	useEffect(() => {
		if (!hasCreatedCPT) {
			createCptEntry();
		}
	}, [hasCreatedCPT]);

	useEffect(() => {
		if (!cptId || !hasCreatedCPT) return;

		const updateTimeout = setTimeout(() => {
			updateCptEntry();
		}, 3000);

		return () => clearTimeout(updateTimeout);
	}, [
		cptId,
		hasCreatedCPT,
		label,
		background,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "s_carousel_slide";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-simple-carousel-slide-${Uuid}`,
				status: 'publish',
				meta: {
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
			const cptName = "s_carousel_slide";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
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

	const handleAttributeChange = (attribute, value) => {
		setAttributes({ [attribute]: value });
	};
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'simple-carousel-slide-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'simple-carousel-slide-block'
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

			<div {...blockProps} style={{display: 'flex', flexDirection: 'column'}}>
				<div style={{
					marginTop: '10px',
					backgroundImage: `url(${background === "" ? dummyBackground : background})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: "80px",
					minWidth: "170px",
					position: 'relative'
				}}>
					<RichText
						tagName="h2"
						value={label}
						onChange={(value) => handleAttributeChange('label', value)}
						placeholder="Hier Text eingeben..."
					/>
				</div>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<p>{__('Hintergrundbild', 'simple-carousel-slide-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ background: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{background ? __('Change Image', 'simple-carousel-slide-block') : __('Select Image', 'simple-carousel-slide-block')}
								</Button>
							)}
						/>

						<TextControl
							label={ __(
								'Label',
								'simple-carousel-slide-block'
							) }
							value={ localLabel }
							onChange={ ( value ) =>
								setLocalLabel(value)
							}
							onBlur = { () =>
								handleAttributeChange('label', localLabel )
							}
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
