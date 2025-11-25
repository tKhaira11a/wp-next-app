import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { cptId } = attributes;
	return (
		<>
			[$ButtonGrid:{cptId}]
			<InnerBlocks.Content />
		</>
	);
}
