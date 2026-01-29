<?php
	/**
	 * Plugin Name:       NextPress-contact-form-PlugIn
	 * Description:       Formular Editor for wp-next-app components.
	 * Version:           0.2.0
	 * Requires at least: 6.7
	 * Requires PHP:      7.4
	 * Author:            Tarik Khairalla - www.khairalla-code.com
	 * License:           GPL-2.0-or-later
	 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
	 * Text Domain:       nextpress-forms
	 *
	 * @package           nextpress-forms
	 */

	if (!defined('ABSPATH')) {
		exit;
	}

	require_once(__DIR__.'/register_cpts.php');

	function register_np_contact_cpt() {
		register_post_type('np_contact_form',
		   array(
			  'labels'      => array(
				 'name'          => __('NP Contact-Forms', 'nextpress-forms'),
				 'singular_name' => __('NP Contact-Form', 'nextpress-forms'),
				 'add_new'       => __('Add New', 'nextpress-forms'),
				 'add_new_item'  => __('Add New Contact Form', 'nextpress-forms'),
				 'edit_item'     => __('Edit Contact Form', 'nextpress-forms'),
				 'new_item'      => __('New Contact Form', 'nextpress-forms'),
				 'view_item'     => __('View Contact Form', 'nextpress-forms'),
				 'search_items'  => __('Search Contact Forms', 'nextpress-forms'),
				 'not_found'     => __('No contact forms found', 'nextpress-forms'),
				 'not_found_in_trash' => __('No contact forms found in Trash', 'nextpress-forms'),
			  ),
			  'public'             => true,
			  'show_in_rest'       => true,
			  'has_archive'        => false,
			  'supports'           => array('title', 'editor', 'custom-fields'),
			  'show_ui'            => true,
			  'show_in_menu'       => true,
			  'show_in_nav_menus'  => false,
			  'show_in_graphql'    => true,
			  'graphql_single_name' => 'npContactForm',
			  'graphql_plural_name' => 'npContactForms',
			  'menu_icon'          => 'dashicons-feedback',
			  'capability_type'    => 'post',
		   )
		);
	}
	add_action('init', 'register_np_contact_cpt');

	add_filter('manage_np_contact_posts_columns', function($columns) {
		$columns['cpt_id'] = __('CPT-ID', 'nextpress-forms');
		return $columns;
	});

	add_action('manage_np_contact_posts_custom_column', function($column, $post_id) {
		if ($column === 'cpt_id') {
			echo (int) $post_id;
		}
	}, 10, 2);

	function create_block_nextpress_form_components_init() {
		register_block_type( __DIR__ . '/build/switch' );
		register_block_type( __DIR__ . '/build/textbox' );
		register_block_type( __DIR__ . '/build/textarea' );
		register_block_type( __DIR__ . '/build/select' );
		register_block_type( __DIR__ . '/build/checkbox' );
		register_block_type( __DIR__ . '/build/radio-group' );
		register_block_type( __DIR__ . '/build/date-picker' );
		register_block_type( __DIR__ . '/build/np-contact-form' );
		register_block_type( __DIR__ . '/build/file-upload' );
	}
	add_action( 'init', 'create_block_nextpress_form_components_init' );


	function nextpress_register_form_block_categories( $categories, $post ) {
		return array_merge(
			$categories,
			[
				[
					'slug'  => 'nextpress-form-blocks',
					'title' => __('NextPre$$ Form Blocks', 'nextpress-forms'),
					'icon'  => 'forms',
				],
			]
		);
	}
	add_filter( 'block_categories_all', 'nextpress_register_form_block_categories', 10, 2 );

    function nextpress_restrict_blocks_for_cpt( $allowed_blocks, $editor_context ) {
		if ( isset( $editor_context->post ) && $editor_context->post->post_type === 'np_contact_form' ) {

			$all_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
			$allowed = array();

			$core_blocks = [
				'core/paragraph',
				'core/group',
				'core/image',
				'core/columns',
				'core/column',
				'core/heading',
				'core/spacer',
				'nextpress-block/button',
				'nextpress-block/text-generate-effekt'
			];
			$allowed = array_merge($allowed, $core_blocks);

			foreach ( $all_blocks as $block_name => $block_type ) {
				if ( isset( $block_type->category ) && $block_type->category === 'nextpress-form-blocks' ) {
					$allowed[] = $block_name;
				}
			}

			return $allowed;
		}

		return $allowed_blocks;
    }
    add_filter( 'allowed_block_types_all', 'nextpress_restrict_blocks_for_cpt', 10, 2 );


	function nextpress_forms_activation() {
		register_np_contact_cpt();
		flush_rewrite_rules();
	}
	register_activation_hook( __FILE__, 'nextpress_forms_activation' );

	function nextpress_forms_deactivation() {
		flush_rewrite_rules();
	}
	register_deactivation_hook( __FILE__, 'nextpress_forms_deactivation' );

	function enqueue_contact_form_editor_script() {
		wp_enqueue_script(
			'nextpress-editor-js',
			plugins_url( 'build/contact-form-settings.js', __FILE__ ),
			[
				'wp-plugins',
				'wp-edit-post',
				'wp-components',
				'wp-data',
				'wp-i18n'
			],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/contact-form-settings.js' ),
			true
		);
    }
	add_action('admin_enqueue_scripts', 'enqueue_contact_form_editor_script');

add_action('add_meta_boxes', function () {
	add_meta_box(
		'np_contact_form_meta',
		__('Message Editor', 'nextpress-forms'),
		'np_contact_form_meta_box_callback',
		'np_contact_form',
		'advanced',
		'default'
	);
});

function np_contact_form_meta_box_callback($post) {
	$from = get_post_meta($post->ID, 'from', true);
	$to = get_post_meta($post->ID, 'to', true);
	$subject = get_post_meta($post->ID, 'subject', true);
	$message = get_post_meta($post->ID, 'message', true);
	echo '{Field-Name} um auf die Werte der Felder zu referenzieren.<br/>';
	echo 'Beispiel: Checkbox mit Field-Name: Geb.-Datum => {Geb.-Datum}<br/>';

	echo '<label>Absender</label>';
	echo '<input type="text" name="from" value="' . esc_attr($from) . '" style="width: 100%;" />';
	echo '<label>Empfänger</label>';
	echo '<input type="text" name="to" value="' . esc_attr($to) . '" style="width: 100%;" />';
	echo '<label>Betreff</label>';
	echo '<input type="text" name="subject" value="' . esc_attr($subject) . '" style="width: 100%;" />';
	echo '<label>Nachricht</label>';
	echo '<textarea name="message" style="width: 100%;">' . esc_textarea($message) . '</textarea>';
}

add_action('save_post', function ($post_id) {
	if (array_key_exists('from', $_POST)) {
		update_post_meta($post_id, 'from', sanitize_text_field($_POST['from']));
	}
	if (array_key_exists('to', $_POST)) {
		update_post_meta($post_id, 'to', sanitize_text_field($_POST['to']));
	}
	if (array_key_exists('subject', $_POST)) {
		update_post_meta($post_id, 'subject', sanitize_text_field($_POST['subject']));
	}
	if (array_key_exists('message', $_POST)) {
		update_post_meta($post_id, 'message', $_POST['message']);
	}
});


function nextpress_enqueue_block_editor_assets() {
	$screen = get_current_screen();

	if ( $screen->post_type === 'np_contact_form' ) {
		return;
	}

	wp_enqueue_script(
		'nextpress-limit-blocks',
		plugin_dir_url(__FILE__) . 'editor.js',
		[ 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-data' ],
		filemtime( plugin_dir_path(__FILE__) . 'editor.js' ),
		true
	);
}
add_action('enqueue_block_editor_assets', 'nextpress_enqueue_block_editor_assets');
