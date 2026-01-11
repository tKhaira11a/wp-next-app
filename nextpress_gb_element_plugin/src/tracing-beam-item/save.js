import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$TracingBeamItem:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/TracingBeamItem:${cptId}]`}
		</>
	);
}
