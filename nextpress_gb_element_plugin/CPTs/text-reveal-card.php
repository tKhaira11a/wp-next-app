<?php

function register_text_reveal_card() {
	register_post_type('text_reveal_card',
		array(
			'labels'      => array(
				'name'          => __('Text Reveal Card', 'textdomain'),
				'singular_name' => __('Text Reveal Card', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'textRevealCard',
			'graphql_plural_name' => 'textRevealCards',
		)
	);

	register_post_meta('text_reveal_card', 'text', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('text_reveal_card', 'reveal_text', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('text_reveal_card', 'card_title', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('text_reveal_card', 'card_description', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('text_reveal_card', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'TextRevealCard', 'text', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'text', true );
			}
		] );

		register_graphql_field( 'TextRevealCard', 'reveal_text', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'reveal_text', true );
			}
		] );

		register_graphql_field( 'TextRevealCard', 'card_title', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'card_title', true );
			}
		] );

		register_graphql_field( 'TextRevealCard', 'card_description', [
			'type' => 'String',
			'description' => 'Wörter für den Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'card_description', true );
			}
		] );

		register_graphql_field( 'TextRevealCard', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Effekts',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
