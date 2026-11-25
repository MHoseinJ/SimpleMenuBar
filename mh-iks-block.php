<?php
/**
 * Plugin Name: Simple Menu Bar
 * Description: Overlay sidebar for IKS Menu.
 * Version: 0.1
 * License: GPL-3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function mh_iks_menu_render($attributes) {
    $menu_id = absint($attributes['menuId'] ?? 355);

    if (!$menu_id || !shortcode_exists('iks_menu')) {
        return '';
    }

    $drawer_id = wp_unique_id('mh-iks-drawer-');

    $menu = do_shortcode(
        '[iks_menu id="' . $menu_id . '"]'
    );

    ob_start();
    ?>

    <div class="mh-iks-menu">

        <button
            class="mh-iks-menu__toggle"
            type="button"
            aria-expanded="false"
            aria-controls="<?php echo esc_attr($drawer_id); ?>"
            aria-label="Open menu"
        >
	    <span aria-hidden="true">☰</span>محصولات
        </button>

        <button
            class="mh-iks-menu__backdrop"
            type="button"
            aria-label="Close menu"
            hidden
        ></button>

        <aside
            id="<?php echo esc_attr($drawer_id); ?>"
            class="mh-iks-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            dir="rtl"
            hidden
        >
            <div class="mh-iks-menu__header">
                <span>منو</span>

                <button
                    class="mh-iks-menu__close"
                    type="button"
                    aria-label="Close menu"
                >
                    &times;
                </button>
            </div>

            <div class="mh-iks-menu__content">
                <?php echo $menu; ?>
            </div>

        </aside>

    </div>

    <?php
    return ob_get_clean();
}

function mh_iks_menu_register() {
    $base = plugin_dir_path(__FILE__);

    wp_register_script(
        'mh-iks-menu-editor',
        plugins_url('index.js', __FILE__),
        [
            'wp-blocks',
            'wp-element',
            'wp-block-editor',
            'wp-components',
        ],
        file_exists($base . 'index.js')
            ? filemtime($base . 'index.js')
            : '1.2.0',
        true
    );

    wp_register_script(
        'mh-iks-menu-view',
        plugins_url('view.js', __FILE__),
        [],
        file_exists($base . 'view.js')
            ? filemtime($base . 'view.js')
            : '1.2.0',
        true
    );

    wp_register_style(
        'mh-iks-menu-style',
        plugins_url('style.css', __FILE__),
        [],
        file_exists($base . 'style.css')
            ? filemtime($base . 'style.css')
            : '1.2.0'
    );

    register_block_type('mh/iks-menu', [
        'api_version' => 3,
        'editor_script' => 'mh-iks-menu-editor',
        'view_script' => 'mh-iks-menu-view',
        'style' => 'mh-iks-menu-style',
        'render_callback' => 'mh_iks_menu_render',

        'attributes' => [
            'menuId' => [
                'type' => 'string',
                'default' => '355',
            ],
        ],
    ]);
}

add_action('init', 'mh_iks_menu_register');
