import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, TextareaControl, TextControl, FormFileUpload} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { label = "", subLabel = "", cptId, instanceId, style = {css : ""}, fieldName = ""  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

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
		label,
		attributes,
		fieldName
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "file_upload";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-file-upload-${Uuid}`,
				status: 'publish',
				meta: {
					label: label,
					sub_label: subLabel,
					attributes: JSON.stringify(attributes),
					field_name: fieldName
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
		const cptName = "file_upload";
		const postCategory = "postType";

		const updatedPostReccord = {
			id: cptId,
			meta: {
				label: label,
				sub_label: subLabel,
				attributes: JSON.stringify(attributes),
				field_name: fieldName
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
				<PanelBody title={__('Settings', 'file-upload-block')}>
					<TextControl
						label={__('Field-Name (no spaces)', 'file-upload-block')}
						value={fieldName}
						onChange={(newValue) => {
							handleAttributeChange("fieldName", newValue);
						}}
					/>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'file-upload-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<RichText
					tagName="label"
					value={label}
					onChange={(value) => handleAttributeChange('label', value)}
					placeholder="Label"
				/>
				<br />
				<RichText
					tagName="subLabel"
					value={subLabel}
					onChange={(value) => handleAttributeChange('subLabel', value)}
					placeholder="Sub-Label"
				/>
				<FormFileUpload
					style={{border: "solid", borderRadius: "10px", borderWidth: "thin"}}
					__next40pxDefaultSize
					accept="image/*, video/*, .pdf, .doc, .docx, .xls, .xlsx, .txt, .odt, .csv"
					onChange={ ( event ) => console.log( event.currentTarget.files ) }
				>
					{label}
				</FormFileUpload>
			</div>
		</>
	);
}
