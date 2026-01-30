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

import {BlockControls, InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {
	Button, CheckboxControl,
	PanelBody,
	RadioControl,
	TextareaControl,
	TextControl,
	ToggleControl,
	ToolbarGroup, ToolbarButton, Modal
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {edit} from "@wordpress/icons";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		label = "",
		cptId, instanceId,
		style = {css : ""},
		radioOptions = [],
		defaultValue = "",
		fieldName = ""
	} = attributes;
	const [selectedValue, setSelectedValue] = useState(defaultValue);
	const [editMode, setEditMode] = useState(true);
	const { saveEntityRecord } = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );


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
		label,
		attributes,
		fieldName
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "radio_group";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-radio-group-${Uuid}`,
				status: 'publish',
				meta: {
					label: label,
					attributes: JSON.stringify(attributes),
					field_name: fieldName
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
			const cptName = "radio_group";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					label: label,
					attributes: JSON.stringify(attributes),
					field_name: fieldName
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
				<PanelBody title={__('Settings', 'radio-block')}>
					<TextControl
						label={__('Field-Name (no spaces)', 'radio-block')}
						value={fieldName}
						onChange={(newValue) => {
							handleAttributeChange("fieldName", newValue);
						}}
					/>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'radio-block'
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
				<RichText
					tagName="label"
					value={label}
					onChange={(value) => handleAttributeChange('label', value)}
					placeholder="Radio Group Label"
				/>

				<RadioControl
					label={__(label, 'radio-block')}
					selected={selectedValue}
					options={radioOptions}
					onChange={(value) => setSelectedValue(value)}
				/>
			</div>
			{ isOpen && (
				<Modal
					title="Edit Slide-Content"
					onRequestClose={ () => setOpen( false ) }
				>
					<ToggleControl
						checked={ editMode }
						label={ __(
							'Edit-Mode Classic/Modern',
							'radio-block'
						) }
						onChange={ () =>
							setEditMode( ! editMode )
						}
					/>
					<div
						style={{
							display: !editMode ? "block" : "none",
						}}
					>
						<TextareaControl
							label={__('Radio Options (label:value per line)', 'radio-block')}
							help={__('Each line: label:value', 'radio-block')}
							rows="5"
							value={radioOptions.map(opt => `${opt.label}:${opt.value}`).join("\n")}
							onKeyDown={(e) => {
								e.stopPropagation();
							}}
							onChange={(text) => {
								const lines = text.split("\n");
								const newValues = lines.map(line => {
									const parts = line.split(":");
									if (parts.length >= 2) {
										return {
											label: parts[0].trim(),
											value: parts.slice(1).join(":").trim()
										};
									} else if (line.trim()) {
										return {
											label: line.trim(),
											value: ""
										};
									} else {
										return {
											label: "",
											value: ""
										};
									}
								});
								handleAttributeChange("radioOptions", newValues);
							}}
						/>
					</div>

					<div
						style={{
							display: editMode ? "block" : "none",
						}}
					>
						{radioOptions.map((opt, index) => (
							<div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
								<div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
									<div style={{ flex: 1 }}>
										<TextControl
											label={__('Label', 'radio-block')}
											value={opt.label}
											onChange={(newLabel) => {
												const updated = [...radioOptions];
												updated[index].label = newLabel;
												handleAttributeChange("radioOptions", updated);
											}}
										/>
									</div>
									<div style={{ flex: 1 }}>
										<TextControl
											label={__('Value', 'radio-block')}
											value={opt.value}
											onChange={(newValue) => {
												const updated = [...radioOptions];
												updated[index].value = newValue;
												handleAttributeChange("radioOptions", updated);
											}}
										/>
									</div>
								</div>
								<div style={{ marginTop: '10px' }}>
									<CheckboxControl
										label={__('Set as default', 'radio-block')}
										checked={defaultValue === opt.value}
										onChange={(isChecked) => {
											if (isChecked) {
												handleAttributeChange("defaultValue", opt.value);
												setSelectedValue(opt.value);
											} else {
												handleAttributeChange("defaultValue", "");
												setSelectedValue("");
											}
										}}
									/>
								</div>
								<Button
									isDestructive
									variant="link"
									onClick={() => {
										const updated = [...radioOptions];
										// Wenn wir die Default-Option löschen, Default zurücksetzen
										if (defaultValue === opt.value) {
											handleAttributeChange("defaultValue", "");
											setSelectedValue("");
										}
										updated.splice(index, 1);
										handleAttributeChange("radioOptions", updated);
									}}
								>
									{__('Remove', 'radio-block')}
								</Button>
							</div>
						))}
						<Button
							variant="primary"
							onClick={() => {
								handleAttributeChange("radioOptions", [...radioOptions, { label: '', value: '' }]);
							}}
						>
							{__('Add Radio Option', 'radio-block')}
						</Button>
					</div>
					<br />
					<br />
					<Button variant="secondary" onClick={ () => setOpen( false ) }>
						Schließen
					</Button>
				</Modal>
			) }
		</>
	);
}
