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

import {InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {PanelBody, RangeControl, TextareaControl, TextControl} from "@wordpress/components";
import './editor.scss';
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import './editor.scss';
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {useCptSync} from "../hooks/useCptSync";

export default function Edit({ attributes, setAttributes, clientId  }) {
	const { value = 50, cptId, instanceId, style = {css : ""}  } = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const watchedAttributes = [
		'hasCreatedCPT',
		'value'
	];

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "progress";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-progress-${Uuid}`,
				status: 'publish',
				meta: {
					value: value.toString(),
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
			const cptName = "progress";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					value: value.toString(),
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
				<PanelBody title={__('Settings', 'progress-block')}>
					<RangeControl
						label={__('Progress in %', 'progress-block')}
						value={value}
						onChange={(value) => handleAttributeChange('value', value)}
						max={100}
						min={0}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'progress-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps} >
				<div style={{
						background: '#000',
						minHeight: '15px',
						borderRadius: '15px',
				}}
				>
					<div style={{
							background: '#ff0000',
							width: value.toString()+"%",
							minHeight: '15px',
							borderRadius: '15px'
					}}>

					</div>
				</div>
			</div>
		</>
	);
}
