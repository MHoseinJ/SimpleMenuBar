(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;

    registerBlockType('mh/iks-menu', {
        title: 'IKS Menu',
        category: 'widgets',
        icon: 'menu',
        description: 'Display an IKS Menu.',

        edit: function ({ attributes, setAttributes }) {
            return el(
                'div',
                useBlockProps(),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: 'Menu Settings' },
                        el(TextControl, {
                            label: 'Menu ID',
                            value: attributes.menuId,
                            onChange: value =>
                                setAttributes({ menuId: value })
                        })
                    )
                ),
                el('p', {}, 'IKS Menu: ' + attributes.menuId)
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);
