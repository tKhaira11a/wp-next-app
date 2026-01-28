import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, RangeControl, TextareaControl} from "@wordpress/components";
import './editor.scss';
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import './editor.scss';
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { duration = 0, words = '', cptId, instanceId, style = {css : ""}   } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'duration',
		'words'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "textgen_effekt";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-textgenerate-effekt-${Uuid}`,
				status: 'publish',
				meta: {
					duration: duration,
					words: words,
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
			const cptName = "textgen_effekt";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					duration: duration,
					words: words,
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
				<PanelBody title={__('Settings', 'text-generate-effekt-block')}>
					<RangeControl
						label={__('Animationsdauer', 'text-generate-effekt-block')}
						value={duration}
						onChange={(value) => handleAttributeChange('duration', value)}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'text-generate-effekt-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<RichText
					tagName="span"
					value={words}
					onChange={(value) => handleAttributeChange('words', value)}
					placeholder="Hier Text eingeben..."
				/>
			</div>
		</>
	);
}
