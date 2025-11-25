<?php

	function register_select() {
		register_post_type('select',
			array(
				'labels'      => array(
					'name'          => __('Select', 'nextpress-forms'),
					'singular_name' => __('Select', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'select',
				'graphql_plural_name' => 'selects',
			)
		);

		register_post_meta('select', 'label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('select', 'field_name', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('select', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {

			register_graphql_field( 'Select', 'label', [
				'type' => 'String',
				'description' => 'Select Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'label', true );
				}
			] );

			register_graphql_field( 'Select', 'fieldName', [
				'type' => 'String',
				'description' => 'Field Name for Input-Value reference',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'field_name', true );
				}
			] );

			register_graphql_field( 'Select', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Select',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
