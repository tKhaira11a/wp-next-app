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

import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import './editor.scss';
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, TextareaControl, TextControl} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import dummyBackground from '../../assets/dummy-background.jpg';
import { edit } from '@wordpress/icons';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {buttonLabel = "", label = "", background = "", cptId, instanceId, style = {css : ""}} = attributes;
	const [ isOpen, setOpen ] = useState( false );
	const [ localLabel, setLocalLabel ] = useState(label);
	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'label',
		'background',
		'buttonLabel'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "carousel_slide";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-carousel-slide-${Uuid}`,
				status: 'publish',
				meta: {
					label: label,
					background: background,
					attributes: JSON.stringify(attributes),
					button_label: buttonLabel
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);
			if (post && post.id) {
				setAttributes({cptId: post.id});
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
			const cptName = "carousel_slide";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					label: label,
					background: background,
					attributes: JSON.stringify(attributes),
					button_label: buttonLabel
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
			{/*################################## Block-Meta Side-Bar (right) #########################################*/}
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'carousel-slide-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'carousel-slide-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>

			{/*################################## Block-Edit Top-Bar #########################################*/}
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ edit }
						label="Edit Slide-Content"
						onClick={ () => setOpen( true ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			{/*################################## Layout-Canvas #########################################*/}
			<div {...blockProps} style={{display: 'flex', flexDirection: 'column'}}>
				<div style={{
					marginTop: '10px',
					backgroundImage: `url(${background === "" ? dummyBackground : background})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					minHeight: "80px",
					minWidth: "170px",
					position: 'relative'
				}}>
					<RichText
						tagName="h1"
						value={label}
						onChange={(value) => handleAttributeChange('label', value)}
						placeholder="Hier Text eingeben..."
					/>
					<RichText
						tagName="button"
						value={buttonLabel}
						onChange={(value) => handleAttributeChange('buttonLabel', value)}
						placeholder="Click here"
					/>
					{ isOpen && (
						<Modal
							title="Edit Slide-Content"
							onRequestClose={ () => setOpen( false ) }
						>
							<TextControl
								label={ __(
									'Header',
									'carousel-slide-block'
								) }
								value={ localLabel }
								onChange={ ( value ) =>
									setLocalLabel(value)
								}
								onBlur = { () =>
									handleAttributeChange('label', localLabel )
								}
							/>
							<TextControl
								label={ __(
									'Button Label',
									'carousel-slide-block'
								) }
								value={ buttonLabel }
								onChange={ ( value ) =>
									handleAttributeChange('buttonLabel', value)
								}
							/>
							<p>{__('Hintergrundbild', 'carousel-slide-block')}</p>
							<MediaUpload
								onSelect={(media) => setAttributes({ background: media.url })}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button onClick={open} isSecondary>
										{background ? __('Change Image', 'carousel-slide-block') : __('Select Image', 'carousel-slide-block')}
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
			</div>
		</>
	);
}
