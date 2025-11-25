<?php

function register_list_item() {
	register_post_type('list_item',
		array(
			'labels'      => array(
				'name'          => __('List Item', 'textdomain'),
				'singular_name' => __('List Item', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'listItem',
			'graphql_plural_name' => 'listItems',
		)
	);

	register_post_meta('list_item', 'url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('list_item', 'label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('list_item', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'ListItem', 'url', [
			'type' => 'String',
			'description' => 'URL hinterm Button',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'url', true );
			}
		] );

		register_graphql_field( 'ListItem', 'label', [
			'type' => 'String',
			'description' => 'Label des Buttons',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'label', true );
			}
		] );

		register_graphql_field( 'ListItem', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
