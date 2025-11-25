<?php

function register_container_scroll_animation() {
	register_post_type('container_scroll_ani',
		array(
			'labels'      => array(
				'name'          => __('Container Scroll Animation', 'textdomain'),
				'singular_name' => __('Container Scroll Animation', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'containerScrollAni',
			'graphql_plural_name' => 'containerScrollAni',
		)
	);

	register_post_meta('container_scroll_ani', 'child_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('container_scroll_ani', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('container_scroll_ani', 'background', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('container_scroll_ani', 'child_content', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'ContainerScrollAni', 'child_ids', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_ids', true );
			}
		] );

		register_graphql_field( 'ContainerScrollAni', 'background', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'background', true );
			}
		] );

		register_graphql_field( 'ContainerScrollAni', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute des Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );

		register_graphql_field( 'ContainerScrollAni', 'child_content', [
			'type' => 'String',
			'description' => 'post_content aller Childs dieses Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_content', true );
			}
		] );
	} );
}
