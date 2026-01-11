<?php
	require_once(__DIR__.'/CPTs/register_new_cpt.php');

	function register_block_cpts() {
		$cpt_dictonary = [
			'Background Boxes' => [
				'child_ids' => 'string',
				'child_content' => 'number',
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
			'Hero Parallax Product' => [
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
				'header' => 'string',
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
			'Sticky Reveal Container' => [
				'item_ids' => 'string',
				'attributes' => 'string'
			],
			'Tracing Beam Item' => [
				'badge' => 'string',
				'image' => 'string',
				'item_title' => 'string',
				'child_content' => 'string',
				'child_ids' => 'string',
				'attributes' => 'string'
			],
			'Tracing Beam Container' => [
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
				'attributes' => 'string'
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
				'label' => 'string',
				'url' => 'string',
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
			'Expandable Card Container' => [
				'expandable_cards' => 'string',
				'list_mode' => 'string',
				'attributes' => 'string'
			],
			'Container Scroll Animation' => [
				'child_ids' => 'string',
				'background' => 'string',
				'child_content' => 'string',
				'attributes' => 'string'
			],
			'Three D Card' => [
				'header' => 'string',
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
				'header' => 'string',
				'sub_header' => 'string',
				'link_url' => 'string',
				'link_label' => 'boolean',
				'attributes' => 'string'
			],
			'Collapsible' => [
				'trigger_label' => 'string',
				'child_content' => 'string',
				'attributes' => 'string'
			]
		];

		foreach($cpt_dictonary as $cptName => $customFields) {
			register_new_CPT($cptName, $customFields);
		}
	}
	add_action('init', 'register_block_cpts');




/* TESTESTESTESTESTETSTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTESTEST
add_action( 'graphql_register_types', function() {
	register_graphql_mutation('submitContactForm', [
	  'inputFields' => [
		'name' => ['type' => 'String'],
		'email' => ['type' => 'String'],
		'subject' => ['type' => 'String'],
		'message' => ['type' => 'String']
	  ],
	  'outputFields' => [
		'success' => ['type' => 'Boolean'],
		'message' => ['type' => 'String']
	  ],
	  'mutateAndGetPayload' => function($input) {
		$to = get_option('admin_email');
		$subject = sanitize_text_field($input['subject']);
		$message = "Name: " . sanitize_text_field($input['name']) . "\n";
		$message .= "Email: " . sanitize_email($input['email']) . "\n\n";
		$message .= sanitize_textarea_field($input['message']);

		$headers = ['Reply-To: ' . sanitize_email($input['email'])];

		$sent = wp_mail($to, $subject, $message, $headers);

		return [
		  'success' => $sent,
		  'message' => $sent ? 'Message sent successfully' : 'Failed to send message'
		];
	  }
	]);
});
*/
