<?php

function register_moving_cards() {
	register_post_type('moving_cards',
		array(
			'labels'      => array(
				'name'          => __('Animated Testimonial', 'textdomain'),
				'singular_name' => __('Animated Testimonial', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'movingCards',
			'graphql_plural_name' => 'movingCardses',
		)
	);

	register_post_meta('moving_cards', 'testimonial_list', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('moving_cards', 'direction', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('moving_cards', 'speed', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('moving_cards', 'pause_on_hover', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'boolean',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('moving_cards', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));


	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'MovingCards', 'testimonial_list', [
			'type' => 'String',
			'description' => 'Liste der IDs von Child-List-Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'testimonial_list', true );
			}
		] );

		register_graphql_field( 'MovingCards', 'direction', [
			'type' => 'String',
			'description' => 'Attribute des Moving Cards',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'direction', true );
			}
		] );

		register_graphql_field( 'MovingCards', 'speed', [
			'type' => 'String',
			'description' => 'Attribute des Moving Cards',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'speed', true );
			}
		] );

		register_graphql_field( 'MovingCards', 'pause_on_hover', [
			'type' => 'Boolean',
			'description' => 'Attribute des Moving Cards',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'pause_on_hover', true );
			}
		] );

		register_graphql_field( 'MovingCards', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Moving Cards',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
