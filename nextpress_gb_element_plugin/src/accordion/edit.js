import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, Panel, TextareaControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		cptId,
		instanceId,
		accordionItems,
		style = {css : ""}
	} = attributes;

	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

	const innerBlocks = useSelect(
		(select) => {
			return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
		},
		[attributes, clientId, isPendingUpdate]
	);

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				cptId: undefined,
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
		innerBlocks,
		accordionItems,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "accordion";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-accordion-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					accordion_items: JSON.stringify(childLabels)
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);

			if (post && post.id) {
				setAttributes({
					cptId: post.id,
					accordionItems: childLabels
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
			const cptName = "accordion";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					accordion_items: JSON.stringify(childLabels)
				}
			};

			const updatedPost = await saveEntityRecord(postCategory, cptName, updatedPostReccord);

		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'accordion-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'accordion-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				style={ { height: 500 } }
				{...blockProps}>
				<Panel>
					<InnerBlocks
						allowedBlocks={['nextpress-block/accordion-item']}
						template={[['nextpress-block/accordion-item']]}
						templateLock={false}
						className={"wp-block-accordion-block"}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					/>
				</Panel>
			</div>
		</>
	);
}
