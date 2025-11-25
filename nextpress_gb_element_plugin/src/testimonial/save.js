
export default function save( { attributes } ) {
	const { cptId } = attributes;
	return (
		<>
			[$testimonial:{cptId}]
		</>
	);
}
