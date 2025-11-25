<?php

function register_carousel_slide() {
	register_post_type('carousel_slide',
		array(
			'labels'      => array(
				'name'          => __('Carousel Slide', 'textdomain'),
				'singular_name' => __('Carousel Slide'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'carouselSlide',
			'graphql_plural_name' => 'carouselSlides',
		)
	);

	register_post_meta('carousel_slide', 'button_label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('carousel_slide', 'label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('carousel_slide', 'background', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('carousel_slide', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'CarouselSlide', 'button_label', [
			'type' => 'String',
			'description' => 'Button Label',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'button_label', true );
			}
		] );

		register_graphql_field( 'CarouselSlide', 'label', [
			'type' => 'String',
			'description' => 'Heading on slide',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'label', true );
			}
		] );

		register_graphql_field( 'CarouselSlide', 'background', [
			'type' => 'String',
			'description' => 'Background of slide',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'background', true );
			}
		] );

		register_graphql_field( 'CarouselSlide', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute of List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
