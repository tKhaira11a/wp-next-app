<?php

	function register_accordion() {
		register_post_type('accordion',
			array(
				'labels'      => array(
					'name'          => __('Accordion', 'textdomain'),
					'singular_name' => __('Accordion', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'accordion',
				'graphql_plural_name' => 'accordions',
			)
		);

		register_post_meta('accordion', 'accordion_items', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('accordion', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Accordion', 'accordion_items', [
				'type' => 'String',
				'description' => 'Liste der IDs von Child-List-Items',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'accordion_items', true );
				}
			] );

			register_graphql_field( 'Accordion', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Animated Testimonial',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );
	}
