import { InspectorControls, MediaUpload, useBlockProps} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import {Button, PanelBody, TextareaControl} from "@wordpress/components";
import './editor.scss';
import {__} from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		images, style = {css : ""}
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

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
		images,
		attributes
	]);
	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const post = await saveEntityRecord('postType', 'parallax_grid', {
				title: `parallax-grid-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					images: JSON.stringify(images)
				}
			});

			if (post?.id) {
				setAttributes({
					cptId: post.id
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
			await saveEntityRecord('postType', 'parallax_grid', {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					images: JSON.stringify(images)
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
				<PanelBody title={ __( 'Settings', 'parallax-grid-block' ) }>
					<MediaUpload
						onSelect={(media) => setAttributes({ images: media })}
						allowedTypes={['image']}
						multiple
						gallery
						value={attributes.images?.map((img) => img.id)}
						render={({ open }) => (
							<Button onClick={open} isSecondary>
								{attributes.images?.length ? 'Galerie bearbeiten' : 'Galerie wählen'}
							</Button>
						)}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'parallax-grid-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				{attributes.images?.length > 0 && (
					<>
						{attributes.images.map((img) => (
							<img key={img.id} src={img.url} alt={img.alt || ''} style={{ width: '100px' }} />
						))}
					</>
				)}
			</div>
		</>
	)
}
