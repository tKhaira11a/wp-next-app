<?php
/**
 * Main template file - Headless WordPress
 *
 * @package Headless
 */

get_header();
?>
<main>
    <h1><?php echo esc_html(get_bloginfo('name')); ?></h1>
    <p>This WordPress installation is configured as a headless CMS.</p>
    <?php if (defined('HEADLESS_URL') && HEADLESS_URL): ?>
        <p><a href="<?php echo esc_url(HEADLESS_URL); ?>">Visit Frontend</a></p>
    <?php endif; ?>
    <?php if (current_user_can('manage_options')): ?>
        <p><a href="<?php echo esc_url(admin_url()); ?>">Go to Admin</a></p>
    <?php endif; ?>
</main>
<?php
get_footer();
