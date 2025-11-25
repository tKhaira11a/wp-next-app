<?php

function register_three_d_pin_card() {
	register_post_type('three_d_pin_card',
		array(
			'labels'      => array(
				'name'          => __('3D Pin-Card', 'textdomain'),
				'singular_name' => __('3D Pin-Card', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'threeDPinCard',
			'graphql_plural_name' => 'threeDPinCards',
		)
	);

	register_post_meta('three_d_pin_card', 'header', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_pin_card', 'sub_header', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_pin_card', 'link_url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_pin_card', 'link_label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_pin_card', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'threeDPinCard', 'header', [
			'type' => 'String',
			'description' => 'Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'header', true );
			}
		] );

		register_graphql_field( 'threeDPinCard', 'subHeader', [
			'type' => 'String',
			'description' => 'Sub-Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'sub_header', true );
			}
		] );

		register_graphql_field( 'threeDPinCard', 'linkLabel', [
			'type' => 'String',
			'description' => 'Link Label',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'link_label', true );
			}
		] );

		register_graphql_field( 'threeDPinCard', 'linkUrl', [
			'type' => 'String',
			'description' => 'Link Url',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'link_url', true );
			}
		] );

		register_graphql_field( 'threeDPinCard', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute 3D Card',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
