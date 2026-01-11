import { __ } from '@wordpress/i18n';
import {InspectorControls, RichText, useBlockProps} from '@wordpress/block-editor';
import './editor.scss';
import {PanelBody, TextareaControl, TextControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {label, url, cptId, instanceId, style = {css : ""}} = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();


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
		url,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "list_item";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-button-grid-item-${Uuid}`,
				status: 'publish',
				meta: {
					url: url,
					label: label,
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
			const cptName = "list_item";
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
				<PanelBody title={ __( 'Settings', 'button-grid-item-block' ) }>
					<TextControl
						label={ __(
							'Url',
							'button-grid-item-block'
						) }
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'button-grid-item-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<RichText
					tagName="li"
					value={label}
					onChange={(value) => handleAttributeChange('label', value)}
					placeholder="Hier Text eingeben..."
				/>
			</div>
		</>
	);
}
