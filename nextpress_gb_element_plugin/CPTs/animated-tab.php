<?php

function register_animated_tab() {
	register_post_type('animated_tab',
		array(
			'labels'      => array(
				'name'          => __('Animated Tab', 'textdomain'),
				'singular_name' => __('Animated Tab', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'animatedTab',
			'graphql_plural_name' => 'animatedTabs',
		)
	);

	register_post_meta('animated_tab', 'child_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('animated_tab', 'tab_title', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('animated_tab', 'tab_value', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('animated_tab', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('animated_tab', 'child_content', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'AnimatedTab', 'child_ids', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_ids', true );
			}
		] );

		register_graphql_field( 'AnimatedTab', 'tab_title', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'tab_title', true );
			}
		] );

		register_graphql_field( 'AnimatedTab', 'tab_value', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'tab_value', true );
			}
		] );

		register_graphql_field( 'AnimatedTab', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );

		register_graphql_field( 'AnimatedTab', 'child_content', [
			'type' => 'String',
			'description' => 'post_content aller Childs dieses Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_content', true );
			}
		] );
	} );
}
