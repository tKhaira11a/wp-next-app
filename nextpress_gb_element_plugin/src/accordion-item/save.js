import {InnerBlocks} from "@wordpress/block-editor";

export default function save( { attributes } ) {
	const { cptId } = attributes;
	return (
		<>
			{`[$AccordionItem:${cptId}/]`}
				<div>
					<InnerBlocks.Content />
				</div>
			{`[/AccordionItem:${cptId}]`}
		</>
	);
}
