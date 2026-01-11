import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$Collapsible:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/Collapsible:${cptId}]`}
		</>
	);
}
