import { __ } from '@wordpress/i18n';
import {BlockControls, InspectorControls, MediaUpload, RichText, useBlockProps} from '@wordpress/block-editor';
import {
	ToolbarGroup, ToolbarButton, Modal,
	Button, PanelBody, TextControl, ToggleControl,
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
import dummyCardImg from '../../dummy_card_img.jpg';
import {edit} from "@wordpress/icons";
import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId  } ) {
	const {
		header = "",
		subHeader = "",
		background = "",
		linkLable = "",
		linkUrl = "",
		buttonLabel = "",
		buttonUrl = "",
		cptId,
		showLink,
		showButton,
		skew,
		instanceId, style = {css : ""} } = attributes;

	const {saveEntityRecord} = useDispatch('core');
	const [isPendingUpdate, setIsPendingUpdate] = useState(false);
	const [hasCreatedCPT, setHasCreatedCPT] = useState(!!cptId);
	const Uuid = useRef(uuidv4()).current;
	const blockProps = useBlockProps();
	const [ isOpen, setOpen ] = useState( false );
	const [ localLinkLabel, setLocalLinkLabel ] = useState(linkLable);
	const [ localButtonLabel, setLocalButtonLabel ] = useState(buttonLabel);

	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
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
		background,
		attributes,
		header,
		subHeader,
		linkLable,
		linkUrl,
		buttonLabel,
		skew,
		buttonUrl
	]);

	const createCptEntry = async () => {
		setIsPendingUpdate(true);
		try {
			const cptName = "three_d_card";
			const postCategory = "postType";

			const newPostReccord = {
				title: `$-3d-card-${Uuid}`,
				status: 'publish',
				meta: {
					header: header,
					link_url: linkUrl,
					link_lable: linkLable,
					button_url: buttonUrl,
					button_label: buttonLabel,
					sub_header: subHeader,
					skew: skew,
					background: background,
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
			const cptName = "three_d_card";
			const postCategory = "postType";

			const updatedPostReccord = {
				id: cptId,
				meta: {
					header: header,
					link_url: linkUrl,
					link_lable: linkLable,
					button_url: buttonUrl,
					button_label: buttonLabel,
					sub_header: subHeader,
					skew: skew,
					background: background,
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

	const handleAttributeChange = (attribute, value) => {
		setAttributes({ [attribute]: value });
	};
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'Three-D-card-block' ) }>
					<ToggleControl
						checked={ skew }
						label={ __(
							'Skew Effect',
							'Three-D-card-block'
						) }
						onChange={ () =>
							setAttributes( {
								skew: ! skew,
							} )
						}
					/>
					<br/>
					<br/>

					<ToggleControl
						checked={ showLink }
						label={ __(
							'Show Link',
							'Three-D-card-block'
						) }
						onChange={ () =>
							setAttributes( {
								showLink: ! showLink,
							} )
						}
					/>
					<ToggleControl
						checked={ showButton }
						label={ __(
							'Show Button',
							'Three-D-card-block'
						) }
						onChange={ () =>
							setAttributes( {
								showButton: ! showButton,
							} )
						}
					/>

					<TextareaControl
						label={ __(
							'Additional CSS for Element. No selectors!',
							'Three-D-card-block'
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
				<Card
					style={{
						backgroundImage: `url(${background === "" ? dummyCardImg : background})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',

					}}
				>
					<CardHeader>
						<Heading
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.5)',
								padding: '5px'
							}}
							level={ 4 }>{header}</Heading>
					</CardHeader>
					<CardBody>
						<Text
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.5)',
								padding: '5px'
							}}
						>{subHeader}</Text>
					</CardBody>
					<CardFooter>
						<Text
							style={{
								width: '100%'
							}}
						>
							{(showLink &&
								<RichText
									tagName="span"
									value={linkLable}
									onChange={(value) => handleAttributeChange('linkLable', value)}
									placeholder="Link"
									style={{
										backgroundColor: 'rgba(255, 255, 255, 0.5)',
										padding: '5px'
									}}
								/>
							)}
							{(showButton &&
								<RichText
									tagName="button"
									value={buttonLabel}
									onChange={(value) => handleAttributeChange('buttonLabel', value)}
									placeholder="Button"
									style={{
										float: 'right'
									}}
								/>
							)}
						</Text>
					</CardFooter>
				</Card>

				{ isOpen && (
					<Modal
						title="Edit Slide-Content"
						onRequestClose={ () => setOpen( false ) }
					>

						<p>{__('Header', 'Three-D-card-block')}</p>
						<TextControl
							label={ __(
								'Header',
								'Three-D-card-block'
							) }
							value={ header }
							onChange={ ( value ) =>
								setAttributes( { header: value } )
							}
						/>

						<p>{__('Sub-Header', 'Three-D-card-block')}</p>
						<TextControl
							label={ __(
								'Sub-Header',
								'Three-D-card-block'
							) }
							value={ subHeader }
							onChange={ ( value ) =>
								setAttributes( { subHeader : value } )
							}
						/>

						<p>{__('Hintergrundbild', 'Three-D-card-block')}</p>
						<MediaUpload
							onSelect={(media) => setAttributes({ background: media.url })}
							allowedTypes={['image']}
							render={({ open }) => (
								<Button onClick={open} isSecondary>
									{background ? __('Change Image', 'Three-D-card-block') : __('Select Image', 'Three-D-card-block')}
								</Button>
							)}
						/>
						<br/>
						<br/>

						{ showLink && (
							<>
								<TextControl
									label={ __(
										'Link Label',
										'Three-D-card-block'
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
										'Three-D-card-block'
									) }
									value={ linkUrl }
									onChange={ ( value ) =>
										setAttributes( { linkUrl: value } )
									}
								/>
							</>
						) }
						<br />

						{ showButton && (
							<>
								<TextControl
									label={ __(
										'Button Label',
										'Three-D-card-block'
									) }
									value={ localButtonLabel }
									onChange={ ( value ) =>
										setLocalButtonLabel(value)
									}
									onBlur = { () =>
										handleAttributeChange('buttonLabel', localButtonLabel )
									}
								/>
								<TextControl
									label={ __(
										'Button URL',
										'Three-D-card-block'
									) }
									value={ buttonUrl }
									onChange={ ( value ) =>
										setAttributes( { buttonUrl: value } )
									}
								/>
							</>
						) }
					</Modal>
				) }
			</div>
		</>
	);
}
