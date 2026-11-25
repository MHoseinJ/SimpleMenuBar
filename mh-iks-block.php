<?php
/**
 * Plugin Name: Simple Menu Bar
 * Description: Overlay sidebar for IKS Menu.
 * Version: 0.2
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

    // IKS menu shortcode
    $iks_menu = do_shortcode('[iks_menu id="' . $menu_id . '"]');

    // WordPress Navigation menu
    $wp_nav_html = '';
    if (has_nav_menu('primary')) {
        $wp_nav_html = wp_nav_menu([
            'theme_location' => 'primary',
            'echo'           => false,
            'container'      => false,
            'menu_class'     => 'mh-wp-nav__list',
            'fallback_cb'    => false,
            'depth'          => 3,
        ]);
    } elseif (has_nav_menu('header')) {
        $wp_nav_html = wp_nav_menu([
            'theme_location' => 'header',
            'echo'           => false,
            'container'      => false,
            'menu_class'     => 'mh-wp-nav__list',
            'fallback_cb'    => false,
            'depth'          => 3,
        ]);
    } else {
        // Fallback: show pages
        $wp_nav_html = wp_list_pages([
            'title_li' => '',
            'echo'     => false,
            'depth'    => 3,
        ]);
        if ($wp_nav_html) {
            $wp_nav_html = '<ul class="mh-wp-nav__list">' . $wp_nav_html . '</ul>';
        }
    }

    ob_start();
    ?>
    <div class="mh-iks-nav-wrapper" dir="rtl">

        <!-- ===== Right: IKS hamburger + drawer panel ===== -->
        <div class="mh-iks-menu">

            <button
                class="mh-iks-menu__toggle"
                type="button"
                aria-expanded="false"
                aria-controls="<?php echo esc_attr($drawer_id); ?>"
                aria-label="باز کردن منو"
            >
                <span aria-hidden="true">☰</span> محصولات
            </button>

            <button
                class="mh-iks-menu__backdrop"
                type="button"
                aria-label="بستن منو"
                hidden
            ></button>

            <aside
                id="<?php echo esc_attr($drawer_id); ?>"
                class="mh-iks-menu__panel"
                role="dialog"
                aria-modal="true"
                aria-label="منوی ناوبری"
                dir="rtl"
                hidden
            >
                <!-- Tabs (only visible on mobile/tablet) -->
                <div class="mh-iks-menu__tabs" role="tablist" aria-label="بخش‌های منو">
                    <button
                        class="mh-iks-menu__tab is-active"
                        role="tab"
                        type="button"
                        id="<?php echo esc_attr($drawer_id); ?>-tab-iks"
                        aria-controls="<?php echo esc_attr($drawer_id); ?>-panel-iks"
                        aria-selected="true"
                        tabindex="0"
                    >
                        محصولات
                    </button>
                    <button
                        class="mh-iks-menu__tab"
                        role="tab"
                        type="button"
                        id="<?php echo esc_attr($drawer_id); ?>-tab-wp"
                        aria-controls="<?php echo esc_attr($drawer_id); ?>-panel-wp"
                        aria-selected="false"
                        tabindex="-1"
                    >
                        صفحات
                    </button>
                </div>

                <div class="mh-iks-menu__header">
                    <span>منو</span>
                    <button
                        class="mh-iks-menu__close"
                        type="button"
                        aria-label="بستن منو"
                    >
                        &times;
                    </button>
                </div>

                <!-- Tab panel: IKS -->
                <div
                    id="<?php echo esc_attr($drawer_id); ?>-panel-iks"
                    class="mh-iks-menu__tabpanel is-active"
                    role="tabpanel"
                    aria-labelledby="<?php echo esc_attr($drawer_id); ?>-tab-iks"
                >
                    <div class="mh-iks-menu__content">
                        <?php echo $iks_menu; ?>
                    </div>
                </div>

                <!-- Tab panel: WP Nav -->
                <div
                    id="<?php echo esc_attr($drawer_id); ?>-panel-wp"
                    class="mh-iks-menu__tabpanel"
                    role="tabpanel"
                    aria-labelledby="<?php echo esc_attr($drawer_id); ?>-tab-wp"
                    hidden
                >
                    <div class="mh-iks-menu__content mh-wp-nav-content">
                        <?php echo $wp_nav_html; ?>
                    </div>
                </div>

            </aside>

        </div>

        <!-- ===== Left: WP Navigation (desktop only) ===== -->
        <nav class="mh-wp-nav" aria-label="ناوبری اصلی">
            <?php echo $wp_nav_html; ?>
        </nav>

    </div>
    <?php
    return ob_get_clean();
}

function mh_iks_menu_register() {
    $base = plugin_dir_path(__FILE__);

    wp_register_script(
        'mh-iks-menu-editor',
        plugins_url('index.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'],
        file_exists($base . 'index.js') ? filemtime($base . 'index.js') : '2.0.0',
        true
    );

    wp_register_script(
        'mh-iks-menu-view',
        plugins_url('view.js', __FILE__),
        [],
        file_exists($base . 'view.js') ? filemtime($base . 'view.js') : '2.0.0',
        true
    );

    wp_register_style(
        'mh-iks-menu-style',
        plugins_url('style.css', __FILE__),
        [],
        file_exists($base . 'style.css') ? filemtime($base . 'style.css') : '2.0.0'
    );

    register_block_type('mh/iks-menu', [
        'api_version'      => 3,
        'editor_script'    => 'mh-iks-menu-editor',
        'view_script'      => 'mh-iks-menu-view',
        'style'            => 'mh-iks-menu-style',
        'render_callback'  => 'mh_iks_menu_render',
        'attributes'       => [
            'menuId' => [
                'type'    => 'string',
                'default' => '355',
            ],
        ],
    ]);
}

add_action('init', 'mh_iks_menu_register');
