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

	function graphql_register_types_function($graphqlTypeName, $customFields) {
	   foreach($customFields as $fieldName => $dataType) {
		  $graphqlFieldName = lcfirst(str_replace('_', '', ucwords($fieldName, '_')));

		  $graphqlType = match(strtolower($dataType)) {
			 'string' => 'String',
			 'number' => 'Float',
			 'boolean', 'bool' => 'Boolean',
			 default => 'String'
		  };

		  register_graphql_field($graphqlTypeName, $graphqlFieldName, [
			 'type' => $graphqlType,
			 'description' => ucfirst($fieldName),
			 'resolve' => function($post) use ($fieldName, $dataType) {
				$value = get_post_meta($post->ID, $fieldName, true);

				if (strtolower($dataType) === 'number') {
				   return floatval($value);
				}

				return $value;
			 }
		  ]);
	   }
	}

    function register_new_CPT($displayName, $customFields) {

       $sanitized = preg_replace('/[^a-zA-Z0-9 ]/', '', $displayName);
       $cptName = substr(strtolower(str_replace(' ', '_', $sanitized)), 0, 20);
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

    }

    function register_all_graphql_types($cpt_dictionary) {
       foreach($cpt_dictionary as $displayName => $customFields) {
          $sanitized = preg_replace('/[^a-zA-Z0-9 ]/', '', $displayName);
          $pascalCase = str_replace(' ', '', $sanitized);
          graphql_register_types_function($pascalCase, $customFields);
       }
    }

?>
