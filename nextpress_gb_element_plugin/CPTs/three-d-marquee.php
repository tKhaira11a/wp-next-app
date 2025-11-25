<?php

function register_three_d_marquee() {
	register_post_type('three_d_marquee',
		array(
			'labels'      => array(
				'name'          => __('3D Marquee', 'textdomain'),
				'singular_name' => __('3D Marquee', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'threeDMarquee',
			'graphql_plural_name' => 'threeDMarquees',
		)
	);

	register_post_meta('three_d_marquee', 'images', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_marquee', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'threeDMarquee', 'images', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'images', true );
			}
		] );

		register_graphql_field( 'threeDMarquee', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );

	} );
}
