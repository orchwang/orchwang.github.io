/**
 * theme-toggle.js — Tavern (light) <-> Dungeon (dark) theme switch.
 *
 * The pre-paint inline script in default.html already applied any saved
 * preference to <html data-theme>. This wires the header toggle button:
 *  - if no explicit choice yet, the button flips relative to the current
 *    *effective* theme (which may come from prefers-color-scheme),
 *  - the choice is persisted in localStorage and reflected on <html>.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var root = document.documentElement;

    function prefersDark() {
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function effectiveTheme() {
        var attr = root.getAttribute('data-theme');
        if (attr === 'dark' || attr === 'light') return attr;
        return prefersDark() ? 'dark' : 'light';
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('aria-pressed', String(theme === 'dark'));
            btn.setAttribute(
                'aria-label',
                theme === 'dark' ? '낮(주막) 테마로 전환' : '밤(던전) 테마로 전환'
            );
        }
    }

    function init() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Reflect current state on the button at load.
        var current = effectiveTheme();
        btn.setAttribute('aria-pressed', String(current === 'dark'));

        btn.addEventListener('click', function () {
            apply(effectiveTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
