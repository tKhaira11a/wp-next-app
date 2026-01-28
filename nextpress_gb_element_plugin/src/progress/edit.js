import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, RangeControl, TextareaControl, TextControl} from "@wordpress/components";
import './editor.scss';
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import './editor.scss';
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { value = 50, cptId, instanceId, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'value'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "progress";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-progress-${Uuid}`,
				status: 'publish',
				meta: {
					value: value.toString(),
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
			const cptName = "progress";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					value: value.toString(),
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
				<PanelBody title={__('Settings', 'progress-block')}>
					<RangeControl
						label={__('Progress in %', 'progress-block')}
						value={value}
						onChange={(value) => handleAttributeChange('value', value)}
						max={100}
						min={0}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'progress-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<div style={{
						background: '#000',
						minHeight: '15px',
						borderRadius: '15px',
				}}
				>
					<div style={{
							background: '#ff0000',
							width: value.toString()+"%",
							minHeight: '15px',
							borderRadius: '15px'
					}}>

					</div>
				</div>
			</div>
		</>
	);
}
