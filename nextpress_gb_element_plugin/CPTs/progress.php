<?php

	function register_progress() {
		register_post_type('progress',
			array(
				'labels'      => array(
					'name'          => __('Progress', 'textdomain'),
					'singular_name' => __('Progress', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'progress',
				'graphql_plural_name' => 'progresses',
			)
		);

		register_post_meta('progress', 'value', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'number',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('progress', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Progress', 'value', [
				'type' => 'Number',
				'description' => 'Link-Url',
				'resolve' => function( $post ) {
					return floatval( get_post_meta( $post->ID, 'value', true ));
				}
			] );

			register_graphql_field( 'Progress', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Button',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
