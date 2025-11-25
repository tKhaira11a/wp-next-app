<?php

	function register_tracing_beam_container() {
		register_post_type('trac_beam_container',
			array(
				'labels'      => array(
					'name'          => __('Tracing Beam Container', 'textdomain'),
					'singular_name' => __('Tracing Beam Container', 'textdomain'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'tracBeamContainer',
				'graphql_plural_name' => 'tracBeamContainers',
			)
		);

		register_post_meta('trac_beam_container', 'item_ids', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('trac_beam_container', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));


		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'TracBeamContainer', 'item_ids', [
				'type' => 'String',
				'description' => 'Liste of IDs from the Item-List',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'item_ids', true );
				}
			] );

			register_graphql_field( 'TracBeamContainer', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute of Timeline Container',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		} );

	}
