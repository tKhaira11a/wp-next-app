import './editor.scss';
import { BlockControls, InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import { serialize } from '@wordpress/blocks';
import {edit} from "@wordpress/icons";
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		childContent,
		itemTitle,
		description, style = {css : ""}
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [ isOpen, setOpen ] = useState( false );
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
		itemTitle,
		description,
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
			const post = await saveEntityRecord('postType', 'sticky_reveal_item', {
				title: `sticky-reveal-item-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					description: description,
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
			await saveEntityRecord('postType', 'sticky_reveal_item', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					description: description,
					item_title: itemTitle
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
				<PanelBody title={ __( 'Settings', 'sticky-reveal-item-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'sticky-reveal-item-block'
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
				<InnerBlocks
					template={[
						['core/group']
					]}
					templateLock={false}
					className={"wp-block-sticky-reveal-item"}
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<TextControl
							label={ __(
								'Item Titel',
								'sticky-reveal-item-block'
							) }
							value={ itemTitle }
							onChange={ ( value ) =>
								setAttributes( { itemTitle: value } )
							}
						/>

						<TextareaControl
							label={ __(
								'Text',
								'sticky-reveal-item-block'
							) }
							help="Enter a description"
							value={ description }
							onChange={ ( value ) => setAttributes( { description: value } ) }
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
	)
}
