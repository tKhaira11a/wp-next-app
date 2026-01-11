/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 * https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
 * Copyright (C) 2025 Tarik Khairalla (khairalla-code)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { __ } from '@wordpress/i18n';
import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, SelectControl, TextareaControl, ToggleControl,} from '@wordpress/components';
import {useEffect, useRef, useState} from 'react';
import './editor.scss';
import {useDispatch, useSelect} from "@wordpress/data";
import { v4 as uuidv4 } from 'uuid';
import { store as blockEditorStore } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		cptId,
		instanceId,
		testimonialList,
		speed = "",
		direction = "",
		pauseOnHover = false, style = {css : ""}
	} = attributes;

	const { saveEntityRecord } = useDispatch('core');
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();

	const innerBlocks = useSelect(
		(select) => {
			return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
		},
		[attributes, clientId, isPendingUpdate]
	);

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
		innerBlocks,
		testimonialList,
		attributes,
		speed,
		direction,
		pauseOnHover
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const childLabels = innerBlocks?.map(block => block.attributes?.cptId || null);
			const cptName = "moving_cards";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-moving-cards-${Uuid}`,
				status: 'publish',
				meta: {
					attributes: JSON.stringify(attributes),
					testimonial_list: JSON.stringify(childLabels),
					direction: direction,
					speed: speed,
					pause_on_hover: pauseOnHover
				}
			};

			const post = await saveEntityRecord(postCategory, cptName, newPostReccord);

			if (post && post.id) {
				setAttributes({
					cptId: post.id,
					testimonialList: childLabels
				});
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
			const cptName = "moving_cards";
			const postCategory = "postType";
			const childLabels = innerBlocks?.map(block => block.attributes.cptId);
			const updatedPostReccord = {
				id: cptId,
				meta: {
					attributes: JSON.stringify(attributes),
					testimonial_list: JSON.stringify(childLabels),
					direction: direction,
					speed: speed,
					pause_on_hover: pauseOnHover
				}
			};

			const updatedPost = await saveEntityRecord(postCategory, cptName, updatedPostReccord);

		} catch (error) {
			console.error("Fehler beim Aktualisieren des CPT:", error);
		} finally {
			setIsPendingUpdate(false);
		}
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'moving-cards-block' ) }>

					<SelectControl
						label={__('Speed', 'moving-cards-block')}
						value={speed ??  undefined}
						options={[
							{ label: __('Select...', 'moving-cards-block'), value: '' },
							{ label: __('Fast', 'moving-cards-block'), value: 'fast' },
							{ label: __('Normal', 'moving-cards-block'), value: 'normal' },
							{ label: __('Slow', 'moving-cards-block'), value: 'slow' },
						]}
						onChange={(value) => setAttributes({ speed: value })}
					/>

					<SelectControl
						label={__('direction', 'moving-cards-block')}
						value={direction ??  undefined}
						options={[
							{ label: __('Select...', 'moving-cards-block'), value: '' },
							{ label: __('Left', 'moving-cards-block'), value: 'left' },
							{ label: __('Right', 'moving-cards-block'), value: 'right' },
						]}
						onChange={(value) => setAttributes({ direction: value })}
					/>

					<ToggleControl
						checked={ pauseOnHover }
						label={ __(
							'Pause bei Hover',
							'moving-cards-block'
						) }
						onChange={ () =>
							setAttributes( {
								pauseOnHover: !pauseOnHover,
							} )
						}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'moving-cards-block'
						) }
						help="CSS-Styles"
						value={ style.css }
						onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={['nextpress-block/testimonial']}
					template={[['nextpress-block/testimonial']]}
					templateLock={false}
					className={"wp-block-moving-cards-block-testimonial"}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
				/>
			</div>
		</>
	);
}
