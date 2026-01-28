import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, TabPanel, TextareaControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const { cptId, instanceId, initialIndex = 0, tabIds, activeTab = "", style = {css : ""}   } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'tabIds',
		'initialIndex'
	];

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks || [],
		[attributes, clientId, isPendingUpdate]
	);

	const tabs = innerBlocks.map((block, index) => ({
		name: block.attributes?.tabValue,
		title: block.attributes?.tabTitle || `Tab ${index + 1}`,
		childContent: block.attributes?.childContent || `Tab ${index + 1}`,
	}));

	const activeTabBlock = innerBlocks.find(
		(block) => block.attributes?.tabValue === activeTab
	);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "ani_tab_control";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-ani-tab-control-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					tab_ids: JSON.stringify(childLabels),
					initial_index: initialIndex
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);

			if (post && post.id) {
				setAttributes({
					cptId: post.id,
					productListIds: childLabels
				});
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
			const cptName = "ani_tab_control";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					tab_ids: JSON.stringify(childLabels),
					initial_index: initialIndex
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
		externalDependencies: [innerBlocks],
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
				<PanelBody title={ __( 'Settings', 'ani-tab-control-block' ) }>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'ani-tab-control-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<TabPanel
					className="my-tab-panel"
					activeClass="active-tab"
					tabs={tabs}
					onSelect={(name) => handleAttributeChange("activeTab", {name})}
				>
					{( tab ) => {
						return (
							<div className="tab-content-preview">
								<InnerBlocks
									template={[['nextpress-block/animated-tab']]}
									templateLock={false}
									allowedBlocks={['nextpress-block/animated-tab']}
									renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
									className={`wp-block-ani-tab-control`}
								/>
							</div>
						)
					}}
				</TabPanel>
			</div>
			{tabs.length === 0 && (
				<InnerBlocks
					template={[['nextpress-block/animated-tab']]}
					templateLock={false}
					allowedBlocks={['nextpress-block/animated-tab']}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					className={`wp-block-ani-tab-control`}
				/>
			)}

		</>
	);
}
