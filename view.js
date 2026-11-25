document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mh-iks-nav-wrapper').forEach(wrapper => {
        const toggle = wrapper.querySelector('.mh-iks-menu__toggle');
        const panel = wrapper.querySelector('.mh-iks-menu__panel');
        const backdrop = wrapper.querySelector('.mh-iks-menu__backdrop');
        const closeButton = wrapper.querySelector('.mh-iks-menu__close');
        const tabs = wrapper.querySelectorAll('.mh-iks-menu__tab');
        const tabPanels = wrapper.querySelectorAll('.mh-iks-menu__tabpanel');

        if (!toggle || !panel || !backdrop || !closeButton) {
            return;
        }

        // Move drawer + backdrop to body to avoid stacking context issues
        document.body.appendChild(backdrop);
        document.body.appendChild(panel);

        panel.hidden = false;
        backdrop.hidden = false;

        panel.inert = true;
        panel.setAttribute('aria-hidden', 'true');

        let previousOverflow = '';

        /* ---------- Tab switching ---------- */
        function activateTab(tab) {
            tabs.forEach(t => {
                t.classList.remove('is-active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            });
            tabPanels.forEach(p => {
                p.classList.remove('is-active');
                p.hidden = true;
            });

            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');

            const targetId = tab.getAttribute('aria-controls');
            const targetPanel = panel.querySelector('#' + CSS.escape(targetId));
            if (targetPanel) {
                targetPanel.classList.add('is-active');
                targetPanel.hidden = false;
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => activateTab(tab));
            tab.addEventListener('keydown', e => {
                const currentIndex = Array.from(tabs).indexOf(tab);
                let nextIndex = null;
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabs.length;
                } else if (e.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                }
                if (nextIndex !== null) {
                    e.preventDefault();
                    tabs[nextIndex].focus();
                    activateTab(tabs[nextIndex]);
                }
            });
        });

        /* ---------- Open / Close ---------- */
        function openMenu() {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            panel.inert = false;
            panel.setAttribute('aria-hidden', 'false');

            backdrop.classList.add('is-open');
            panel.classList.add('is-open');

            toggle.setAttribute('aria-expanded', 'true');

            // Focus first focusable in active tab panel
            const activePanel = panel.querySelector('.mh-iks-menu__tabpanel.is-active');
            const firstFocusable = activePanel
                ? activePanel.querySelector('a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])')
                : null;
            (firstFocusable || closeButton).focus();
        }

        function closeMenu() {
            panel.classList.remove('is-open');
            backdrop.classList.remove('is-open');

            panel.inert = true;
            panel.setAttribute('aria-hidden', 'true');

            toggle.setAttribute('aria-expanded', 'false');

            document.body.style.overflow = previousOverflow;

            toggle.focus();
        }

        toggle.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        /* ---------- Keyboard trap ---------- */
        document.addEventListener('keydown', event => {
            if (!panel.classList.contains('is-open')) {
                return;
            }

            if (event.key === 'Escape') {
                closeMenu();
                return;
            }

            if (event.key === 'Tab') {
                const focusable = panel.querySelectorAll(
                    'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
                );

                if (!focusable.length) {
                    event.preventDefault();
                    closeButton.focus();
                    return;
                }

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    });
});
