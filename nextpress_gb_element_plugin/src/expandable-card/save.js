
export default function save( { attributes } ) {
	const { cptId } = attributes;
	return (
		<>
			[$ExpandableCard:{cptId}]
		</>
	);
}
