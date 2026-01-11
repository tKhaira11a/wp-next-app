import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl, TextareaControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

const ContactFormSettings = () => {
	const postType = useSelect((select) => {
		return select('core/editor').getCurrentPostType();
	}, []);
	const metaFields = useSelect((select) => {
		return select('core/editor').getEditedPostAttribute('meta') || {};
	}, []);

	const { editPost } = useDispatch('core/editor');

	if (postType !== 'np_contact_form') {
		return null;
	}

	const updateMetaField = (fieldName, value) => {
		editPost({
			meta: {
				...metaFields,
				[fieldName]: value
			}
		});
	};

	return (
		<PluginDocumentSettingPanel
			name="contact-form-settings"
			title={__('Message Editor', 'nextpress-forms')}
			className="contact-form-settings-panel"
		>
			<PanelRow>
				<TextControl
					label={__('Absender', 'nextpress-forms')}
					value={metaFields.from || ''}
					onChange={(value) => updateMetaField('from', value)}
					help={__('URL where the form data will be sent', 'nextpress-forms')}
				/>
			</PanelRow>

			<PanelRow>
				<TextControl
					label={__('Empfänger', 'nextpress-forms')}
					value={metaFields.to || ''}
					onChange={(value) => updateMetaField('to', value)}
					help={__('URL to redirect after successful submission', 'nextpress-forms')}
				/>
			</PanelRow>

			<PanelRow>
				<TextControl
					label={__('Betreff', 'nextpress-forms')}
					value={metaFields.subject || ''}
					onChange={(value) => updateMetaField('subject', value)}
					help={__('Comma-separated email addresses', 'nextpress-forms')}
				/>
			</PanelRow>

			<PanelRow>
				<TextareaControl
					label={__('Nachricht', 'nextpress-forms')}
					value={metaFields.message || ''}
					onChange={(value) => updateMetaField('message', value)}
					help={__('Additional CSS for this form', 'nextpress-forms')}
					rows={6}
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin('contact-form-settings', {
	render: ContactFormSettings,
	icon: 'feedback',
});
