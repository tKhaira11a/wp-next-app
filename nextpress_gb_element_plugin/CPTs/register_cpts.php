<?php
	require_once(__DIR__.'/register_new_cpt.php');
	require_once(__DIR__.'/cpt_dictionary.php');

	add_action('init', function() use ($cpt_dictionary) {
		foreach($cpt_dictionary as $displayName => $customFields) {
			register_new_CPT($displayName, $customFields);
		}
	});

	add_action('graphql_register_types', function() use ($cpt_dictionary) {
		register_all_graphql_types($cpt_dictionary);
	});
