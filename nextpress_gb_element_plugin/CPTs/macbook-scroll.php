<?php

function register_macbook_scroll() {
	register_post_type('macbook_scroll',
		array(
			'labels'      => array(
				'name'          => __('Macbook Scroll', 'textdomain'),
				'singular_name' => __('Macbook Scroll', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'macbookScroll',
			'graphql_plural_name' => 'macbookScrolls',
		)
	);

	register_post_meta('macbook_scroll', 'box_title', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('macbook_scroll', 'src', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('macbook_scroll', 'show_gradient', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'boolean',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('macbook_scroll', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'MacbookScroll', 'box_title', [
			'type' => 'String',
			'description' => 'Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'box_title', true );
			}
		] );

		register_graphql_field( 'MacbookScroll', 'src', [
			'type' => 'String',
			'description' => 'Picture on Macbook-Screen',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'src', true );
			}
		] );

		register_graphql_field( 'MacbookScroll', 'show_gradient', [
			'type' => 'Boolean',
			'description' => 'Background of Box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'show_gradient', true );
			}
		] );

		register_graphql_field( 'MacbookScroll', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute of List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
