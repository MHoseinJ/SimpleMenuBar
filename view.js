document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mh-iks-menu').forEach(root => {
        const toggle = root.querySelector('.mh-iks-menu__toggle');
        const panel = root.querySelector('.mh-iks-menu__panel');
        const backdrop = root.querySelector('.mh-iks-menu__backdrop');
        const closeButton = root.querySelector('.mh-iks-menu__close');

        if (!toggle || !panel || !backdrop || !closeButton) {
            return;
        }

        // Move the drawer outside the header DOM hierarchy.
        document.body.appendChild(backdrop);
        document.body.appendChild(panel);

        panel.hidden = false;
        backdrop.hidden = false;

        panel.inert = true;
        panel.setAttribute('aria-hidden', 'true');

        let previousOverflow = '';

        function openMenu() {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            panel.inert = false;
            panel.setAttribute('aria-hidden', 'false');

            backdrop.classList.add('is-open');
            panel.classList.add('is-open');

            toggle.setAttribute('aria-expanded', 'true');

            closeButton.focus();
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
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    });
});
