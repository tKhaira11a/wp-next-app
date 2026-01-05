import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import './editor.scss';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl,} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyCardImg from '../../dummy_card_img.jpg';
import {edit} from "@wordpress/icons";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {testimonialTitle= "", bild = "", position = "", testimonialName = "", quote= "", cptId, instanceId, style = {css : ""} } = attributes;
	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localTestimonialTitle, setLocalTestimonialTitle ] = useState(testimonialTitle);
	const [ localQuote, setLocalQuote ] = useState(quote);

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
		bild,
		position,
		testimonialName,
		testimonialTitle,
		quote,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "testimonial";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-testimonial-${Uuid}`,
				status: 'publish',
				meta: {
					bild: bild,
					position: position,
					quote: quote,
					testimonial_name: testimonialName,
					testimonial_title: testimonialTitle,
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
			const cptName = "testimonial";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					bild: bild,
					position: position,
					quote: quote,
					testimonial_name: testimonialName,
					testimonial_title: testimonialTitle,
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
				<PanelBody title={ __( 'Settings', 'testimonial-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'testimonial-block'
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
				<div style={{
					margin: '10px auto',
					backgroundImage: `url(${bild === "" ? dummyCardImg : dummyCardImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					width: '100%',
					minHeight: '200px',
				}} />
				<RichText
					tagName="span"
					value={testimonialTitle}
					onChange={(value) => handleAttributeChange('testimonialTitle', value)}
					placeholder="Zitat Überschrift"
				/>
				<br/>
				<br/>
				<RichText
					tagName="span"
					value={quote}
					onChange={(value) => handleAttributeChange('quote', value)}
					placeholder="Zitat eingeben"
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<TextControl
							label={ __(
								'Zitat Titel',
								'testimonial-block'
							) }
							value={ localTestimonialTitle }
							onChange={ ( value ) =>
								setLocalTestimonialTitle(value)
							}
							onBlur = { () =>
								handleAttributeChange('testimonialTitle', localTestimonialTitle )
							}
						/>
						<TextControl
							label={ __(
								'Zitat',
								'testimonial-block'
							) }
							value={ localQuote }
							onChange={ ( value ) =>
								setLocalQuote(value)
							}
							onBlur = { () =>
								handleAttributeChange('quote', localQuote )
							}
						/>

						<TextControl
							label={ __(
								'Zitat Geber',
								'testimonial-block'
							) }
							value={ testimonialName }
							onChange={ ( value ) =>
								setAttributes( { testimonialName: value } )
							}
						/>

						<p>{__('Bild des Zitatgebers', 'testimonial-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ bild: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{bild ? __('Change Image', 'testimonial-block') : __('Select Image', 'testimonial-block')}
								</Button>
							)}
						/>
						<TextControl
							label={ __(
								'Position/Stellung in Betrieb',
								'testimonial-block'
							) }
							value={ position }
							onChange={ ( value ) =>
								setAttributes( { position: value } )
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
