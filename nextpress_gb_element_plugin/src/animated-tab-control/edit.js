import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextareaControl } from '@wordpress/components';
import { useRef, useState, useCallback, useEffect } from 'react';
import './editor.scss';
import { useDispatch, useSelect } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useCptSync } from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId }) {
	const { cptId, instanceId, initialIndex = 0, tabIds, activeTab = "", style = { css: "" } } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'tabIds',
		'initialIndex'
	];

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks || [],
		[clientId]
	);

	const tabs = innerBlocks.map((block, index) => ({
		name: block.attributes?.tabValue,
		title: block.attributes?.tabTitle || `Tab ${index + 1}`,
	}));

	// Finde ersten Tab mit gültigem tabValue
	const firstValidTabName = tabs.find(tab => tab.name)?.name;

	// Aktiver Tab: gespeicherter Wert, oder erster gültiger Tab
	const currentActiveTab = activeTab || firstValidTabName || "";

	// Setze activeTab wenn noch nicht gesetzt und ein gültiger Tab existiert
	useEffect(() => {
		if (!activeTab && firstValidTabName) {
			setAttributes({ activeTab: firstValidTabName });
		}
	}, [activeTab, firstValidTabName, setAttributes]);

	const createCptEntry = useCallback(async () => {
		if (isPendingUpdate || cptId) return;

		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "animated_tabcontrol";
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
					tabIds: childLabels
				});
			}

		} catch (error) {
			console.error("Fehler beim Erstellen des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}, [cptId, isPendingUpdate, innerBlocks, Uuid, attributes, initialIndex, saveEntityRecord, setAttributes]);

	const updateCptEntry = useCallback(async () => {
		if (isPendingUpdate || !cptId) return;

		setIsPendingUpdate(true);
		try {
			const cptName = "animated_tabcontrol";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					tab_ids: JSON.stringify(childLabels),
					initial_index: initialIndex
				}
			};

			await saveEntityRecord(postCategory, cptName, updatedPostReccord);
			setAttributes({ tabIds: childLabels });

		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}, [cptId, isPendingUpdate, innerBlocks, attributes, initialIndex, saveEntityRecord, setAttributes]);

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

	const handleTabClick = (tabName) => {
		setAttributes({ activeTab: tabName });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'ani-tab-control-block')}>
					<RangeControl
						label={__('Erster Tab', 'ani-tab-control-block')}
						value={initialIndex}
						onChange={(value) => setAttributes({ initialIndex: value })}
						min={0}
						max={Math.max(0, innerBlocks.length - 1)}
					/>
					<TextareaControl
						label={__('Additional CSS for Element. No selectors!', 'ani-tab-control-block')}
						help="CSS-Styles"
						value={style.css}
						onChange={(value) => setAttributes({ style: { css: value } })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="np-tab-panel">
					{tabs.length > 0 && (
						<div className="np-tab-buttons">
							{tabs.map((tab, index) => (
								<button
									key={tab.name || index}
									type="button"
									className={`np-tab-button ${currentActiveTab === tab.name ? 'is-active' : ''}`}
									onClick={() => handleTabClick(tab.name)}
								>
									{tab.title}
								</button>
							))}
						</div>
					)}
					<div className="np-tab-content">
						<InnerBlocks
							template={[['nextpress-block/animated-tab']]}
							templateLock={false}
							allowedBlocks={['nextpress-block/animated-tab']}
							renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
