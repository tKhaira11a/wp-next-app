<?php

function register_textgenerate_effekt() {
	register_post_type('textgenerate_effekt',
		array(
			'labels'      => array(
				'name'          => __('Textgen Effekt', 'textdomain'),
				'singular_name' => __('Textgen Effekt', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'textgenerateEffekt',
			'graphql_plural_name' => 'textgenerateEffekts',
		)
	);

	register_post_meta('textgenerate_effekt', 'duration', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'number',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('textgenerate_effekt', 'words', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('textgenerate_effekt', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'TextgenerateEffekt', 'duration', [
			'type' => 'Float',
			'description' => 'Dauer des Effekts',
			'resolve' => function( $post ) {
				return floatval( get_post_meta( $post->ID, 'duration', true ) );
			}
		] );

		register_graphql_field( 'TextgenerateEffekt', 'words', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'words', true );
			}
		] );

		register_graphql_field( 'TextgenerateEffekt', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Effekts',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
