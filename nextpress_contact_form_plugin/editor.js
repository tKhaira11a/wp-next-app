const { getBlockTypes, unregisterBlockType } = wp.blocks;
const { select } = wp.data;

wp.domReady(() => {
	const allowedCategory = 'nextpress-form-blocks';
	const allBlocks = getBlockTypes();

	allBlocks.forEach((block) => {
		if (block.category === allowedCategory) {
			unregisterBlockType(block.name);
		}
	});
});
