import './editor.scss';
import {InnerBlocks, InspectorControls, MediaUpload, useBlockProps} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {Button, ColorPicker, PanelBody, SelectControl, TextareaControl, ToggleControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";
import {serialize} from "@wordpress/blocks";
import dummyBackground from '../../dummy-background.jpg';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		speed = "",
		density = "",
		interactive = false,
		particleColor = "#FFF",
		background = "",
		cptId,
		instanceId,
		childContent, style = {css : ""}
	} = attributes;

	const blockProps = useBlockProps();
	const { saveEntityRecord } = useDispatch('core');
	const Uuid = useRef(uuidv4()).current;
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks || [],
		[attributes, clientId, isPendingUpdate]
	);

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
		particleColor,
		background,
		interactive,
		speed,
		density,
		innerBlocks,
		childContent,
		attributes
	]);

	const createCptEntry = async () => {
		try {
			const childLabels = innerBlocks.map((block) => block.attributes?.cptId || null);
			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}
			const post = await saveEntityRecord('postType', 'partical_canvas', {
				title: `partical-canvas-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					particle_color: particleColor,
					background: background,
					interactive: interactive,
					speed: speed,
					density: density,
					child_content: childContent
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
	};

	const updateCptEntry = async () => {
		if (isPendingUpdate) return;

		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks.map((block) => block.attributes?.cptId || null);
			let childContent = "";
			if(innerBlocks && innerBlocks.length > 0) {
				innerBlocks.forEach((block) => {
					childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
						.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
						.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
				})
			}
			await saveEntityRecord('postType', 'partical_canvas', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					child_ids: JSON.stringify(childLabels),
					particle_color: particleColor,
					background: background,
					interactive: interactive,
					speed: speed,
					density: density,
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
				<PanelBody title={ __( 'Settings', 'partical-canvas-block' ) }>

					<p>{__('Particle Color', 'partical-canvas-block')}</p>
					<ColorPicker
						color={particleColor}
						onChangeComplete={(value) => setAttributes({ particleColor: value.hex.toString() })}
						disableAlpha
					/>

					<p>{__('Background Image', 'partical-canvas-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ background: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{background ? __('Change Image', 'partical-canvas-block') : __('Select Image', 'partical-canvas-block')}
								</Button>
							)}
						/>

					<p>{__('', 'partical-canvas-block')}</p>
					<ToggleControl
						label={__('Interactive', 'partical-canvas-block')}
						checked={interactive}
						onChange={(value) => setAttributes({ interactive: value })}
					/>

					<SelectControl
						label={__('Speed', 'partical-canvas-block')}
						value={speed ??  undefined}
						options={[
							{ label: __('Select...', 'partical-canvas-block'), value: '' },
							{ label: __('Fast', 'partical-canvas-block'), value: 'fast' },
							{ label: __('Slow', 'partical-canvas-block'), value: 'slow' },
							{ label: __('None', 'partical-canvas-block'), value: 'none' },
						]}
						onChange={(value) => setAttributes({ speed: value })}
					/>

					<SelectControl
						label={__('Density', 'partical-canvas-block')}
						value={density  ?? undefined}
						options={[
							{ label: __('Select...', 'partical-canvas-block'), value: '' },
							{ label: __('High', 'partical-canvas-block'), value: 'high' },
							{ label: __('Low', 'partical-canvas-block'), value: 'low' },
						]}
						onChange={(value) => setAttributes({ density: value ?? "" })}
					/>


					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'partical-canvas-block'
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
					backgroundImage: `url(${background === "" ? dummyBackground : background})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					width: '100%',
					minHeight: '300px',
				}} >
					<InnerBlocks
						template={[
							['core/heading', { placeholder: 'Überschrift' }],
							['nextpress-block/text-generate-effekt', { placeholder: 'Text eingeben …' }]
						]}
						templateLock={false}
						className={"wp-block-partical-canvas"}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
					/>
				</div>
			</div>
		</>
	)
}
