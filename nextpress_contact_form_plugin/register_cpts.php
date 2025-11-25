<?php
	require_once(__DIR__.'/CPTs/switch.php');
	require_once(__DIR__.'/CPTs/textbox.php');
	require_once(__DIR__.'/CPTs/textarea.php');
	require_once(__DIR__.'/CPTs/select.php');
	require_once(__DIR__.'/CPTs/checkbox.php');
	require_once(__DIR__.'/CPTs/radio-group.php');
	require_once(__DIR__.'/CPTs/date-picker.php');
	require_once(__DIR__.'/CPTs/np-contact-form.php');
	require_once(__DIR__.'/CPTs/form-block.php');
	require_once(__DIR__.'/CPTs/file-upload.php');

	function register_contact_block_cpts() {
		register_switch();
		register_textbox();
		register_textarea();
		register_select();
		register_checkbox();
		register_radio_group();
		register_date_picker();
		register_np_contact_form();
		register_form_block();
		register_file_upload();
	}
	add_action('init', 'register_contact_block_cpts');
