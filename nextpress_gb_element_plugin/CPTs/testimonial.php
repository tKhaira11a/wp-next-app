<?php

function register_testimonial() {
	register_post_type('testimonial',
		array(
			'labels'      => array(
				'name'          => __('Testimonial', 'textdomain'),
				'singular_name' => __('Testimonial', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'testimonial',
			'graphql_plural_name' => 'testimonials',
		)
	);

	register_post_meta('testimonial', 'quote', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('testimonial', 'testimonial_name', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('testimonial', 'testimonial_title', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('testimonial', 'position', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('testimonial', 'bild', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('testimonial', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Testimonial', 'quote', [
			'type' => 'String',
			'description' => 'Zitat',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'quote', true );
			}
		] );

		register_graphql_field( 'Testimonial', 'testimonial_title', [
			'type' => 'String',
			'description' => 'Name des Zitierten',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'testimonial_title', true );
			}
		] );

		register_graphql_field( 'Testimonial', 'testimonial_name', [
			'type' => 'String',
			'description' => 'Name des Zitierten',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'testimonial_name', true );
			}
		] );

		register_graphql_field( 'Testimonial', 'position', [
			'type' => 'String',
			'description' => 'Stellung/Position in Betrieb',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'position', true );
			}
		] );

		register_graphql_field( 'Testimonial', 'bild', [
			'type' => 'String',
			'description' => 'Label des Buttons',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'bild', true );
			}
		] );

		register_graphql_field( 'Testimonial', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
