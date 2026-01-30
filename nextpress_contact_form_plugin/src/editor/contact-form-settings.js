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
