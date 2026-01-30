/*
 *  Copyright (C) 2026 Tarik Khairalla (khairalla-code)
 *   https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { BlockControls, InspectorControls, MediaUpload, useBlockProps} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl} from "@wordpress/components";
import './editor.scss';
import {__} from "@wordpress/i18n";
import {gallery} from "@wordpress/icons";
import {useCptSync} from "../hooks/useCptSync";

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
	const [ isOpen, setOpen ] = useState( false );
	const watchedAttributes = [
		'hasCreatedCPT',
		'images'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const post = await saveEntityRecord('postType', 'three_d_marquee', {
				title: `three-d-marquee-${Uuid}`,
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
			await saveEntityRecord('postType', 'three_d_marquee', {
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

	useCptSync({
		clientId,
		attributes,
		setAttributes,
		watchedAttributes,
		createCallback: createCptEntry,
		updateCallback: updateCptEntry,
		debounceDelay: 3000
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'three-d-marquee-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'three-d-marquee-block'
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
						icon={ gallery }
						label="Edit Slide-Content"
						onClick={ () => setOpen( true ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps} >
				{attributes.images?.length > 0 && (
					<>
						{attributes.images.map((img) => (
								<img key={img.id} src={img.url} alt={img.alt || ''} style={{ width: '100px' }} />
						))}
					</>
				)}

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<p>{__('Hintergrundbild', 'expandable-card-block')}</p>
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
