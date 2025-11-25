<?php

	function register_expandable_card() {
		register_post_type('expandable_card',
			array(
				'labels'      => array(
					'name'          => __('Expandable Card', 'textdomain'),
					'singular_name' => __('Expandable Card', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'expandableCard',
				'graphql_plural_name' => 'expandableCards',
			)
		);

		register_post_meta('expandable_card', 'description', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'card_title', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'src', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'cta_text', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'cta_link', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'card_content', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('expandable_card', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'ExpandableCard', 'description', [
				'type' => 'String',
				'description' => 'Angezeigte Überschrift',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'description', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'card_title', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'card_title', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'src', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'src', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'cta_text', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'cta_text', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'cta_link', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'cta_link', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'card_content', [
				'type' => 'String',
				'description' => 'Verborgener Text',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'card_content', true );
				}
			] );

			register_graphql_field( 'ExpandableCard', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Accordion Items',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );
	}
