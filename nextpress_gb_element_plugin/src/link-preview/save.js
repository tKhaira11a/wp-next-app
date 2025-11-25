
export default function save({ attributes }) {
	const { cptId } = attributes;
	return (
		<>
			[$LinkPreview:{cptId}]
		</>
	);
}
