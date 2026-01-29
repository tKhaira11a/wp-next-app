<?php
/**
 * Plugin Name:       NextPress-GB-Components
 * Description:       Package of wp-next-app components for Gutenberg Editor.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Tarik Khairalla - www.khairalla-code.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nextpress-gb-components
 *
 * @package           nextpress-block
 */

require_once(__DIR__.'/CPTs/register_cpts.php');

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class CAC_Custom_CSS_Plugin {
	const OPTION = 'cac_custom_css';

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'add_menu' ] );
		add_action( 'admin_init', [ $this, 'register_setting' ] );
		add_action( 'wp_head', [ $this, 'print_css_inline' ], 100 );
		add_action( 'customize_register', [ $this, 'customizer_register' ] );
		add_action( 'customize_preview_init', [ $this, 'customizer_live_preview' ] );
	}

	public function add_menu() {
		add_theme_page(
			__( 'Custom CSS', 'cac' ),
			__( 'Custom CSS', 'cac' ),
			'edit_theme_options',
			'cac-custom-css',
			[ $this, 'render_page' ]
		);
	}

	public function register_setting() {
		register_setting(
			'cac_options_group',
			self::OPTION,
			[
				'type'              => 'string',
				'sanitize_callback' => [ $this, 'sanitize_css' ],
				'default'           => '',
			]
		);
	}

	public function sanitize_css( $css ) {
		return wp_strip_all_tags( $css );
	}

	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Custom CSS', 'cac' ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'cac_options_group' );
				$css = get_option( self::OPTION, '' );
				?>
				<textarea name="<?php echo esc_attr( self::OPTION ); ?>" rows="20" cols="100" class="large-text code"><?php echo esc_textarea( $css ); ?></textarea>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	public function print_css_inline() {
		$css = trim( get_option( self::OPTION ) );
		if ( $css ) {
			echo '<style id="cac-custom-css">' . wp_strip_all_tags( $css ) . '</style>' . "\n";
		}
	}

	public function customizer_register( $wp_customize ) {
		$wp_customize->add_section( 'cac_custom_css_section', [
			'title'    => __( 'Custom CSS (Plugin)', 'cac' ),
			'priority' => 160,
		] );

		$wp_customize->add_setting( self::OPTION, [
			'default'           => '',
			'type'              => 'option',
			'capability'        => 'edit_theme_options',
			'transport'         => 'postMessage',
			'sanitize_callback' => [ $this, 'sanitize_css' ],
		] );

		if ( class_exists( 'WP_Customize_Code_Editor_Control' ) ) {
			$wp_customize->add_control( new WP_Customize_Code_Editor_Control( $wp_customize, 'cac_custom_css_control', [
				'label'     => __( 'Custom CSS', 'cac' ),
				'section'   => 'cac_custom_css_section',
				'settings'  => self::OPTION,
				'code_type' => 'text/css',
			] ) );
		} else {
			$wp_customize->add_control( 'cac_custom_css_control', [
				'label'    => __( 'Custom CSS', 'cac' ),
				'type'     => 'textarea',
				'section'  => 'cac_custom_css_section',
				'settings' => self::OPTION,
			] );
		}
	}

	public function customizer_live_preview() {
		add_action( 'wp_head', [ $this, 'print_css_inline' ], 101 );
	}
}



function create_block_nextpress_components_init() {
	register_block_type( __DIR__ . '/build/textgenerate-effekt' );
	register_block_type( __DIR__ . '/build/button-grid' );
	register_block_type( __DIR__ . '/build/button-grid-item' );
	register_block_type( __DIR__ . '/build/partical-canvas' );
	register_block_type( __DIR__ . '/build/background-boxes' );
	register_block_type( __DIR__ . '/build/animated-testimonial' );
	register_block_type( __DIR__ . '/build/testimonial' );
	register_block_type( __DIR__ . '/build/compare' );
	register_block_type( __DIR__ . '/build/hero-parallax' );
	register_block_type( __DIR__ . '/build/hero-parallax-product' );
	register_block_type( __DIR__ . '/build/carousel' );
	register_block_type( __DIR__ . '/build/carousel-slide' );
	register_block_type( __DIR__ . '/build/accordion' );
	register_block_type( __DIR__ . '/build/accordion-item' );
	register_block_type( __DIR__ . '/build/button' );
	register_block_type( __DIR__ . '/build/simple-carousel' );
	register_block_type( __DIR__ . '/build/simple-carousel-slide' );
	register_block_type( __DIR__ . '/build/progress' );
	register_block_type( __DIR__ . '/build/collapsible' );
	register_block_type( __DIR__ . '/build/three-d-card' );
	register_block_type( __DIR__ . '/build/three-d-marquee' );
	register_block_type( __DIR__ . '/build/three-d-pin-card' );
	register_block_type( __DIR__ . '/build/container-scroll-animation' );
	register_block_type( __DIR__ . '/build/expandable-card-container' );
	register_block_type( __DIR__ . '/build/expandable-card' );
	register_block_type( __DIR__ . '/build/link-preview' );
	register_block_type( __DIR__ . '/build/moving-cards' );
	register_block_type( __DIR__ . '/build/text-reveal-card' );
	register_block_type( __DIR__ . '/build/parallax-grid' );
	register_block_type( __DIR__ . '/build/animated-tab' );
	register_block_type( __DIR__ . '/build/animated-tab-control' );
	register_block_type( __DIR__ . '/build/macbook-scroll' );
	register_block_type( __DIR__ . '/build/timeline-container' );
	register_block_type( __DIR__ . '/build/timeline-item' );
	register_block_type( __DIR__ . '/build/tracing-beam-container' );
	register_block_type( __DIR__ . '/build/tracing-beam-item' );
	register_block_type( __DIR__ . '/build/sticky-reveal-container' );
	register_block_type( __DIR__ . '/build/sticky-reveal-item' );
}
add_action( 'init', 'create_block_nextpress_components_init' );

function nextpress_register_block_categories( $categories, $post ) {
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'nextpress-blocks',
                'title' => __('Nextpre$$ Blocks', 'textdomain'),
            ],
        ]
    );
}
add_filter( 'block_categories_all', 'nextpress_register_block_categories', 10, 2 );

add_action( 'graphql_register_types', function () {
    register_graphql_field( 'RootQuery', 'additionalCSS', [
        'type'        => 'String',
        'description' => 'CSS aus dem Additional‑CSS‑Feature des aktiven Themes',
        'resolve'     => function() {
            return wp_get_custom_css();
        },
    ] );
} );
