<?php

	function register_form_block() {
		register_post_type('form_block',
			array(
				'labels'      => array(
					'name'          => __('NP Contact-Form-Block', 'nextpress-forms'),
					'singular_name' => __('NP Contact-Form-Block', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'formBlock',
				'graphql_plural_name' => 'formBlocks',
			)
		);

		register_post_meta('form_block', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('form_block', 'selected_value', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'formBlock', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Checkbox',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );

			register_graphql_field( 'formBlock', 'selectedValue', [
				'type' => 'String',
				'description' => 'Attribute des Checkbox',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'selected_value', true );
				}
			] );
		});
	}
