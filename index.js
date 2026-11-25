(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const {
        PanelBody, TextControl, Button, SelectControl,
        ColorPicker, __experimentalNumberControl: NumberControl
    } = wp.components;
    const { __ } = wp.i18n;

    // کامپوننت ساده انتخاب رنگ (بدون نیاز به wp-block-editor ColorPalette)
    const ColorControl = ({ label, value, onChange }) => {
        return el(
            'div',
            { style: { marginBottom: '16px' } },
            el('label', { style: { display: 'block', marginBottom: '6px', fontWeight: '500' } }, label),
            el(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                el('input', {
                    type: 'color',
                    value: value || '#000000',
                    onChange: e => onChange(e.target.value),
                    style: { width: '40px', height: '40px', padding: '0', border: '1px solid #ccc', cursor: 'pointer' }
                }),
                el(TextControl, {
                    value: value || '',
                    onChange: onChange,
                    placeholder: '#000000 یا خالی',
                }),
                value && el(Button, {
                    isSmall: true,
                    variant: 'secondary',
                    onClick: () => onChange(''),
                }, 'پاک کردن')
            )
        );
    };

    registerBlockType('mh/iks-menu', {
        title: 'IKS Menu + WP Nav',
        category: 'widgets',
        icon: 'menu',
        description: 'Display IKS Menu sidebar and custom Navigation.',

        edit: function ({ attributes, setAttributes }) {
            const {
                menuId, navItems = [], navFontSize, navFontWeight,
                toggleLabel, toggleBg, toggleColor, toggleBorderColor,
                toggleBorderWidth, toggleBorderRadius, toggleHeight,
                togglePaddingX, toggleFontSize
            } = attributes;

            const addNavItem = () => {
                setAttributes({
                    navItems: [...navItems, { id: Date.now().toString(), label: 'آیتم جدید', url: '#' }]
                });
            };

            const removeNavItem = (index) => {
                setAttributes({ navItems: navItems.filter((_, i) => i !== index) });
            };

            const updateNavItem = (index, key, value) => {
                setAttributes({
                    navItems: navItems.map((item, i) =>
                        i === index ? { ...item, [key]: value } : item
                    )
                });
            };

            const moveNavItem = (index, direction) => {
                const newItems = [...navItems];
                const targetIndex = index + direction;
                if (targetIndex < 0 || targetIndex >= newItems.length) return;
                [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
                setAttributes({ navItems: newItems });
            };

            // پیش‌نمایش استایل دکمه در ویرایشگر
            const togglePreviewStyle = {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: (toggleHeight || 44) + 'px',
                padding: '0 ' + (togglePaddingX || 16) + 'px',
                border: (toggleBorderWidth || 1) + 'px solid ' + (toggleBorderColor || '#222'),
                borderRadius: (toggleBorderRadius || 6) + 'px',
                background: toggleBg || '#222',
                color: toggleColor || '#fff',
                fontSize: (toggleFontSize || 16) + 'px',
                cursor: 'pointer',
            };

            return el(
                Fragment,
                {},
                el(
                    InspectorControls,
                    {},
                    // ===== پنل IKS =====
                    el(
                        PanelBody,
                        { title: 'تنظیمات IKS', initialOpen: false },
                        el(TextControl, {
                            label: 'شناسه منوی IKS',
                            value: menuId,
                            onChange: value => setAttributes({ menuId: value })
                        })
                    ),

                    // ===== پنل استایل دکمه =====
                    el(
                        PanelBody,
                        { title: 'استایل دکمه همبرگر', initialOpen: false },
                        el(TextControl, {
                            label: 'متن دکمه (فقط در دسکتاپ)',
                            value: toggleLabel,
                            onChange: value => setAttributes({ toggleLabel: value }),
                            help: 'در موبایل فقط آیکون همبرگر نمایش داده می‌شود.'
                        }),
                        el(ColorControl, {
                            label: 'رنگ پس‌زمینه',
                            value: toggleBg,
                            onChange: value => setAttributes({ toggleBg: value })
                        }),
                        el(ColorControl, {
                            label: 'رنگ متن/آیکون',
                            value: toggleColor,
                            onChange: value => setAttributes({ toggleColor: value })
                        }),
                        el(ColorControl, {
                            label: 'رنگ حاشیه',
                            value: toggleBorderColor,
                            onChange: value => setAttributes({ toggleBorderColor: value })
                        }),
                        el(NumberControl, {
                            label: 'ضخامت حاشیه (px)',
                            value: toggleBorderWidth,
                            onChange: v => setAttributes({ toggleBorderWidth: parseInt(v) || 0 }),
                            min: 0, max: 10,
                        }),
                        el(NumberControl, {
                            label: 'شعاع گوشه (px)',
                            value: toggleBorderRadius,
                            onChange: v => setAttributes({ toggleBorderRadius: parseInt(v) || 0 }),
                            min: 0, max: 50,
                        }),
                        el(NumberControl, {
                            label: 'ارتفاع (px)',
                            value: toggleHeight,
                            onChange: v => setAttributes({ toggleHeight: parseInt(v) || 44 }),
                            min: 30, max: 80,
                        }),
                        el(NumberControl, {
                            label: 'پدینگ افقی (px)',
                            value: togglePaddingX,
                            onChange: v => setAttributes({ togglePaddingX: parseInt(v) || 16 }),
                            min: 0, max: 60,
                        }),
                        el(NumberControl, {
                            label: 'اندازه فونت (px)',
                            value: toggleFontSize,
                            onChange: v => setAttributes({ toggleFontSize: parseInt(v) || 16 }),
                            min: 10, max: 40,
                        })
                    ),

                    // ===== پنل ناوبری =====
                    el(
                        PanelBody,
                        { title: 'آیتم‌های ناوبری', initialOpen: false },
                        el(NumberControl, {
                            label: 'اندازه فونت ناوبری (px)',
                            value: navFontSize,
                            onChange: v => setAttributes({ navFontSize: parseInt(v) || 16 }),
                            min: 10, max: 40,
                        }),
                        el(SelectControl, {
                            label: 'وزن فونت ناوبری',
                            value: navFontWeight,
                            options: [
                                { label: 'نازک (300)', value: '300' },
                                { label: 'معمولی (400)', value: '400' },
                                { label: 'متوسط (500)', value: '500' },
                                { label: 'نیمه‌ضخیم (600)', value: '600' },
                                { label: 'ضخیم (700)', value: '700' },
                            ],
                            onChange: value => setAttributes({ navFontWeight: value })
                        }),
                        navItems.length === 0 && el('p', { style: { color: '#999' } }, 'هنوز آیتمی اضافه نشده است.'),
                        navItems.map((item, index) =>
                            el(
                                'div',
                                {
                                    key: item.id || index,
                                    style: {
                                        border: '1px solid #ddd',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderRadius: '4px',
                                        background: '#f9f9f9'
                                    }
                                },
                                el(TextControl, {
                                    label: 'نام آیتم',
                                    value: item.label,
                                    onChange: value => updateNavItem(index, 'label', value)
                                }),
                                el(TextControl, {
                                    label: 'لینک (URL)',
                                    value: item.url,
                                    onChange: value => updateNavItem(index, 'url', value)
                                }),
                                el(
                                    'div',
                                    { style: { display: 'flex', gap: '5px', marginTop: '8px' } },
                                    el(Button, {
                                        isSmall: true, variant: 'secondary',
                                        onClick: () => moveNavItem(index, -1),
                                        disabled: index === 0,
                                    }, '↑'),
                                    el(Button, {
                                        isSmall: true, variant: 'secondary',
                                        onClick: () => moveNavItem(index, 1),
                                        disabled: index === navItems.length - 1,
                                    }, '↓'),
                                    el(Button, {
                                        isSmall: true, isDestructive: true,
                                        onClick: () => removeNavItem(index),
                                    }, 'حذف')
                                )
                            )
                        ),
                        el(Button, {
                            variant: 'primary',
                            onClick: addNavItem,
                            style: { marginTop: '10px' }
                        }, '+ افزودن آیتم')
                    )
                ),

                // ===== پیش‌نمایش در ویرایشگر =====
                el(
                    'div',
                    useBlockProps(),
                    el(
                        'div',
                        { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' } },
                        // پیش‌نمایش دکمه
                        el(
                            'button',
                            { type: 'button', style: togglePreviewStyle, disabled: true },
                            el('span', { 'aria-hidden': 'true' }, '☰'),
                            el('span', { className: 'mh-editor-toggle-label' }, toggleLabel || 'محصولات')
                        ),
                        // پیش‌نمایش ناوبری
                        el(
                            'ul',
                            {
                                style: {
                                    display: 'flex', gap: '18px', listStyle: 'none',
                                    margin: 0, padding: 0,
                                    fontSize: (navFontSize || 16) + 'px',
                                    fontWeight: navFontWeight || '400',
                                }
                            },
                            navItems.map((item, i) =>
                                el('li', { key: i }, el('a', { href: item.url, onClick: e => e.preventDefault(), style: { color: 'inherit', textDecoration: 'none' } }, item.label))
                            )
                        )
                    ),
                    el('p', { style: { fontSize: '12px', color: '#666', marginTop: '12px' } },
                        'در موبایل فقط آیکون همبرگر نمایش داده می‌شود. متن دکمه فقط در دسکتاپ دیده می‌شود.'
                    )
                )
            );
        },

        save: function () {
            return null;
        }
    });
})(window.wp);
