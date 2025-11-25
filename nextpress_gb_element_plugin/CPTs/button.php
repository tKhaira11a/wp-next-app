<?php

	function register_button() {
		register_post_type('button',
			array(
				'labels'      => array(
					'name'          => __('Button', 'textdomain'),
					'singular_name' => __('Button', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'button',
				'graphql_plural_name' => 'buttons',
			)
		);

		register_post_meta('button', 'url', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('button', 'label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('button', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Button', 'url', [
				'type' => 'String',
				'description' => 'Link-Url',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'url', true );
				}
			] );

			register_graphql_field( 'Button', 'label', [
				'type' => 'String',
				'description' => 'Button Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'label', true );
				}
			] );

			register_graphql_field( 'Button', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Button',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
