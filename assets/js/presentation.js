// Presentation Mode
// Opt-in per post (front matter `presentation: true`). A post that opts in
// authors a SEPARATE, presentation-tuned edition of its content — NOT a
// mirror of the reading body. The deck lives in the post file inside a
// hidden `<div class="deck-source">`, one `<section class="slide">` per
// slide. This module reads that authored deck and plays it fullscreen.
//
// Authoring contract (see any post with `presentation: true`):
//   <div class="deck-source" hidden>
//     <section class="slide slide--title"> …title slide… </section>
//     <section class="slide"> …content… </section>
//   </div>
// A slide may carry modifier classes (e.g. `slide--title`, `slide--center`)
// which map onto `present-slide--*` for styling.

(function () {
    'use strict';

    const CONFIG = {
        buttonSelector: '.js-present-btn',
        deckSelector: '.deck-source'
    };

    // Build the playable deck by cloning each authored `.slide` into a
    // `.present-slide`. Modifier classes on the source slide are carried over
    // as `present-slide--<mod>` so the stylesheet can target them.
    function buildDeck() {
        const source = document.querySelector(CONFIG.deckSelector);
        if (!source) return null;

        const authored = source.querySelectorAll(':scope > .slide');
        if (authored.length === 0) return null;

        return Array.from(authored).map((el) => {
            const slide = document.createElement('section');
            slide.className = 'present-slide';

            // Carry `slide--foo` modifiers over to `present-slide--foo`.
            el.classList.forEach((cls) => {
                const m = cls.match(/^slide--(.+)$/);
                if (m) slide.classList.add('present-slide--' + m[1]);
            });

            const inner = document.createElement('div');
            inner.className = 'present-slide-inner';
            Array.from(el.childNodes).forEach((n) => inner.appendChild(n.cloneNode(true)));
            slide.appendChild(inner);
            return slide;
        });
    }

    // The running presentation instance (overlay + state + handlers).
    function openPresentation() {
        const slides = buildDeck();
        if (!slides || slides.length === 0) return;

        let index = 0;
        const total = slides.length;

        const overlay = document.createElement('div');
        overlay.className = 'present-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', '발표 모드');

        const stage = document.createElement('div');
        stage.className = 'present-stage';
        slides.forEach((s) => stage.appendChild(s));
        overlay.appendChild(stage);

        // Progress bar
        const progress = document.createElement('div');
        progress.className = 'present-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'present-progress-bar';
        progress.appendChild(progressBar);
        overlay.appendChild(progress);

        // Controls
        const controls = document.createElement('div');
        controls.className = 'present-controls';

        const prevBtn = makeCtrl('present-prev', '◀', '이전 슬라이드');
        const counter = document.createElement('span');
        counter.className = 'present-counter';
        const nextBtn = makeCtrl('present-next', '▶', '다음 슬라이드');
        const exitBtn = makeCtrl('present-exit', '✕', '발표 종료 (Esc)');

        controls.appendChild(prevBtn);
        controls.appendChild(counter);
        controls.appendChild(nextBtn);
        controls.appendChild(exitBtn);
        overlay.appendChild(controls);

        document.body.appendChild(overlay);
        document.body.classList.add('present-active');

        function makeCtrl(cls, glyph, label) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'present-ctrl ' + cls;
            b.setAttribute('aria-label', label);
            b.textContent = glyph;
            return b;
        }

        function render() {
            slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
            counter.textContent = (index + 1) + ' / ' + total;
            progressBar.style.width = (total > 1 ? (index / (total - 1)) * 100 : 100) + '%';
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === total - 1;
            // Reset scroll of the active slide to the top on each move.
            const active = slides[index];
            if (active) active.scrollTop = 0;
        }

        function go(to) {
            index = Math.max(0, Math.min(total - 1, to));
            render();
        }

        function next() { go(index + 1); }
        function prev() { go(index - 1); }

        function onKey(e) {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    next();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    prev();
                    break;
                case 'Home':
                    e.preventDefault();
                    go(0);
                    break;
                case 'End':
                    e.preventDefault();
                    go(total - 1);
                    break;
                case 'Escape':
                    // If in native fullscreen, the browser handles Esc (exits
                    // fullscreen); fullscreenchange then closes us. Otherwise
                    // close directly.
                    if (!document.fullscreenElement) {
                        e.preventDefault();
                        close();
                    }
                    break;
            }
        }

        function onFsChange() {
            // User pressed Esc / F11 to leave fullscreen — tear the deck down.
            if (!document.fullscreenElement && overlay.isConnected) {
                close();
            }
        }

        function close() {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('fullscreenchange', onFsChange);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(function () {});
            }
            overlay.remove();
            document.body.classList.remove('present-active');
            const trigger = document.querySelector(CONFIG.buttonSelector);
            if (trigger) trigger.focus();
        }

        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);
        exitBtn.addEventListener('click', close);
        document.addEventListener('keydown', onKey);
        document.addEventListener('fullscreenchange', onFsChange);

        render();

        // Enter native fullscreen (best-effort — some browsers require the
        // gesture, which we have from the button click). If it's rejected we
        // still show the overlay full-viewport via CSS.
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(function () {});
        }
    }

    function init() {
        const btn = document.querySelector(CONFIG.buttonSelector);
        if (!btn) return;
        btn.addEventListener('click', openPresentation);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
