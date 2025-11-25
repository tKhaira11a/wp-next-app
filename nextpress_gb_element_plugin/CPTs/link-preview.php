<?php

function register_link_preview() {
	register_post_type('link_preview',
		array(
			'labels'      => array(
				'name'          => __('Link Preview', 'textdomain'),
				'singular_name' => __('Link Preview', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'linkPreview',
			'graphql_plural_name' => 'linkPreviews',
		)
	);

	register_post_meta('link_preview', 'label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('link_preview', 'url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('link_preview', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'LinkPreview', 'url', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'url', true );
			}
		] );

		register_graphql_field( 'LinkPreview', 'label', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'label', true );
			}
		] );

		register_graphql_field( 'LinkPreview', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Effekts',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
