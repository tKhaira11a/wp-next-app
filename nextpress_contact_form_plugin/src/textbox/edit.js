import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, TextareaControl, TextControl} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { label = "", cptId, instanceId, style = {css : ""}, fieldName = ""  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [txBoxValue, setTxBoxValue] = useState("");
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
			const cptName = "textbox";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-textbox-${Uuid}`,
				status: 'publish',
				meta: {
					label: label,
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
		const cptName = "textbox";
		const postCategory = "postType";

		const updatedPostReccord = {
			id: cptId,
			meta: {
				label: label,
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
				<PanelBody title={__('Settings', 'textbox-block')}>
					<TextControl
						label={__('Field-Name (no spaces)', 'textbox-block')}
						value={fieldName}
						onChange={(newValue) => {
							handleAttributeChange("fieldName", newValue);
						}}
					/>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'textbox-block'
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
					placeholder="Label: "
				/>
				<input
					type={"textbox"}
					value={txBoxValue}
				    onChange={(value) => handleAttributeChange('txBoxValue', value)}
				/>
			</div>
		</>
	);
}
