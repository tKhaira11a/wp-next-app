<?php

function register_partical_canvas() {
	register_post_type('partical_canvas',
		array(
			'labels'      => array(
				'name'          => __('Partical Canvas', 'textdomain'),
				'singular_name' => __('Partical Canvas', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'particalCanvas',
			'graphql_plural_name' => 'particalCanvases',
		)
	);

	register_post_meta('partical_canvas', 'child_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'particle_color', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'background', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'interactive', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'boolean',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'speed', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'density', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('partical_canvas', 'child_content', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'ParticalCanvas', 'child_ids', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_ids', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'particle_color', [
			'type' => 'String',
			'description' => 'Farbe der Partical',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'particle_color', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'background', [
			'type' => 'String',
			'description' => 'Hintergrund des Canvases',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'background', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'interactive', [
			'type' => 'Boolean',
			'description' => 'Aktivierung des interaktiven Mouse-Hover Effekt',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'interactive', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'speed', [
			'type' => 'String',
			'description' => 'Geschwindigkeit der Partical',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'speed', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'density', [
			'type' => 'String',
			'description' => 'Dichte der Partical',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'density', true );
			}
		] );

		register_graphql_field( 'ParticalCanvas', 'child_content', [
			'type' => 'String',
			'description' => 'post_content aller Childs dieses Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_content', true );
			}
		] );
	} );
}
