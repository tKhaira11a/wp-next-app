<?php
/*
 *  Copyright (C) 2026 Tarik Khairalla (khairalla-code)
 *   https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

	function register_textbox() {
		register_post_type('textbox',
			array(
				'labels'      => array(
					'name'          => __('Textbox', 'nextpress-forms'),
					'singular_name' => __('Textbox', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'textbox',
				'graphql_plural_name' => 'textboxs',
			)
		);

		register_post_meta('textbox', 'label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('textbox', 'field_name', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('textbox', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {

			register_graphql_field( 'Textbox', 'label', [
				'type' => 'String',
				'description' => 'Textbox Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'label', true );
				}
			] );

			register_graphql_field( 'Textbox', 'fieldName', [
				'type' => 'String',
				'description' => 'Field Name for Input-Value reference',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'field_name', true );
				}
			] );

			register_graphql_field( 'Textbox', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des Textbox',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
