<?php

function register_three_d_card() {
	register_post_type('three_d_card',
		array(
			'labels'      => array(
				'name'          => __('3D Card', 'textdomain'),
				'singular_name' => __('3D Card', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'threeDCard',
			'graphql_plural_name' => 'threeDCards',
		)
	);

	register_post_meta('three_d_card', 'header', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'sub_header', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'background', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'link_url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'link_lable', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'skew', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'boolean',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'button_label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'button_url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('three_d_card', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'threeDCard', 'header', [
			'type' => 'String',
			'description' => 'Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'header', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'subHeader', [
			'type' => 'String',
			'description' => 'Sub-Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'sub_header', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'background', [
			'type' => 'String',
			'description' => 'Background of Box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'background', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'skew', [
			'type' => 'Boolean',
			'description' => 'Link Url',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'skew', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'linkLable', [
			'type' => 'String',
			'description' => 'Link Label',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'link_lable', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'linkUrl', [
			'type' => 'String',
			'description' => 'Link Url',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'button_url', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'buttonLabel', [
			'type' => 'String',
			'description' => 'Button Label',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'button_label', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'buttonUrl', [
			'type' => 'String',
			'description' => 'Button URL',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'button_url', true );
			}
		] );

		register_graphql_field( 'threeDCard', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute 3D Card',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
