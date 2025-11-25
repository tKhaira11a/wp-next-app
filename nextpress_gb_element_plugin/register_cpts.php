<?php
	require_once(__DIR__.'/CPTs/animated-testimonial.php');
	require_once(__DIR__.'/CPTs/background-boxes.php');
	require_once(__DIR__.'/CPTs/button-grid.php');
	require_once(__DIR__.'/CPTs/carousel.php');
	require_once(__DIR__.'/CPTs/carousel-slide.php');
	require_once(__DIR__.'/CPTs/compare.php');
	require_once(__DIR__.'/CPTs/hero-parallax.php');
	require_once(__DIR__.'/CPTs/hero-parallax-product.php');
	require_once(__DIR__.'/CPTs/list-item.php');
	require_once(__DIR__.'/CPTs/partical-canvas.php');
	require_once(__DIR__.'/CPTs/testimonial.php');
	require_once(__DIR__.'/CPTs/textgenerate-effekt.php');
	require_once(__DIR__.'/CPTs/accordion.php');
	require_once(__DIR__.'/CPTs/accordion-item.php');
	require_once(__DIR__.'/CPTs/button.php');
	require_once(__DIR__.'/CPTs/simple-carousel.php');
	require_once(__DIR__.'/CPTs/simple-carousel-slide.php');
	require_once(__DIR__.'/CPTs/progress.php');
	require_once(__DIR__.'/CPTs/collapsible.php');
	require_once(__DIR__.'/CPTs/three-d-card.php');
	require_once(__DIR__.'/CPTs/three-d-marquee.php');
	require_once(__DIR__.'/CPTs/three-d-pin-card.php');
	require_once(__DIR__.'/CPTs/container-scroll-animation.php');
	require_once(__DIR__.'/CPTs/expandable-card-container.php');
	require_once(__DIR__.'/CPTs/expandable-card.php');
	require_once(__DIR__.'/CPTs/link-preview.php');
	require_once(__DIR__.'/CPTs/moving-cards.php');
	require_once(__DIR__.'/CPTs/text-reveal-card.php');
	require_once(__DIR__.'/CPTs/parallax-grid.php');
	require_once(__DIR__.'/CPTs/animated-tab-control.php');
	require_once(__DIR__.'/CPTs/animated-tab.php');
	require_once(__DIR__.'/CPTs/macbook-scroll.php');
	require_once(__DIR__.'/CPTs/timeline-container.php');
	require_once(__DIR__.'/CPTs/timeline-item.php');
	require_once(__DIR__.'/CPTs/tracing-beam-container.php');
	require_once(__DIR__.'/CPTs/tracing-beam-item.php');
	require_once(__DIR__.'/CPTs/sticky-reveal-container.php');
	require_once(__DIR__.'/CPTs/sticky-reveal-item.php');

	function register_block_cpts() {
		register_textgenerate_effekt();
		register_list_item();
		register_button_grid();
		register_partical_canvas();
		register_background_boxes();
		register_animated_testimonial();
		register_testimonial();
		register_compare();
		register_hero_parallax();
		register_hero_parallax_product();
		register_carousel();
		register_carousel_slide();
		register_accordion();
		register_accordion_item();
		register_button();
		register_simple_carousel();
		register_simple_carousel_slide();
		register_progress();
		register_collapsible();
		register_three_d_card();
		register_three_d_marquee();
		register_three_d_pin_card();
		register_container_scroll_animation();
		register_expandable_card_container();
		register_expandable_card();
		register_link_preview();
		register_moving_cards();
		register_text_reveal_card();
		register_parallax_grid();
		register_ani_tab_control();
		register_animated_tab();
		register_macbook_scroll();
		register_timeline_container();
		register_timeline_item();
		register_tracing_beam_container();
		register_tracing_beam_item();
		register_sticky_reveal_container();
		register_sticky_reveal_item();
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
