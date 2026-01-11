import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, RangeControl, TextareaControl,} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const { cptId, instanceId, initialIndex = 0, slideIds, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks || [],
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
		slideIds,
		initialIndex,
		innerBlocks,
		attributes
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "carousel";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-carousel-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					slide_ids: JSON.stringify(childLabels),
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
			const cptName = "carousel";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					slide_ids: JSON.stringify(childLabels),
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

	const handleAttributeChange = (attribute, value) => {
		setAttributes({ [attribute]: value });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'carousel-block' ) }>
					<RangeControl
						label={__('Erster Slide', 'carousel-block')}
						value={initialIndex}
						onChange={(value) => handleAttributeChange('initialIndex', value)}
						max={innerBlocks.length - 1}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'carousel-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={['nextpress-block/carousel-slide']}
					template={[['nextpress-block/carousel-slide']]}
					templateLock={false}
					className={"wp-block-button-grid"}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
				/>
			</div>
		</>
	);
}
