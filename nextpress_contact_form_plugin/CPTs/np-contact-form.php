<?php

	function register_np_contact_form() {
		register_post_type('np_contact_form',
			array(
				'labels'      => array(
					'name'          => __('NP Contact-Form', 'nextpress-forms'),
					'singular_name' => __('NP Contact-Form', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'npContactForm',
				'graphql_plural_name' => 'npContactForms',
			)
		);

		register_post_meta('np_contact_form', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('np_contact_form', 'from', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('np_contact_form', 'to', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		register_post_meta('np_contact_form', 'subject', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		register_post_meta('np_contact_form', 'message', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'NpContactForm', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Checkbox',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );

			register_graphql_field( 'NpContactForm', 'from', [
				'type' => 'String',
				'description' => 'Checkbox Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'from', true );
				}
			] );

			register_graphql_field( 'NpContactForm', 'to', [
				'type' => 'String',
				'description' => 'Checkbox Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'to', true );
				}
			] );

			register_graphql_field( 'NpContactForm', 'subject', [
				'type' => 'String',
				'description' => 'Checkbox Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'subject', true );
				}
			] );

			register_graphql_field( 'NpContactForm', 'message', [
				'type' => 'String',
				'description' => 'Attribute des Checkbox',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'message', true );
				}
			] );
		});
	}
