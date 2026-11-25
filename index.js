(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;

    registerBlockType('mh/iks-menu', {
        title: 'IKS Menu + WP Nav',
        category: 'widgets',
        icon: 'menu',
        description: 'Display IKS Menu sidebar and WordPress Navigation.',

        edit: function ({ attributes, setAttributes }) {
            return el(
                'div',
                useBlockProps(),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: 'تنظیمات منو' },
                        el(TextControl, {
                            label: 'شناسه منوی IKS',
                            value: attributes.menuId,
                            onChange: value => setAttributes({ menuId: value })
                        })
                    )
                ),
                el('p', {}, 'IKS Menu: ' + attributes.menuId + ' (پیش‌نمایش در فرانت‌اند)'),
                el('p', { style: { fontSize: '12px', color: '#666' } },
                    'ناوبری وردپرس: از منوی primary یا header قالب استفاده می‌شود.'
                )
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);
