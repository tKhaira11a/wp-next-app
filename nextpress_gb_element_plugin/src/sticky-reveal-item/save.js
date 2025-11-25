import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$StickyRevealItem:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/StickyRevealItem:${cptId}]`}
		</>
	);
}
