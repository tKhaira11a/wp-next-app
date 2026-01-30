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

import {InspectorControls, useBlockProps} from "@wordpress/block-editor";
import { PanelBody, SelectControl, TextareaControl} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		cptId,
		instanceId,
		style = { css: "" },
		selectedValue
	} = attributes;
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const blockProps = useBlockProps();
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const { saveEntityRecord } = useDispatch('core');
	const Uuid = useRef(uuidv4()).current;
	const contactContents = useSelect((select) => {
		const { getEntityRecords } = select('core');
		const posts = getEntityRecords('postType', 'np_contact_form', { per_page: -1 });

		if (!posts) return [{ label: "Please select Form...", value: "" }];

		const defaultOption = { label: "Please select Form...", value: "" };
		const postOptions = posts.map((post) => ({
			label: `[${post.id}] ${post.title?.rendered || 'Untitled'}`,
			value: post.id.toString()
		}));
		return [defaultOption, ...postOptions];
	}, []);

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				instanceId: clientId
			});
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
		attributes,
		selectedValue
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "form_block";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-form-block-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					selected_value: JSON.stringify(selectedValue)
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
			const cptName = "form_block";
			const postCategory = "postType";
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					selected_value: JSON.stringify(selectedValue)
				}
			};

			const updatedPost = await saveEntityRecord(postCategory, cptName, updatedPostReccord);
		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}

	const handleFormSelect = (value) => {
		setAttributes({
			selectedValue: {
				value: value,
				label: `[${value}]`,
			}
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'np-contact-form-block')}>
					<SelectControl
						label={__("Registrierte Formulare", 'np-contact-form-block')}
						value={selectedValue.value}
						options={contactContents}
						onChange={handleFormSelect}
					/>
					<TextareaControl
						label={__('Additional CSS for Element. No selectors!', 'np-contact-form-block')}
						help="CSS-Styles"
						value={style.css}
						onChange={(value) => setAttributes({ style: { css: value } })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{selectedValue?.value ? `Form ID: ${selectedValue?.value}` : __('No form selected', 'np-contact-form-block')}
			</div>
		</>
	);
}
