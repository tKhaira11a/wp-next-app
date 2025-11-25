import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, Modal, PanelBody, TextControl, TextareaControl, Button} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyBackground from '../../dummy-background.jpg';
import {edit} from "@wordpress/icons";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		description = '',
		title = '',
		src = '',
		ctaText = '',
		ctaLink = '',
		content = '', style = {css : ""},
		cptId, instanceId} = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localTitle, setLocalTitle ] = useState(title);
	const [ localDescription, setLocalDescription ] = useState(description);
	const [ localCtaText, setLocalCtaText ] = useState(ctaText);

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
		description,
		title,
		src,
		ctaText,
		ctaLink,
		content,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "expandable_card";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-expandable-card-${Uuid}`,
				status: 'publish',
				meta: {
					description: description,
					card_title: title,
					src: src,
					cta_text: ctaText,
					cta_link: ctaLink,
					card_content: content,
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
			const cptName = "expandable_card";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					description: description,
					card_title: title,
					src: src,
					cta_text: ctaText,
					cta_link: ctaLink,
					card_content: content,
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
				<PanelBody title={ __( 'Settings', 'expandable-card-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'expandable-card-block'
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

			<div {...blockProps}>
				<table>
					<tbody>
						<tr>
							<td>
								<div style={{
									backgroundImage: `url(${src === "" ? dummyBackground : src})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									minHeight: "180px",
									minWidth: "170px",
									position: 'relative'
								}}>
								</div>
							</td>
							<td>
								<RichText
									tagName="h2"
									value={title}
									onChange={(value) => handleAttributeChange('title', value)}
									placeholder="Hier Text eingeben..."
								/>
								<br/>
								<RichText
									tagName="span"
									value={description}
									onChange={(value) => handleAttributeChange('description', value)}
									placeholder="Hier Text eingeben..."
								/>
								<br/>
								<RichText
									tagName="button"
									value={ctaText}
									onChange={(value) => handleAttributeChange('ctaText', value)}
									placeholder="Hier Text eingeben..."
								/>
							</td>
						</tr>
					</tbody>
				</table>


				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<TextControl
							label={ __(
								'Title',
								'expandable-card-block'
							) }
							value={ localTitle }
							onChange={ ( value ) =>
								setLocalTitle( value )
							}
							onBlur = { () =>
								handleAttributeChange('title', localTitle )
							}
						/>

						<TextControl
							label={ __(
								'Description',
								'expandable-card-block'
							) }
							value={ localDescription }
							onChange={ ( value ) =>
								setLocalDescription( value )
							}
							onBlur = { () =>
								handleAttributeChange('description', localDescription )
							}
						/>

						<p>{__('Hintergrundbild', 'expandable-card-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ src: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{src ? __('Change Image', 'expandable-card-block') : __('Select Image', 'expandable-card-block')}
								</Button>
							)}
						/>


						<TextControl
							label={ __(
								'Label',
								'expandable-card-block'
							) }
							value={ localCtaText }
							onChange={ ( value ) =>
								setLocalCtaText( value )
							}
							onBlur = { () =>
								handleAttributeChange('ctaText', localCtaText )
							}
						/>

						<TextControl
							label={ __(
								'Label',
								'expandable-card-block'
							) }
							value={ ctaLink }
							onChange={ ( value ) =>
								setAttributes( { ctaLink: value } )
							}
						/>

						<TextareaControl
							label={ __(
								'Text',
								'expandable-card-block'
							) }
							help="Enter some text"
							value={ content }
							onChange={ ( value ) => setAttributes( { content: value } ) }
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
