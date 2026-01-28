import './editor.scss';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useRef, useState, useCallback } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { serialize } from '@wordpress/blocks';
import { useCptSync } from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		childContent,
		tabTitle,
		tabValue,
		style = { css: "" }
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const watchedAttributes = [
		'childContent',
		'tabTitle',
		'tabValue'
	];

	const innerBlocks = useSelect((select) => {
		return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
	}, [clientId]);

	const isActive = useSelect(
		(select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(clientId);

			for (const parentId of parentIds) {
				const parentBlock = getBlock(parentId);
				if (parentBlock?.name === 'nextpress-block/ani-tab-control') {
					const parentActiveTab = parentBlock.attributes?.activeTab;
					if (parentActiveTab) {
						return parentActiveTab === tabValue;
					}
					return false;
				}
			}
			return false;
		},
		[clientId, tabValue]
	);

	const createCptEntry = useCallback(async () => {
		if (isPendingUpdate || cptId) return;

		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map((block) => block.attributes?.cptId || null);
			let serializedContent = "";
			if (innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					serializedContent += serialize(block, { isInnerBlocks: true, skipComments: true })
						.replace(/<!--[^>]*-->/g, '')
						.replace(/\n\s*\n/g, '\n');
				});
			}
			const post = await saveEntityRecord('postType', 'animated_tab', {
				title: `animated-tab-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: serializedContent,
					tab_value: tabValue || Uuid,
					tab_title: tabTitle
				}
			});

			if (post?.id) {
				setAttributes({
					cptId: post.id,
					childIds: childLabels,
					childContent: serializedContent,
					tabValue: tabValue || Uuid
				});
			}
		} catch (error) {
			console.error("Fehler beim Erstellen des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}, [cptId, isPendingUpdate, innerBlocks, Uuid, attributes, tabValue, tabTitle, saveEntityRecord, setAttributes]);

	const updateCptEntry = useCallback(async () => {
		if (isPendingUpdate || !cptId) return;

		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map((block) => block.attributes?.cptId);
			let serializedContent = "";
			if (innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					serializedContent += serialize(block, { isInnerBlocks: true, skipComments: true })
						.replace(/<!--[^>]*-->/g, '')
						.replace(/\n\s*\n/g, '\n');
				});
			}
			await saveEntityRecord('postType', 'animated_tab', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					child_content: serializedContent,
					tab_value: tabValue,
					tab_title: tabTitle
				}
			});

			setAttributes({
				childIds: childLabels,
				childContent: serializedContent
			});
		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}, [cptId, isPendingUpdate, innerBlocks, attributes, tabValue, tabTitle, saveEntityRecord, setAttributes]);

	useCptSync({
		clientId,
		attributes,
		setAttributes,
		watchedAttributes,
		externalDependencies: [innerBlocks.length],
		createCallback: createCptEntry,
		updateCallback: updateCptEntry,
		debounceDelay: 3000
	});

	const blockProps = useBlockProps({
		className: `np-tab ${isActive ? 'is-active' : ''}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'animated-tab-block')}>
					<TextControl
						label={__('Tab Title', 'animated-tab-block')}
						help="Title des Tabs"
						value={tabTitle}
						onChange={(value) => setAttributes({ tabTitle: value })}
					/>
					<TextareaControl
						label={__('Additional CSS for Element. No selectors!', 'animated-tab-block')}
						help="CSS-Styles"
						value={style.css}
						onChange={(value) => setAttributes({ style: { css: value } })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks
					template={[['core/group']]}
					templateLock={false}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
				/>
			</div>
		</>
	);
}
