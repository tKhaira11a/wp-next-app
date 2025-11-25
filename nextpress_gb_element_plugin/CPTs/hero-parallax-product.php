<?php

function register_hero_parallax_product() {
	register_post_type('hero_parallax_prod',
		array(
			'labels'      => array(
				'name'          => __('Hero Parallax Product', 'textdomain'),
				'singular_name' => __('Hero Parallax Product', 'textdomain'),
			),
			'public'             => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'supports'           => array('title', 'editor', 'custom-fields'),
			'show_ui'			 => false,
			'show_in_menu'		 => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => 'heroParallaxProd',
			'graphql_plural_name' => 'heroParallaxProds',
		)
	);

	register_post_meta('hero_parallax_prod', 'url', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('hero_parallax_prod', 'label', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('hero_parallax_prod', 'background', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	register_post_meta('hero_parallax_prod', 'attributes', array(
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'single'       => true,
		'type'         => 'string',
		'auth_callback' => function() {
			return current_user_can('edit_posts');
		}
	));

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'HeroParallaxProd', 'url', [
			'type' => 'String',
			'description' => 'URL of box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'url', true );
			}
		] );

		register_graphql_field( 'HeroParallaxProd', 'label', [
			'type' => 'String',
			'description' => 'Heading on box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'label', true );
			}
		] );

		register_graphql_field( 'HeroParallaxProd', 'background', [
			'type' => 'String',
			'description' => 'Background of Box',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'background', true );
			}
		] );

		register_graphql_field( 'HeroParallaxProd', 'attributes', [
			'type' => 'String',
			'description' => 'Attribute of List Items',
			'resolve' => function( $post ) {
				return get_post_meta( $post->ID, 'attributes', true );
			}
		] );
	} );
}
