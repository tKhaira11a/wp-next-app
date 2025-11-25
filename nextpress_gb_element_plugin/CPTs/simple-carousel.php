<?php

	function register_simple_carousel() {
		register_post_type('simple_carousel',
			array(
				'labels'      => array(
					'name'          => __('Simple Carousel', 'textdomain'),
					'singular_name' => __('Simple Carousel', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'simpleCarousel',
				'graphql_plural_name' => 'simpleCarousels',
			)
		);

		register_post_meta('simple_carousel', 'slide_ids', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('simple_carousel', 'initial_index', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'number',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('simple_carousel', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'SimpleCarousel', 'slide_ids', [
				'type' => 'String',
				'description' => 'Liste of IDs from the Child-List',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'slide_ids', true );
				}
			] );

			register_graphql_field( 'SimpleCarousel', 'initial_index', [
				'type' => 'Number',
				'description' => 'First Slide to show',
				'resolve' => function( $post ) {
					return floatval( get_post_meta( $post->ID, 'initial_index', true ));
				}
			] );

			register_graphql_field( 'SimpleCarousel', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute of Parallax Heroshot',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );

	}
