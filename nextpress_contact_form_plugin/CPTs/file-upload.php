<?php

	function register_file_upload() {
		register_post_type('file_upload',
			array(
				'labels'      => array(
					'name'          => __('File Upload', 'nextpress-forms'),
					'singular_name' => __('File Upload', 'nextpress-forms'),
				),
				'public'             => true,
				'show_in_rest'       => true,
				'has_archive'        => false,
				'supports'           => array('title', 'editor', 'custom-fields'),
				'show_ui'			 => false,
				'show_in_menu'		 => false,
				'show_in_nav_menus' => false,
				'show_in_graphql' => true,
				'graphql_single_name' => 'fileUpload',
				'graphql_plural_name' => 'fileUploads',
			)
		);

		register_post_meta('file_upload', 'label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('file_upload', 'sub_label', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('file_upload', 'field_name', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		register_post_meta('file_upload', 'attributes', array(
			'show_in_rest' => true,
			'show_in_graphql' => true,
			'single'       => true,
			'type'         => 'string',
			'auth_callback' => function() {
				return current_user_can('edit_posts');
			}
		));

		add_action( 'graphql_register_types', function() {

			register_graphql_field( 'FileUpload', 'label', [
				'type' => 'String',
				'description' => 'File Upload Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'label', true );
				}
			] );


			register_graphql_field( 'FileUpload', 'subLabel', [
				'type' => 'String',
				'description' => 'Sub Label',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'sub_label', true );
				}
			] );

			register_graphql_field( 'FileUpload', 'fieldName', [
				'type' => 'String',
				'description' => 'Field Name for Input-Value reference',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'field_name', true );
				}
			] );

			register_graphql_field( 'FileUpload', 'attributes', [
				'type' => 'String',
				'description' => 'Attribute des File Upload',
				'resolve' => function( $post ) {
					return get_post_meta( $post->ID, 'attributes', true );
				}
			] );
		});
	}
