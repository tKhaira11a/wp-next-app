<?php

function register_timeline_item() {
	register_post_type('timeline_item',
		array(
			'labels'      => array(
				'name'          => __('Timeline Item', 'textdomain'),
				'singular_name' => __('Timeline Item', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'timelineItem',
			'graphql_plural_name' => 'timelineItems',
		)
	);

	register_post_meta('timeline_item', 'item_title', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('timeline_item', 'child_content', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('timeline_item', 'child_ids', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('timeline_item', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {

		register_graphql_field( 'TimelineItem', 'item_title', [
			'type' => 'String',
			'description' => 'Heading on slide',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'item_title', true );
			}
		] );

		register_graphql_field( 'TimelineItem', 'child_content', [
			'type' => 'String',
			'description' => 'post_content aller Childs dieses Blocks',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_content', true );
			}
		] );

		register_graphql_field( 'TimelineItem', 'child_ids', [
			'type' => 'String',
			'description' => 'Liste von IDs aller Child-Blöcke',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'child_ids', true );
			}
		] );

		register_graphql_field( 'TimelineItem', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute of List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
