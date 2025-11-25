const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'contact-form-settings': './src/editor/contact-form-settings.js',
		'checkbox/index': './src/checkbox/index.js',
		'date-picker/index': './src/date-picker/index.js',
		'np-contact-form/index': './src/np-contact-form/index.js',
		'radio-group/index': './src/radio-group/index.js',
		'select/index': './src/select/index.js',
		'switch/index': './src/switch/index.js',
		'textarea/index': './src/textarea/index.js',
		'textbox/index': './src/textbox/index.js',
		'file-upload/index': './src/file-upload/index.js'
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
		path: path.resolve(process.cwd(), 'build'),
	},
};
