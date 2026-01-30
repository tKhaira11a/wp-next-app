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

import {BlockControls, InspectorControls, MediaUpload, useBlockProps} from "@wordpress/block-editor";
import './editor.scss';
import {
	ToolbarGroup,
	ToolbarButton,
	Button,
	PanelBody,
	SelectControl,
	TextareaControl,
	ToggleControl,
	Modal
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import './editor.scss';
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyBackGround from '../../assets/dummy-background.jpg';
import {edit} from "@wordpress/icons";
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { firstImage= "", secondeImage= "", slidemode = "", autoplay = true, cptId, instanceId, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const watchedAttributes = [
		'hasCreatedCPT',
		'firstImage',
		'secondeImage',
		'autoplay',
		'slidemode'
	];


	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "compare";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-compare-${Uuid}`,
				status: 'publish',
				meta: {
					first_image: firstImage,
					second_image: secondeImage,
					autoplay: autoplay,
					slidemode: slidemode,
					attributes: JSON.stringify(attributes)
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);
			if (post && post.id) {
				setAttributes({ cptId: post.id });
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
			const cptName = "compare";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					first_image: firstImage,
					second_image: secondeImage,
					autoplay: autoplay,
					slidemode: slidemode,
					attributes: JSON.stringify(attributes)
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
				<PanelBody title={__('Settings', 'compare-block')}>
					<SelectControl
						label={__('Slidemode', 'compare-block')}
						value={slidemode ??  undefined}
						options={[
							{ label: __('Select...', 'compare-block'), value: '' },
							{ label: __('Hover', 'compare-block'), value: 'hover' },
							{ label: __('Drag', 'compare-block'), value: 'drag' },
						]}
						onChange={(value) => setAttributes({ slidemode: value })}
					/>

					<p>{__('Autoplay', 'compare-block')}</p>
					<ToggleControl
						label={__('Autoplay', 'compare-block')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'compare-block'
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
						icon={ edit }
						label="Edit Slide-Content"
						onClick={ () => setOpen( true ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps} >
					<div style={{display: 'flex'}}>
						<div style={{
							marginTop: '10px',
							maxWidth: '100%',
							backgroundImage: `url(${secondeImage === "" ? dummyBackGround : secondeImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							width: '50%',
							minHeight: '300px',
						}}>
							{(!secondeImage) && (<h1 style={{color: '#fff'}}>2</h1>)}
						</div>
						<div style={{
							marginTop: '10px',
							maxWidth: '100%',
							backgroundImage: `url(${firstImage === "" ? dummyBackGround : firstImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							width: '50%',
							minHeight: '300px',
						}}>
							{(!secondeImage) && (<h1 style={{color: '#fff'}}>1</h1>)}
						</div>
					</div>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<p>{__('Bild rechts', 'compare-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ firstImage: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{firstImage ? __('Change Image', 'compare-block') : __('Select Image', 'compare-block')}
								</Button>
							)}
						/>

						<p>{__('Bild links', 'compare-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ secondeImage: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{secondeImage ? __('Change Image', 'compare-block') : __('Select Image', 'compare-block')}
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
	);
}
