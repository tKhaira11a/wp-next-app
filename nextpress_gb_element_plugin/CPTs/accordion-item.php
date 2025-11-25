<?php

	function register_accordion_item() {
		register_post_type('accordion_item',
			array(
				'labels'      => array(
					'name'          => __('Accordion Item', 'textdomain'),
					'singular_name' => __('Accordion Item', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'accordionItem',
				'graphql_plural_name' => 'accordionItems',
			)
		);

		register_post_meta('accordion_item', 'header', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('accordion_item', 'child_content', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('accordion_item', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'AccordionItem', 'header', [
				'type' => 'String',
				'description' => 'Angezeigte Überschrift',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'header', true );
				}
			] );

			register_graphql_field( 'AccordionItem', 'child_content', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'child_content', true );
				}
			] );

			register_graphql_field( 'AccordionItem', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Accordion Items',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );
	}
