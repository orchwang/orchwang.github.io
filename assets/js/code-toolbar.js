/*
 * code-toolbar.js — attaches a convenience toolbar to every syntax-highlighted
 * code block in a post: a language label (left) + a copy-to-clipboard button
 * (right) with copied-state feedback.
 *
 * Benchmarked against MDN / Stripe / Docusaurus / Shiki-based docs:
 *   - header bar carrying the language name (MDN, Stripe)
 *   - one-click copy with transient "복사됨!" confirmation (universal)
 *
 * Targets Rouge output only (`div.highlighter-rouge`), so Mermaid blocks
 * (`pre > code.language-mermaid`, no rouge wrapper) are naturally excluded.
 * Degrades gracefully: with JS off, blocks keep their plain styling.
 */
(function () {
    'use strict';

    // Pretty display names; falls back to the raw class token uppercased.
    var LANG_LABELS = {
        python: 'Python', py: 'Python',
        go: 'Go', golang: 'Go',
        javascript: 'JavaScript', js: 'JavaScript',
        typescript: 'TypeScript', ts: 'TypeScript',
        bash: 'Bash', sh: 'Shell', shell: 'Shell', zsh: 'Shell', console: 'Shell',
        rust: 'Rust', rs: 'Rust',
        c: 'C', cpp: 'C++', 'c++': 'C++',
        java: 'Java', kotlin: 'Kotlin',
        ruby: 'Ruby', rb: 'Ruby',
        sql: 'SQL', postgresql: 'SQL', psql: 'SQL',
        json: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML',
        html: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS',
        markdown: 'Markdown', md: 'Markdown',
        dockerfile: 'Dockerfile', make: 'Makefile', makefile: 'Makefile',
        text: 'Text', plaintext: 'Text'
    };

    var COPY_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
        '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

    var CHECK_SVG =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 6 9 17l-5-5"/></svg>';

    function detectLang(block) {
        var m = block.className.match(/language-([\w+#.-]+)/);
        if (!m) { return ''; }
        return m[1].toLowerCase();
    }

    function labelFor(lang) {
        if (!lang) { return 'Code'; }
        return LANG_LABELS[lang] || lang.toUpperCase();
    }

    // Split Rouge's highlighted innerHTML into per-line HTML fragments while
    // keeping token spans balanced. Rouge emits multi-line spans (e.g. a comment
    // span that contains a trailing "\n"), so a naive split on "\n" would leave
    // unbalanced tags — instead we close every open tag at a line break and
    // re-open the same tags on the next line.
    function splitHighlightedLines(html) {
        var lines = [];
        var open = []; // stack of full opening-tag strings still in effect
        var cur = '';
        var re = /(<[^>]+>)|(\n)|([^<\n]+)/g;
        var m;
        function nameOf(tag) {
            var mm = tag.match(/^<\s*([a-zA-Z0-9]+)/);
            return mm ? mm[1] : '';
        }
        while ((m = re.exec(html)) !== null) {
            if (m[1]) {
                var tag = m[1];
                cur += tag;
                if (/^<\//.test(tag)) {
                    open.pop();
                } else if (!/\/>$/.test(tag)) {
                    open.push(tag);
                }
            } else if (m[2]) {
                // newline: close open tags for this line, reopen for the next
                var closers = '';
                for (var i = open.length - 1; i >= 0; i--) {
                    closers += '</' + nameOf(open[i]) + '>';
                }
                lines.push(cur + closers);
                cur = open.join('');
            } else {
                cur += m[3];
            }
        }
        lines.push(cur);
        // Drop the single trailing empty line produced by Rouge's final "\n".
        if (lines.length > 1 && lines[lines.length - 1] === '') {
            lines.pop();
        }
        return lines;
    }

    // Wrap each source line in a .code-line block so CSS can render a line-number
    // gutter and a hover row highlight. Returns true if the block was line-wrapped.
    function wrapLines(codeEl) {
        var lines = splitHighlightedLines(codeEl.innerHTML);
        if (lines.length < 2) { return false; } // skip 1-line blocks
        var out = '';
        for (var i = 0; i < lines.length; i++) {
            // A non-empty placeholder keeps blank rows at full line height.
            var content = lines[i] === '' ? ' ' : lines[i];
            out += '<span class="code-line">' + content + '</span>';
        }
        codeEl.innerHTML = out;
        return true;
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback for non-secure contexts / older browsers.
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            document.body.removeChild(ta);
            ok ? resolve() : reject(new Error('execCommand copy failed'));
        });
    }

    function enhance(block) {
        if (block.classList.contains('code-block--enhanced')) { return; }
        // Skip the hidden presentation deck source — it is not reading content.
        if (block.closest('.deck-source')) { return; }

        var codeEl = block.querySelector('pre code') || block.querySelector('code');
        if (!codeEl) { return; }

        // Capture the raw source ONCE, before any DOM rewriting, so the copy
        // action is decoupled from the line-number gutter (which is CSS-only and
        // never enters the DOM as text).
        var rawText = codeEl.textContent.replace(/\n$/, '');

        var lang = detectLang(block);

        var toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';

        var langEl = document.createElement('span');
        langEl.className = 'code-toolbar__lang';
        langEl.textContent = labelFor(lang);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', '코드 복사');
        btn.innerHTML = COPY_SVG + '<span class="code-copy-btn__label">복사</span>';

        var resetTimer = null;
        btn.addEventListener('click', function () {
            copyText(rawText).then(function () {
                setState('is-copied', CHECK_SVG, '복사됨!');
            }, function () {
                setState('is-error', COPY_SVG, '복사 실패');
            });
        });

        function setState(cls, icon, label) {
            btn.classList.remove('is-copied', 'is-error');
            btn.classList.add(cls);
            btn.innerHTML = icon + '<span class="code-copy-btn__label">' + label + '</span>';
            if (resetTimer) { clearTimeout(resetTimer); }
            resetTimer = setTimeout(function () {
                btn.classList.remove('is-copied', 'is-error');
                btn.innerHTML = COPY_SVG + '<span class="code-copy-btn__label">복사</span>';
            }, 2000);
        }

        toolbar.appendChild(langEl);
        toolbar.appendChild(btn);

        block.classList.add('code-block--enhanced');
        // Line-number gutter + hover row highlight (blocks with 2+ lines).
        if (wrapLines(codeEl)) {
            block.classList.add('code-block--numbered');
        }
        block.insertBefore(toolbar, block.firstChild);
    }

    function init() {
        var blocks = document.querySelectorAll('.post-content .highlighter-rouge');
        Array.prototype.forEach.call(blocks, enhance);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
