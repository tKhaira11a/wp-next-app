<?php

	function graphql_register_types_function($cptName, $customFields) {

		foreach($customFields as $fieldName => $dataType) {
			register_graphql_field( $cptName, $fieldName, [
				'type' => ucfirst($dataType),
				'description' => ucfirst($fieldName),
				'resolve' => function($post) use ($fieldName) {
					return get_post_meta($post->ID, $fieldName, true);
				}
			] );
		}
	}

	function register_new_CPT($displayName, $customFields) {

		$sanitized = preg_replace('/[^a-zA-Z0-9 ]/', '', $displayName);
		$cptName = strtolower(str_replace(' ', '_', $sanitized));
		$camelCase = lcfirst(str_replace(' ', '', $sanitized));

		register_post_type($cptName, array(
			'labels' => array(
				'name' => __($displayName, 'textdomain'),
				'singular_name' => __($displayName, 'textdomain'),
			),
			'public' => true,
			'show_in_rest' => true,
			'has_archive' => false,
			'supports' => array('title', 'editor', 'custom-fields'),
			'show_ui' => false,
			'show_in_menu' => false,
			'show_in_nav_menus' => false,
			'show_in_graphql' => true,
			'graphql_single_name' => $camelCase,
			'graphql_plural_name' => $camelCase . 's',
		));

		foreach($customFields as $fieldName => $dataType) {
		   register_post_meta($cptName, $fieldName, array(
			  'show_in_rest' => true,
			  'show_in_graphql' => true,
			  'single' => true,
			  'type' => $dataType,
			  'auth_callback' => function() {
				 return current_user_can('edit_posts');
			  }
		   ));
		}

		add_action('graphql_register_types', function() use ($camelCase, $customFields) {
		   graphql_register_types_function($camelCase, $customFields);
		});
	}

?>
