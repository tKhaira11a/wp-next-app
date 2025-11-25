import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import iconImage from '../../block-icon.png';

registerBlockType( metadata.name, {
	icon: <img src={iconImage ?? undefined} alt="Block Icon" width="24" height="24" />,
	__experimentalLabel: ( attributes, { context } ) => {
		return attributes.header || 'Ohne Titel';
	},
	edit: Edit,
	save,
} );
