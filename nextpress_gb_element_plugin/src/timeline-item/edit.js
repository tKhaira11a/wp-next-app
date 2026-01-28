import './editor.scss';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {PanelBody, TextareaControl, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import { serialize } from '@wordpress/blocks';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		childContent,
		itemTitle, style = {css : ""}
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'childContent',
		'itemTitle'
	];

	const extractTextContent = (blocks) => {
		return blocks.flatMap((block) => {
			const content = block.attributes?.content || '';
			const children = extractTextContent(block.innerBlocks || []);
			return [content, ...children];
		});
	};
	const innerBlocks = useSelect((select) => {
		return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
	},[attributes, clientId, isPendingUpdate]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map((block) => block.attributes?.cptId || null);
			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}
			const post = await saveEntityRecord('postType', 'timeline_item', {
				title: `timeline-item-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					item_title: itemTitle
				}
			});

			if (post?.id) {
				setAttributes({
					cptId: post.id,
					childIds: childLabels,
					childContent: childContent,
				});
				setHasCreatedCPT(true);
			}
		} catch (error) {
			console.error("Fehler beim Erstellen des CPT:", error);
		}
		setIsPendingUpdate(false);
	}
	const updateCptEntry = async () => {
		if (isPendingUpdate) {
			return;
		}
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map((block) => block.attributes?.cptId);
			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}
			await saveEntityRecord('postType', 'timeline_item', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					item_title: itemTitle
				}
			});
		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	};

	useCptSync({
		clientId,
		attributes,
		setAttributes,
		watchedAttributes,
		externalDependencies: [innerBlocks],
		createCallback: createCptEntry,
		updateCallback: updateCptEntry,
		debounceDelay: 3000
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'timeline-item-block' ) }>

					<TextControl
						label={ __(
							'Item Titel',
							'timeline-item-block'
						) }
						value={ itemTitle }
						onChange={ ( value ) =>
							setAttributes( { itemTitle: value } )
						}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'Move…'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<InnerBlocks
					template={[
						['core/group']
					]}
					templateLock={false}
					className={"wp-block-timeline-item"}
				/>
			</div>
		</>
	)
}
