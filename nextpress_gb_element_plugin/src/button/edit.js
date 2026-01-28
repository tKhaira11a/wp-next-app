import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, RangeControl, TextareaControl, TextControl} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { url = "", label = "", cptId, instanceId, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'label',
		'url'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "button";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-button-${Uuid}`,
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
			const cptName = "button";
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
				<PanelBody title={__('Settings', 'button-block')}>
					<TextControl
						label={ __(
							'Url',
							'button-block'
						) }
						help="Url des Buttons"
						value={ url }
						onChange={ ( value ) => setAttributes( { url: value } ) }
					/>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'button-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<RichText
					tagName="button"
					value={label}
					onChange={(value) => handleAttributeChange('label', value)}
					placeholder="Button Label"
				/>
			</div>
		</>
	);
}
