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
	import {InnerBlocks, InspectorControls, useBlockProps} from '@wordpress/block-editor';
	import { useDispatch, useSelect } from '@wordpress/data';
	import { useEffect, useRef, useState } from '@wordpress/element';
	import { v4 as uuidv4 } from 'uuid';
	import { store as blockEditorStore } from '@wordpress/block-editor';
	import {PanelBody, TextControl, Panel, TextareaControl} from "@wordpress/components";
	import {__} from "@wordpress/i18n";
	import { serialize } from '@wordpress/blocks';
	import {useCptSync} from "../hooks/useCptSync";

	export default function Edit({ attributes, setAttributes, clientId }) {
		const {
			cptId,
			instanceId,
			childContent,
			triggerLabel = "", style = {css : ""}
		} = attributes;
		const { saveEntityRecord } = useDispatch('core');
		const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
		const [isPendingUpdate, setIsPendingUpdate] = useState(false);
		const Uuid = useRef(uuidv4()).current;
		const blockProps = useBlockProps();
		const watchedAttributes = [
			'hasCreatedCPT',
			'childContent',
			'triggerLabel'
		];

		const extractTextContent = (blocks) => {
			return blocks.flatMap((block) => {
				const content = block.attributes?.content || '';
				const children = extractTextContent(block.innerBlocks || []);
				return [content, ...children];
			});
		};
		const innerBlocks = useSelect((select) => {
			return select(blockEditorStore).getBlock(clientId)?.innerBlocks || [];
		},[attributes, clientId, isPendingUpdate]);

		const createCptEntry = async () => {
			setIsPendingUpdate(true);
			try {
				let childContent = "";
				if(innerBlocks && innerBlocks.length > 0) {
					innerBlocks.forEach((block) => {
						childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
							.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
							.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
					})
				}
				const post = await saveEntityRecord('postType', 'collapsible', {
					title: `collapsible-${Uuid}`,
					status: 'publish',
					meta: {
						attributes: JSON.stringify(attributes),
						child_content: childContent,
						trigger_label: triggerLabel
					}
				});

				if (post?.id) {
					setAttributes({
						cptId: post.id,
						childContent: childContent,
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
				let childContent = "";
				if(innerBlocks && innerBlocks.length > 0) {
					innerBlocks.forEach((block) => {
						childContent += serialize(block, {isInnerBlocks: true, skipComments: true})
							.replace(/<!--[^>]*-->/g, '') //Entfernt alle WP-Block-Quotes, auch genestete
							.replace(/\n\s*\n/g, '\n'); //Entfernt überflüssige Linebreaks
					})
				}
				await saveEntityRecord('postType', 'collapsible', {
					id: cptId,
					meta: {
						attributes: JSON.stringify(attributes),
						child_content: childContent,
						trigger_label: triggerLabel
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
					<PanelBody title={ __( 'Settings', 'collapsible-block' ) }>
						<TextControl
							label={ __(
								'Trigger-Label',
								'collapsible-block'
							) }
							value={ triggerLabel }
							onChange={ ( value ) =>
								setAttributes( { triggerLabel: value } )
							}
						/>


						<TextareaControl
							label={ __(
								'Additional CSS for Element. No selectors!',
								'collapsible-block'
							) }
							help="CSS-Styles"
							value={ style.css }
							onChange={ ( value ) => setAttributes( { style: {css: value }} ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps} >
					<div style={{
						marginTop: '10px',
						maxWidth: '100%',
						width: '100%',
						minHeight: '300px',
						color: "lightgray"
					}} >
						<Panel>
							<PanelBody title={ __( triggerLabel, 'collapsible-block' ) }>
								<InnerBlocks
									template={[
										['core/group']
									]}
									templateLock={false}
									className={"wp-block-collapsible"}
									renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
								/>
							</PanelBody>
						</Panel>
					</div>
				</div>
			</>
		)
	}
