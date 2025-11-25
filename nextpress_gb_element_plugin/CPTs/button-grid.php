<?php

function register_button_grid() {
	register_post_type('button_grid',
		array(
			'labels'      => array(
				'name'          => __('Button Grid', 'textdomain'),
				'singular_name' => __('Button Grid', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'buttonGrid',
			'graphql_plural_name' => 'buttonGrids',
		)
	);

	register_post_meta('button_grid', 'list_item_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('button_grid', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));


	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'ButtonGrid', 'list_item_ids', [
			'type' => 'String',
			'description' => 'Liste der IDs von Child-List-Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'list_item_ids', true );
			}
		] );

		register_graphql_field( 'ButtonGrid', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Button Grid',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );

}
