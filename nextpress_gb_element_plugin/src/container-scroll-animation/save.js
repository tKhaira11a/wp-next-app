import {InnerBlocks} from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { cptId = '' } = attributes;
	return (
		<>
			{`[$ContainerScrollAnimation:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/ContainerScrollAnimation:${cptId}]`}
		</>
	);
}
