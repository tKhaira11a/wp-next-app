import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$BackgroundBoxes:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/BackgroundBoxes:${cptId}]`}
		</>
	);
}
