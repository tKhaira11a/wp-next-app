import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, SelectControl, TextareaControl,} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		cptId,
		instanceId,
		expandableCards,
		listMode, style = {css : ""}
	} = attributes;

	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'expandableCards',
		'listMode'
	];

	const innerBlocks = useSelect(
		(select) => {
			return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
		},
		[attributes, clientId, isPendingUpdate]
	);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "exp_card_container";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-exp-card-container-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					expandable_cards: JSON.stringify(childLabels),
					list_mode: listMode
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);

			if (post && post.id) {
				setAttributes({
					cptId: post.id,
					expandableCards: childLabels
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
			const cptName = "exp_card_container";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					expandable_cards: JSON.stringify(childLabels),
					list_mode: listMode
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'expandable-card-container-block' ) }>
					<SelectControl
						label={__('List-Style', 'expandable-card-container-block')}
						value={listMode ??  undefined}
						options={[
							{ label: __('Select...', 'expandable-card-container-block'), value: '' },
							{ label: __('Grid', 'expandable-card-container-block'), value: 'Grid' },
							{ label: __('List', 'expandable-card-container-block'), value: 'List' },
						]}
						onChange={(value) => setAttributes({ listMode: value })}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'expandable-card-container-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				className={"wp-block-expandable-card-container"}

				{...blockProps}>
				<ul>
					<InnerBlocks
						allowedBlocks={['nextpress-block/expandable-card']}
						template={[['nextpress-block/expandable-card']]}
						templateLock={false}
						className={"wp-block-nextpress-block-partical-canvas"}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					/>
				</ul>
			</div>
		</>
	);
}
