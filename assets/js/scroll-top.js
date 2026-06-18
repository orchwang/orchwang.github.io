/**
 * scroll-top.js — Gorehowl "recall" button.
 * Shows a crossed-axe button after the reader scrolls down; clicking it
 * returns to the top. Honors prefers-reduced-motion (jumps instead of
 * smooth-scrolls). Pure progressive enhancement — no effect if the button
 * is absent.
 */
(function () {
    'use strict';

    var btn = document.getElementById('scroll-top');
    if (!btn) return;

    var SHOW_AT = 400; // px scrolled before the sigil appears
    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        btn.classList.toggle('is-visible', y > SHOW_AT);
    }

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();
