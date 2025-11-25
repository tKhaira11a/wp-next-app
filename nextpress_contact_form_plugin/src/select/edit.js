import {BlockControls, InspectorControls, RichText, useBlockProps} from "@wordpress/block-editor";
import {ToolbarGroup, ToolbarButton, Modal, Button, PanelBody, SelectControl, TextareaControl, TextControl, ToggleControl} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import {edit} from "@wordpress/icons";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		label = "",
		cptId,
		instanceId,
		style = {css : ""},
		selectValues = [],
		fieldName = ""
	} = attributes;
	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [selectedValue, setSelectedValue] = useState("");
	const [editMode, setEditMode] = useState(true);
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
			const cptName = "select";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-select-${Uuid}`,
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
			const cptName = "select";
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
				<PanelBody title={__('Settings', 'select-block')}>
					<TextControl
						label={__('Field-Name (no spaces)', 'select-block')}
						value={fieldName}
						onChange={(newValue) => {
							handleAttributeChange("fieldName", newValue);
						}}
					/>
					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'switch-block'
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
					placeholder="Label"
				/>

				<SelectControl
					label={__(label, 'select-block')}
					value={selectedValue  ?? undefined}
					options={selectValues}
					onChange={(value) => setSelectedValue(value ?? "")}
				/>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>
						<ToggleControl
							checked={ editMode }
							label={ __(
								'Edit-Mode Classic/Modern',
								'select-block'
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
								label={__('Options (label:value per line)', 'select-block')}
								help={__('Each line: label:value', 'select-block')}
								rows="5"
								value={selectValues.map(opt => `${opt.label}:${opt.value}`).join("\n")}
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
									handleAttributeChange("selectValues", newValues);
								}}
							/>
						</div>

						<div
							style={{
								display: editMode ? "block" : "none"
							}}>
							<div
								style={{
									maxHeight: "300px",
									overflowY: "scroll",
								}}>
								{selectValues.map((opt, index) => (
									<div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
										<div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
											<div style={{ flex: 1 }}>
												<TextControl
													label={__('Label', 'select-block')}
													value={opt.label}
													onChange={(newLabel) => {
														const updated = [...selectValues];
														updated[index].label = newLabel;
														handleAttributeChange("selectValues",updated);
													}}
												/>
											</div>
											<div style={{ flex: 1 }}>
												<TextControl
													label={__('Value', 'select-block')}
													value={opt.value}
													onChange={(newValue) => {
														const updated = [...selectValues];
														updated[index].value = newValue;
														handleAttributeChange("selectValues",updated);
													}}
												/>
											</div>
										</div>
										<Button
											isDestructive
											variant="link"
											onClick={() => {
												const updated = [...selectValues];
												updated.splice(index, 1);
												handleAttributeChange("selectValues",updated);
											}}
										>
											{__('Remove', 'select-block')}
										</Button>
									</div>
								))}
							</div>
							<Button
								variant="primary"
								onClick={() => {
									handleAttributeChange("selectValues",[...selectValues, { label: '', value: '' }]);
								}}
							>
								{__('Add Option', 'select-block')}
							</Button>
						</div>
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
