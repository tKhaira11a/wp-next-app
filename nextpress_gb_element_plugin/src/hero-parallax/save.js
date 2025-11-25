import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { cptId } = attributes;
	return (
		<>
			[$HeroParallax:{cptId}]
			<InnerBlocks.Content />
		</>
	);
}
