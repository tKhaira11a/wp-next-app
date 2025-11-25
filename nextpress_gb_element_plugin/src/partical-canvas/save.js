import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$ParticalCanvas:${cptId}/]`}
			<div>
				<InnerBlocks.Content />
			</div>
			{`[/ParticalCanvas:${cptId}]`}
		</>
	);
}
