<?php

function register_animated_testimonial() {
	register_post_type('animated_testimonial',
		array(
			'labels'      => array(
				'name'          => __('Animated Testimonial', 'textdomain'),
				'singular_name' => __('Animated Testimonial', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'animatedTestimonial',
			'graphql_plural_name' => 'animatedTestimonials',
		)
	);

	register_post_meta('animated_testimonial', 'testimonial_list', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('animated_testimonial', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));


	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'AnimatedTestimonial', 'testimonial_list', [
			'type' => 'String',
			'description' => 'Liste der IDs von Child-List-Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'testimonial_list', true );
			}
		] );

		register_graphql_field( 'AnimatedTestimonial', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Animated Testimonial',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
