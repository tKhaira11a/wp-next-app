<?php

function register_hero_parallax() {
	register_post_type('hero_parallax',
		array(
			'labels'      => array(
				'name'          => __('Parallax Heroshot', 'textdomain'),
				'singular_name' => __('Parallax Heroshot', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'heroParallax',
			'graphql_plural_name' => 'heroParallaxs',
		)
	);

	register_post_meta('hero_parallax', 'product_list_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('hero_parallax', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));


	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'HeroParallax', 'product_list_ids', [
			'type' => 'String',
			'description' => 'Liste of IDs from the Child-List',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'product_list_ids', true );
			}
		] );

		register_graphql_field( 'HeroParallax', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute of Parallax Heroshot',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );

}
