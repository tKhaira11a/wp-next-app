<?php
	require_once(__DIR__.'/CPTs/register_new_cpt.php');

	$cpt_dictionary = [
		'Background Boxes' => [
			'child_ids' => 'string',
			'child_content' => 'string',
			'attributes' => 'string'
		],
		'Link Preview' => [
			'label' => 'string',
			'url' => 'string',
			'attributes' => 'string'
		],
		'Button Grid' => [
			'list_item_ids' => 'string',
			'attributes' => 'string'
		],
		'Carousel' => [
			'slide_ids' => 'string',
			'initial_index' => 'number',
			'attributes' => 'string'
		],
		'Carousel Slide' => [
			'button_label' => 'string',
			'label' => 'string',
			'background' => 'string',
			'attributes' => 'string'
		],
		'Compare' => [
			'first_image' => 'string',
			'second_image' => 'string',
			'slidemode' => 'string',
			'autoplay' => 'boolean',
			'attributes' => 'string'
		],
		'Parallax Heroshot' => [
			'product_list_ids' => 'string',
			'attributes' => 'string'
		],
		'Hero Parallax Prod' => [
			'url' => 'string',
			'label' => 'string',
			'background' => 'string',
			'attributes' => 'string'
		],
		'List Item' => [
			'url' => 'string',
			'label' => 'string',
			'attributes' => 'string'
		],
		'Partical Canvas' => [
			'child_ids' => 'string',
			'attributes' => 'string',
			'particle_color' => 'string',
			'background' => 'string',
			'interactive' => 'boolean',
			'speed' => 'string',
			'density' => 'string',
			'child_content' => 'string'
		],
		'Testimonial' => [
			'quote' => 'string',
			'testimonial_name' => 'string',
			'testimonial_title' => 'string',
			'position' => 'string',
			'bild' => 'string',
			'attributes' => 'string'
		],
		'Textgen Effekt' => [
			'duration' => 'number',
			'words' => 'string',
			'attributes' => 'string'
		],
		'Accordion Item' => [
			'card_header' => 'string',
			'child_content' => 'string',
			'attributes' => 'string'
		],
		'Accordion' => [
			'accordion_items' => 'string',
			'attributes' => 'string'
		],
		'Simple Carousel' => [
			'slide_ids' => 'string',
			'initial_index' => 'number',
			'attributes' => 'string'
		],
		'S Carousel Slide' => [
			'background' => 'string',
			'label' => 'string',
			'attributes' => 'string'
		],
		'Progress' => [
			'value' => 'string',
			'attributes' => 'string'
		],
		'Button' => [
			'url' => 'string',
			'label' => 'string',
			'attributes' => 'string'
		],
		'Sticky Reveal Item' => [
			'item_title' => 'string',
			'description' => 'string',
			'child_content' => 'string',
			'child_ids' => 'string',
			'attributes' => 'string'
		],
		'Sticky Reveal Con' => [
			'item_ids' => 'string',
			'attributes' => 'string',
			'background' => 'string'
		],
		'Tracing Beam Item' => [
			'badge' => 'string',
			'image' => 'string',
			'item_title' => 'string',
			'child_content' => 'string',
			'child_ids' => 'string',
			'attributes' => 'string'
		],
		'Trac Beam Con' => [
			'item_ids' => 'string',
			'attributes' => 'string'
		],
		'Timeline Item' => [
			'item_title' => 'string',
			'child_content' => 'string',
			'child_ids' => 'string',
			'attributes' => 'string'
		],
		'Timeline Container' => [
			'item_ids' => 'string',
			'attributes' => 'string'
		],
		'Macbook Scroll' => [
			'box_title' => 'string',
			'src' => 'string',
			'show_gradient' => 'boolean',
			'attributes' => 'string'
		],
		'Animated Tab' => [
			'child_ids' => 'string',
			'tab_title' => 'string',
			'tab_value' => 'string',
			'child_content' => 'string',
			'attributes' => 'string'
		],
		'Animated Tab-Control' => [
			'tab_ids' => 'string',
			'attributes' => 'string',
			'initial_index' => 'number'
		],
		'Animated Testimonial' => [
			'testimonial_list' => 'string',
			'attributes' => 'string'
		],
		'Text Reveal Card' => [
			'text' => 'string',
			'reveal_text' => 'string',
			'card_title' => 'string',
			'card_description' => 'string',
			'attributes' => 'string'
		],
		'Moving Cards' => [
			'testimonial_list' => 'string',
			'direction' => 'string',
			'speed' => 'string',
			'pause_on_hover' => 'boolean',
			'attributes' => 'string'
		],
		'Parallax Grid' => [
			'images' => 'string',
			'attributes' => 'string'
		],
		'Expandable Card' => [
			'description' => 'string',
			'card_title' => 'string',
			'src' => 'string',
			'cta_text' => 'string',
			'cta_link' => 'string',
			'card_content' => 'string',
			'attributes' => 'string'
		],
		'Exp Card Container' => [
			'expandable_cards' => 'string',
			'list_mode' => 'string',
			'attributes' => 'string'
		],
		'Container Scroll Ani' => [
			'child_ids' => 'string',
			'background' => 'string',
			'child_content' => 'string',
			'attributes' => 'string'
		],
		'Three D Card' => [
			'card_header' => 'string',
			'sub_header' => 'string',
			'background' => 'string',
			'link_url' => 'string',
			'link_lable' => 'string',
			'skew' => 'boolean',
			'button_label' => 'string',
			'button_url' => 'string',
			'attributes' => 'string'
		],
		'Three D Marquee' => [
			'images' => 'string',
			'attributes' => 'string'
		],
		'Three D Pin-Card' => [
			'card_header' => 'string',
			'sub_header' => 'string',
			'link_url' => 'string',
			'link_label' => 'string',
			'attributes' => 'string'
		],
		'Collapsible' => [
			'trigger_label' => 'string',
			'child_content' => 'string',
			'attributes' => 'string'
		]
	];

	add_action('init', function() use ($cpt_dictionary) {
		foreach($cpt_dictionary as $displayName => $customFields) {
			register_new_CPT($displayName, $customFields);
		}
	});

	add_action('graphql_register_types', function() use ($cpt_dictionary) {
		register_all_graphql_types($cpt_dictionary);
	});
