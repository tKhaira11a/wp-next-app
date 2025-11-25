import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, TextareaControl, TextControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {serialize} from "@wordpress/blocks";
import { store as blockEditorStore } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {header = '', childContent = '', cptId, instanceId, style = {css : ""} } = attributes;

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
		header,
		childContent,
		attributes
	]);
	const innerBlocks = useSelect((select) => {
		return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
	},[attributes, clientId, isPendingUpdate]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "accordion_item";
			const postCategory = "postType";

			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}

			const newPostReccord = {
				title: `$-accordion-item-${Uuid}`,
				status: 'publish',
				meta: {
					header: header,
					child_content: childContent,
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
			const cptName = "accordion_item";
			const postCategory = "postType";
			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}

			const updatedPostReccord = {
				id: cptId,
				meta: {
					header: header,
					child_content: childContent,
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
				<PanelBody title={ __( 'Settings', 'accordion-item-block' ) }>
					<TextControl
						label={ __(
							'Accordion-Header',
							'accordion-item-block'
						) }
						help="Enter some text"
						value={ header }
						onChange={ ( value ) => setAttributes( { header: value } ) }
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'accordion-item-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<PanelBody title={ __( header, 'accordion-item-block' ) }>

					<InnerBlocks
						template={[
							['core/group']
						]}
						templateLock={false}
						className={"wp-block-accordion-item"}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					/>

				</PanelBody>
			</div>
		</>
	);
}
