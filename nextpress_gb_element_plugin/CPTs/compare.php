<?php

function register_compare() {
	register_post_type('compare',
		array(
			'labels'      => array(
				'name'          => __('Compare', 'textdomain'),
				'singular_name' => __('Compare', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' 	 => true,
			'graphql_single_name' => 'compare',
			'graphql_plural_name' => 'compares',
		)
	);

	register_post_meta('compare', 'first_image', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('compare', 'second_image', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('compare', 'slidemode', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('compare', 'autoplay', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'boolean',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('compare', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));


	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Compare', 'first_image', [
			'type' => 'String',
			'description' => 'First Image',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'first_image', true );
			}
		] );

		register_graphql_field( 'Compare', 'second_image', [
			'type' => 'String',
			'description' => 'Seconde Image',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'second_image', true );
			}
		] );
		register_graphql_field( 'Compare', 'slidemode', [
			'type' => 'String',
			'description' => 'Slide/Drag',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'slidemode', true );
			}
		] );
		register_graphql_field( 'Compare', 'autoplay', [
			'type' => 'String',
			'description' => 'Autoplay of compare',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'autoplay', true );
			}
		] );
		register_graphql_field( 'Compare', 'attributes', [
			'type' => 'String',
			'description' => 'Attributes of Compare',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
