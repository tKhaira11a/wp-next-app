<?php

function register_parallax_grid() {
	register_post_type('parallax_grid',
		array(
			'labels'      => array(
				'name'          => __('Parallax Grid', 'textdomain'),
				'singular_name' => __('Parallax Grid', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'parallaxGrid',
			'graphql_plural_name' => 'parallaxGrids',
		)
	);

	register_post_meta('parallax_grid', 'images', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('parallax_grid', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'parallaxGrid', 'images', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'images', true );
			}
		] );

		register_graphql_field( 'parallaxGrid', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );

	} );
}
