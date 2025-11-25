<?php

	function register_expandable_card_container() {
		register_post_type('exp_card_container',
			array(
				'labels'      => array(
					'name'          => __('Expandable Card Container', 'textdomain'),
					'singular_name' => __('Expandable Card Container', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'expCardContainer',
				'graphql_plural_name' => 'expCardContainers',
			)
		);

		register_post_meta('exp_card_container', 'expandable_cards', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('exp_card_container', 'list_mode', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('exp_card_container', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'ExpCardContainer', 'expandable_cards', [
				'type' => 'String',
				'description' => 'Liste der IDs von Child-List-Items',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'expandable_cards', true );
				}
			] );

			register_graphql_field( 'ExpCardContainer', 'list_mode', [
				'type' => 'String',
				'description' => 'Liste der IDs von Child-List-Items',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'list_mode', true );
				}
			] );

			register_graphql_field( 'ExpCardContainer', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Animated Testimonial',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );
	}
