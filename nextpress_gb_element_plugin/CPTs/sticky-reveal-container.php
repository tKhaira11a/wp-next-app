<?php

	function register_sticky_reveal_container() {
		register_post_type('sticky_rev_container',
			array(
				'labels'      => array(
					'name'          => __('Sticky Reveal Container', 'textdomain'),
					'singular_name' => __('Sticky Reveal Container', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'stickyRevContainer',
				'graphql_plural_name' => 'stickyRevContainers',
			)
		);

		register_post_meta('sticky_rev_container', 'item_ids', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('sticky_rev_container', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'StickyRevContainer', 'item_ids', [
				'type' => 'String',
				'description' => 'Liste of IDs from the Item-List',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'item_ids', true );
				}
			] );

			register_graphql_field( 'StickyRevContainer', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute of Timeline Container',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );

	}
