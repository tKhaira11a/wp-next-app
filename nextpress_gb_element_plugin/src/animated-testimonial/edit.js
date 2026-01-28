import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, TextareaControl} from '@wordpress/components';
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
		testimonialList, style = {css : ""}
	} = attributes;

	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'testimonialList'
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
			const cptName = "animated_testimonial";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-button-grid-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					testimonial_list: JSON.stringify(childLabels)
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);

			if (post && post.id) {
				setAttributes({
					cptId: post.id,
					testimonialList: childLabels
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
			const cptName = "animated_testimonial";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					testimonial_list: JSON.stringify(childLabels)
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
				<PanelBody title={ __( 'Settings', 'animated-testimonial-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'animated-testimonial-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={['nextpress-block/testimonial']}
					template={[['nextpress-block/testimonial']]}
					templateLock={false}
					className={"wp-block-testimonial-block"}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
				/>
			</div>
		</>
	);
}
