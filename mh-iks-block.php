<?php
/**
 * Plugin Name: MH IKS Menu + WP Nav Block
 * Description: Overlay sidebar for IKS Menu with WordPress Navigation integrated.
 * Version: 2.1.0
 * License: GPL-2.0-or-later
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
    $iks_menu  = do_shortcode('[iks_menu id="' . $menu_id . '"]');

    // ===== آیتم‌های ناوبری سفارشی =====
    $nav_items = $attributes['navItems'] ?? [];
    $wp_nav_html = '';
    if (!empty($nav_items)) {
        $wp_nav_html .= '<ul class="mh-wp-nav__list">';
        foreach ($nav_items as $item) {
            $label = esc_html($item['label'] ?? '');
            $url   = esc_url($item['url'] ?? '#');
            if (!$label) continue;
            $wp_nav_html .= '<li><a href="' . $url . '">' . $label . '</a></li>';
        }
        $wp_nav_html .= '</ul>';
    }

    // ===== تنظیمات فونت ناوبری =====
    $nav_font_size   = $attributes['navFontSize'] ?? '';
    $nav_font_weight = $attributes['navFontWeight'] ?? '';
    $nav_style = '';
    if ($nav_font_size)   { $nav_style .= 'font-size:' . esc_attr($nav_font_size) . 'px;'; }
    if ($nav_font_weight) { $nav_style .= 'font-weight:' . esc_attr($nav_font_weight) . ';'; }

    // ===== استایل دکمه همبرگر =====
    $toggle_label          = $attributes['toggleLabel'] ?? 'محصولات';
    $toggle_bg             = $attributes['toggleBg'] ?? '';
    $toggle_color          = $attributes['toggleColor'] ?? '';
    $toggle_border_color   = $attributes['toggleBorderColor'] ?? '';
    $toggle_border_width   = absint($attributes['toggleBorderWidth'] ?? 1);
    $toggle_border_radius  = absint($attributes['toggleBorderRadius'] ?? 6);
    $toggle_height         = absint($attributes['toggleHeight'] ?? 44);
    $toggle_padding_x      = absint($attributes['togglePaddingX'] ?? 16);
    $toggle_font_size      = absint($attributes['toggleFontSize'] ?? 16);

    $toggle_style = '';
    if ($toggle_bg)           { $toggle_style .= 'background:' . esc_attr($toggle_bg) . ';'; }
    if ($toggle_color)        { $toggle_style .= 'color:' . esc_attr($toggle_color) . ';'; }
    if ($toggle_border_color) { $toggle_style .= 'border-color:' . esc_attr($toggle_border_color) . ';'; }
    $toggle_style .= 'border-width:' . $toggle_border_width . 'px;';
    $toggle_style .= 'border-style:solid;';
    $toggle_style .= 'border-radius:' . $toggle_border_radius . 'px;';
    $toggle_style .= 'height:' . $toggle_height . 'px;';
    $toggle_style .= 'padding:0 ' . $toggle_padding_x . 'px;';
    $toggle_style .= 'font-size:' . $toggle_font_size . 'px;';

    ob_start();
    ?>
    <div class="mh-iks-nav-wrapper" dir="rtl">
        <div class="mh-iks-menu">
            <button
                class="mh-iks-menu__toggle"
                type="button"
                aria-expanded="false"
                aria-controls="<?php echo esc_attr($drawer_id); ?>"
                aria-label="<?php echo esc_attr($toggle_label ?: 'باز کردن منو'); ?>"
                style="<?php echo esc_attr($toggle_style); ?>"
            >
                <span class="mh-iks-menu__toggle-icon" aria-hidden="true">☰</span>
                <span class="mh-iks-menu__toggle-label"><?php echo esc_html($toggle_label); ?></span>
            </button>

            <button class="mh-iks-menu__backdrop" type="button" aria-label="بستن منو" hidden></button>

            <aside id="<?php echo esc_attr($drawer_id); ?>"
                class="mh-iks-menu__panel"
                role="dialog" aria-modal="true" aria-label="منوی ناوبری"
                dir="rtl" hidden>

                <div class="mh-iks-menu__tabs" role="tablist" aria-label="بخش‌های منو">
                    <button class="mh-iks-menu__tab is-active" role="tab" type="button"
                        id="<?php echo esc_attr($drawer_id); ?>-tab-iks"
                        aria-controls="<?php echo esc_attr($drawer_id); ?>-panel-iks"
                        aria-selected="true" tabindex="0">محصولات</button>
                    <button class="mh-iks-menu__tab" role="tab" type="button"
                        id="<?php echo esc_attr($drawer_id); ?>-tab-wp"
                        aria-controls="<?php echo esc_attr($drawer_id); ?>-panel-wp"
                        aria-selected="false" tabindex="-1">صفحات</button>
                </div>

                <div class="mh-iks-menu__header">
                    <span>منو</span>
                    <button class="mh-iks-menu__close" type="button" aria-label="بستن منو">&times;</button>
                </div>

                <div id="<?php echo esc_attr($drawer_id); ?>-panel-iks"
                    class="mh-iks-menu__tabpanel is-active" role="tabpanel"
                    aria-labelledby="<?php echo esc_attr($drawer_id); ?>-tab-iks">
                    <div class="mh-iks-menu__content"><?php echo $iks_menu; ?></div>
                </div>

                <div id="<?php echo esc_attr($drawer_id); ?>-panel-wp"
                    class="mh-iks-menu__tabpanel" role="tabpanel"
                    aria-labelledby="<?php echo esc_attr($drawer_id); ?>-tab-wp" hidden>
                    <div class="mh-iks-menu__content mh-wp-nav-content"><?php echo $wp_nav_html; ?></div>
                </div>
            </aside>
        </div>

        <nav class="mh-wp-nav" aria-label="ناوبری اصلی" style="<?php echo esc_attr($nav_style); ?>">
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
		'attributes' => [
		    'menuId' => [
		        'type'    => 'string',
		        'default' => '355',
		    ],
		    'navItems' => [
		        'type'    => 'array',
		        'default' => [],
		        'items'   => [ 'type' => 'object' ],
		    ],
		    'navFontSize' => [
		        'type'    => 'number',
		        'default' => 16,
		    ],
		    'navFontWeight' => [
		        'type'    => 'string',
		        'default' => '400',
		    ],
		    // ==== استایل دکمه ====
		    'toggleLabel' => [
		        'type'    => 'string',
		        'default' => 'محصولات',
		    ],
		    'toggleBg' => [
		        'type'    => 'string',
		        'default' => '', // اگر خالی باشد از CSS پیش‌فرض استفاده می‌شود
		    ],
		    'toggleColor' => [
		        'type'    => 'string',
		        'default' => '',
		    ],
		    'toggleBorderColor' => [
		        'type'    => 'string',
		        'default' => '',
		    ],
		    'toggleBorderWidth' => [
		        'type'    => 'number',
		        'default' => 1,
		    ],
		    'toggleBorderRadius' => [
		        'type'    => 'number',
		        'default' => 6,
		    ],
		    'toggleHeight' => [
		        'type'    => 'number',
		        'default' => 44,
		    ],
		    'togglePaddingX' => [
		        'type'    => 'number',
		        'default' => 16,
		    ],
		    'toggleFontSize' => [
		        'type'    => 'number',
		        'default' => 16,
		    ],
		],
    ]);
}

add_action('init', 'mh_iks_menu_register');
