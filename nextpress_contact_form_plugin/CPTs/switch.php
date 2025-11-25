<?php

	function register_switch() {
		register_post_type('switch',
			array(
				'labels'      => array(
					'name'          => __('Switch', 'nextpress-forms'),
					'singular_name' => __('Switch', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'switch',
				'graphql_plural_name' => 'switchs',
			)
		);

		register_post_meta('switch', 'label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('switch', 'field_name', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('switch', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {

			register_graphql_field( 'Switch', 'label', [
				'type' => 'String',
				'description' => 'Switch Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'label', true );
				}
			] );

			register_graphql_field( 'Switch', 'fieldName', [
				'type' => 'String',
				'description' => 'Field Name for Input-Value reference',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'field_name', true );
				}
			] );

			register_graphql_field( 'Switch', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Switch',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
