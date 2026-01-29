import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import iconImage from '../../assets/block-icon.png';
import './editor.scss';

registerBlockType( metadata.name, {
	icon: <img src={iconImage ?? undefined} alt="Block Icon" width="24" height="24" />,
	edit: Edit,
	save,
} );
