<?php
/**
 * Headless Theme Functions
 *
 * @package Headless
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function headless_theme_setup() {
    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_theme_support('custom-logo');

    register_nav_menus(array(
        'primary' => __('Primary Menu', 'headless'),
        'footer'  => __('Footer Menu', 'headless'),
    ));
}
add_action('after_setup_theme', 'headless_theme_setup');

/**
 * Redirect frontend to headless URL
 */
function headless_redirect_frontend() {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    if (
        strpos($request_uri, '/wp-json/') !== false ||
        strpos($request_uri, '/graphql') !== false ||
        strpos($request_uri, '/wp-admin') !== false ||
        strpos($request_uri, '/wp-login') !== false
    ) {
        return;
    }

    $headless_url = defined('HEADLESS_URL') ? HEADLESS_URL : '';

    if (!empty($headless_url)) {
        $redirect_url = trailingslashit($headless_url) . ltrim($request_uri, '/');
        wp_redirect($redirect_url, 301);
        exit;
    }
}
add_action('template_redirect', 'headless_redirect_frontend');

/**
 * Add CORS headers for headless requests
 */
function headless_add_cors_headers() {
    $headless_url = defined('HEADLESS_URL') ? rtrim(HEADLESS_URL, '/') : '*';

    header("Access-Control-Allow-Origin: {$headless_url}");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
}
add_action('init', 'headless_add_cors_headers');

/**
 * Enable Application Passwords
 */
add_filter('wp_is_application_passwords_available', '__return_true');
add_filter('wp_is_application_passwords_available_for_user', '__return_true');
