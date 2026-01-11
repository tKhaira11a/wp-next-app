import './editor.scss';
import {BlockControls, InnerBlocks, InspectorControls, MediaUpload, useBlockProps} from '@wordpress/block-editor';
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
		badge,
		image, style = {css : ""}
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );

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
		attributes,
		badge,
		image
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
			const post = await saveEntityRecord('postType', 'tracing_beam_item', {
				title: `tracing_beam-item-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					item_title: itemTitle,
					badge: badge,
					image: image
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
			await saveEntityRecord('postType', 'tracing_beam_item', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: childContent,
					item_title: itemTitle,
					badge: badge,
					image: image
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
				<PanelBody title={ __( 'Settings', 'tracing-beam-item-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'tracing-beam-item-block'
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
					className={"wp-block-tracing-beam-item"}
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<TextControl
							label={ __(
								'Item Titel',
								'tracing-beam-item-block'
							) }
							value={ itemTitle }
							onChange={ ( value ) =>
								setAttributes( { itemTitle: value } )
							}
						/>

						<TextControl
							label={ __(
								'Badge',
								'tracing-beam-item-block'
							) }
							value={ badge }
							onChange={ ( value ) =>
								setAttributes( { badge: value } )
							}
						/>

						<MediaUpload
							onSelect={(media) => setAttributes({ image: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{image ? __('Change Image', 'tracing-beam-item-block') : __('Select Image', 'tracing-beam-item-block')}
								</Button>
							)}
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
