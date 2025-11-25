import {BlockControls, InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {edit} from "@wordpress/icons";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { text = '', revealText = '', cardTitle = '', cardDescription = '', cptId, instanceId, style = {css : ""}   } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localCardTitle, setLocalCardTitle ] = useState(cardTitle);
	const [ localCardDescription, setLocalCardDescription ] = useState(cardDescription);
	const [ localText, setLocalText ] = useState(text);
	const [ localRevealText, setLocalRevealText ] = useState(revealText);

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				cptId: undefined,
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
		text,
		revealText,
		cardTitle,
		cardDescription,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "text_reveal_card";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-text-reveal-card-${Uuid}`,
				status: 'publish',
				meta: {
					text: text,
					reveal_text: revealText,
					card_title: cardTitle,
					card_description: cardDescription,
					attributes: JSON.stringify(attributes)
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);
			if (post && post.id) {
				setAttributes({ cptId: post.id });
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
		const cptName = "text_reveal_card";
		const postCategory = "postType";

		const updatedPostReccord = {
			id: cptId,
			meta: {
				text: text,
				reveal_text: revealText,
				card_title: cardTitle,
				card_description: cardDescription,
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
				<PanelBody title={__('Settings', 'text-reveal-card-block')}>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'text-reveal-card-block'
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
					value={cardTitle}
					onChange={(value) => handleAttributeChange('cardTitle', value)}
					placeholder="Card Title"
				/>
				<br />
				<RichText
					tagName="span"
					value={cardDescription}
					onChange={(value) => handleAttributeChange('cardDescription', value)}
					placeholder="Card Description"
				/>
				<br />
				<RichText
					tagName="span"
					value={text}
					onChange={(value) => handleAttributeChange('text', value)}
					placeholder="Text"
				/>&nbsp;&nbsp;&nbsp;&nbsp;
				<RichText
					tagName="span"
					value={revealText}
					onChange={(value) => handleAttributeChange('revealText', value)}
					placeholder="Reveal Text"
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<TextControl
							label={ __(
								'Card-Title',
								'text-reveal-card-block'
							) }
							value={ localCardTitle }
							onChange={ ( value ) =>
								setLocalCardTitle(value)
							}
							onBlur = { () =>
								handleAttributeChange('cardTitle', localCardTitle )
							}
						/>

						<TextControl
							label={ __(
								'Card-Description',
								'text-reveal-card-block'
							) }
							value={ localCardDescription }
							onChange={ ( value ) =>
								setLocalCardDescription(value)
							}
							onBlur = { () =>
								handleAttributeChange('cardDescription', localCardDescription )
							}
						/>

						<TextControl
							label={ __(
								'Text',
								'text-reveal-card-block'
							) }
							value={ localText }
							onChange={ ( value ) =>
								setLocalText(value)
							}
							onBlur = { () =>
								handleAttributeChange('text', localText )
							}
						/>

						<TextControl
							label={ __(
								'Reveal Text',
								'text-reveal-card-block'
							) }
							value={ localRevealText }
							onChange={ ( value ) =>
								setLocalRevealText(value)
							}
							onBlur = { () =>
								handleAttributeChange('revealText', localRevealText )
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
