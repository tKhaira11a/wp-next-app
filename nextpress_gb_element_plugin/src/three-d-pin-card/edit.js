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

import './editor.scss';
import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls , RichText, useBlockProps} from '@wordpress/block-editor';
import {
	ToolbarGroup, ToolbarButton, Modal, Button,
	PanelBody, TextControl,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	__experimentalText as Text,
	__experimentalHeading as Heading, TextareaControl
} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import {useDispatch} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {edit} from "@wordpress/icons";
import {useCptSync} from "../hooks/useCptSync";

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		header = "",
		subHeader = "",
		linkLabel = "",
		linkUrl = "",
		cptId,
		instanceId, style = {css : ""} } = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localHeader, setLocalHeader ] = useState(header);
	const [ localSubHeader, setLocalSubHeader ] = useState(subHeader);
	const [ localLinkLabel, setLocalLinkLabel ] = useState(linkLabel);
	const watchedAttributes = [
		'hasCreatedCPT',
		'header',
		'subHeader',
		'linkLabel',
		'linkUrl'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "three_d_pincard";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-3d-pin-card-${Uuid}`,
				status: 'publish',
				meta: {
					card_header: header,
					sub_header: subHeader,
					link_url: linkUrl,
					link_label: linkLabel,
					attributes: JSON.stringify(attributes)
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
			const cptName = "three_d_pincard";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					card_header: header,
					sub_header: subHeader,
					link_url: linkUrl,
					link_label: linkLabel,
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
				<PanelBody title={ __( 'Settings', 'Three-D-pin-card-block' ) }>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'Three-D-pin-card-block'
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
				<Card className={"from-violet-500 via-purple-500 to-blue-500"} >
					<CardHeader>
						<Heading level={ 4 }>
							<RichText
								tagName="span"
								value={header}
								onChange={(value) => handleAttributeChange('header', value)}
								placeholder="Link"
							/>
						</Heading>
					</CardHeader>
					<CardBody>
						<Text>
							<RichText
								tagName="span"
								value={subHeader}
								onChange={(value) => handleAttributeChange('subHeader', value)}
								placeholder="Link"
							/>
							<div
								className={"background from-violet-500 via-purple-500 to-blue-500"}
							/>
						</Text>
					</CardBody>
					<CardFooter>
						<Text>
							<RichText
								tagName="span"
								value={linkLabel}
								onChange={(value) => handleAttributeChange('linkLabel', value)}
								placeholder="Link"
							/>
						</Text>
					</CardFooter>
				</Card>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>

						<TextControl
							label={ __(
								'Header',
								'Three-D-pin-card-block'
							) }
							value={ localHeader }
							onChange={ ( value ) =>
								setLocalHeader(value)
							}
							onBlur = { () =>
								handleAttributeChange('header', localHeader )
							}
						/>

						<TextControl
							label={ __(
								'Sub-Header',
								'Three-D-pin-card-block'
							) }
							value={ localSubHeader }
							onChange={ ( value ) =>
								setLocalSubHeader(value)
							}
							onBlur = { () =>
								handleAttributeChange('subHeader', localSubHeader )
							}
						/>

						<TextControl
							label={ __(
								'Link Label',
								'Three-D-pin-card-block'
							) }
							value={ localLinkLabel }
							onChange={ ( value ) =>
								setLocalLinkLabel(value)
							}
							onBlur = { () =>
								handleAttributeChange('linkLabel', localLinkLabel )
							}
						/>

						<TextControl
							label={ __(
								'Link URL',
								'Three-D-pin-card-block'
							) }
							value={ linkUrl }
							onChange={ ( value ) =>
								setAttributes( { linkUrl: value } )
							}
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
