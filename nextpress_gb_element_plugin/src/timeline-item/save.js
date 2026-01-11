import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$TimelineItem:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/TimelineItem:${cptId}]`}
		</>
	);
}
