<?php

	function register_ani_tab_control() {
		register_post_type('ani_tab_control',
			array(
				'labels'      => array(
					'name'          => __('Animated Tab-Control', 'textdomain'),
					'singular_name' => __('Animated Tab-Control', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'aniTabControl',
				'graphql_plural_name' => 'aniTabControls',
			)
		);

		register_post_meta('ani_tab_control', 'tab_ids', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('ani_tab_control', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'AniTabControl', 'tab_ids', [
				'type' => 'String',
				'description' => 'Liste of IDs from the Child-List',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'tab_ids', true );
				}
			] );

			register_graphql_field( 'AniTabControl', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute of Animated Tab-Control',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );

	}
