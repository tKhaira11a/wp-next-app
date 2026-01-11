import './editor.scss';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {PanelBody, TextareaControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import blockBgr from './block-bgr.png';
import { serialize } from '@wordpress/blocks';
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		childContent, style = {css : ""}
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

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

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				cptId: undefined,
				instanceId: clientId,
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
		innerBlocks,
		childContent,
		attributes
	]);
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
			const post = await saveEntityRecord('postType', 'background_boxes', {
				title: `background-boxes-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
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
		if (isPendingUpdate) return;

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
			await saveEntityRecord('postType', 'background_boxes', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent
				}
			});
		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	};
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'background-boxes-block' ) }>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'background-boxes-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<div style={{
					marginTop: '10px',
					maxWidth: '100%',
					width: '100%',
					minHeight: '300px',
					color: "lightgray",
					backgroundImage: `url(${blockBgr})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
				}} >
					<InnerBlocks
						template={[
							['core/group']
						]}
						templateLock={false}
						className={"wp-block-background-boxes"}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					/>
				</div>
			</div>
		</>
	)
}
