import {BlockControls, InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import './editor.scss';
import {
	ToolbarGroup,
	ToolbarButton,
	Modal,
	PanelBody,
	TextareaControl,
	TextControl,
	Button
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import './editor.scss';
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {edit} from "@wordpress/icons";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { url = '', label = '', cptId, instanceId, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localLabel, setLocalLabel ] = useState(label);

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
		url,
		label,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "link_preview";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-link-preview-${Uuid}`,
				status: 'publish',
				meta: {
					url: url,
					label: label,
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
		const cptName = "link_preview";
		const postCategory = "postType";

		const updatedPostReccord = {
			id: cptId,
			meta: {
				url: url,
				label: label,
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
				<PanelBody title={__('Settings', 'link-preview-block')}>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'link-preview-block'
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
					placeholder="Angezeigter Text"
				/>
				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<p>{__('URL', 'link-preview-block')}</p>
						<TextControl
							label={ __(
								'Url',
								'link-preview-block'
							) }
							value={ url }
							onChange={ ( value ) =>
								setAttributes( { url: value } )
							}
						/>
						<p>{__('Label', 'link-preview-block')}</p>
						<TextControl
							label={ __(
								'Label',
								'link-preview-block'
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
