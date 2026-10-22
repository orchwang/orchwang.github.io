/**
 * Mermaid diagrams, rendered with Pele (https://pele.run)
 *
 * Pele parses Mermaid syntax and emits SVG whose colors and fonts come from
 * `--pele-*` CSS variables (mapped to the design tokens in style.css), so a
 * diagram follows the ☀️/🔥 theme toggle without re-rendering.
 *
 * - Inline: the diagram renders at its natural size. When it is wider than
 *   the column, Pele scales it down and offers its own zoom
 *   (Ctrl/⌘ + wheel, drag, +/−/reset buttons) — plain wheel scrolls the page.
 * - ⛶ 전체화면: a GitHub-style expand dialog that mounts the same source
 *   again in a fullscreen overlay (drag, wheel, pinch, buttons, Esc).
 *
 * Pele is only fetched on pages that contain a ```mermaid block. If it fails
 * to load, the fenced source stays on the page as a readable fallback.
 */

const PELE_URL = 'https://cdn.jsdelivr.net/npm/pele@1.8.0/dist/esm/lazy.js';

// Initial zoom step for the fullscreen toolbar / keyboard (+, −)
const ZOOM_STEP = 1.5;

const blocks = document.querySelectorAll('pre > code.language-mermaid');
if (blocks.length > 0) init();

async function init() {
    let pele;
    try {
        pele = await import(PELE_URL);
    } catch (error) {
        console.error('Pele could not be loaded; Mermaid blocks stay as source.', error);
        return;
    }

    for (const code of blocks) {
        const source = code.textContent;
        const frame = document.createElement('div');
        frame.className = 'mermaid-frame';
        const diagram = document.createElement('div');
        diagram.className = 'mermaid';
        frame.appendChild(diagram);
        code.parentElement.replaceWith(frame);

        try {
            const mounted = await pele.mountAsync(diagram, source, { zoom: 'auto' });
            if (mounted.error) {
                console.warn('Mermaid diagram failed to render:', mounted.error);
                continue;
            }
            frame.appendChild(createExpandButton(pele, source));
        } catch (error) {
            console.warn('Mermaid diagram failed to render:', error);
        }
    }
}

function createExpandButton(pele, source) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mermaid-expand-btn';
    btn.textContent = '⛶ 전체화면';
    btn.title = '전체화면으로 보기';
    btn.setAttribute('aria-label', '다이어그램 전체화면으로 보기');
    btn.addEventListener('click', () => openFullscreen(pele, source, btn));
    return btn;
}

// Nearest preceding heading — used as the dialog title for context.
function findHeading(el) {
    let node = el;
    while (node && !node.classList?.contains('post-content')) {
        let prev = node.previousElementSibling;
        while (prev) {
            if (/^H[2-4]$/.test(prev.tagName)) return prev.textContent.trim();
            prev = prev.previousElementSibling;
        }
        node = node.parentElement;
    }
    return '다이어그램';
}

async function openFullscreen(pele, source, trigger) {
    if (document.querySelector('.mermaid-fullscreen')) return;

    const overlay = document.createElement('div');
    overlay.className = 'mermaid-fullscreen';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '다이어그램 전체화면 보기');
    overlay.innerHTML =
        '<div class="mermaid-fullscreen-bar">' +
            '<span class="mermaid-fullscreen-title"></span>' +
            '<span class="mermaid-fullscreen-hint">드래그 이동 · 휠/핀치 확대 · Esc 닫기</span>' +
            '<div class="mermaid-fullscreen-tools">' +
                '<button type="button" data-act="out" title="축소 (-)" aria-label="축소">−</button>' +
                '<button type="button" data-act="in" title="확대 (+)" aria-label="확대">+</button>' +
                '<button type="button" data-act="fit" title="화면에 맞춤 (0)">⟲ 맞춤</button>' +
                '<button type="button" data-act="close" title="닫기 (Esc)">✕ 닫기</button>' +
            '</div>' +
        '</div>' +
        '<div class="mermaid-fullscreen-stage"><div class="mermaid"></div></div>';
    overlay.querySelector('.mermaid-fullscreen-title').textContent = '🔍 ' + findHeading(trigger);

    document.body.appendChild(overlay);
    document.body.classList.add('mermaid-fullscreen-open');

    const stage = overlay.querySelector('.mermaid-fullscreen-stage');
    let mounted = null;
    const zoom = () => mounted?.zoom;

    // Pele zooms by moving the viewBox inside the SVG's box and fits by width
    // only, so a tall diagram would be clipped. Size the box to fit the stage
    // by width AND height (never upscaling), then let Pele re-read it.
    const sizeToStage = () => {
        const svg = stage.querySelector('.mermaid > svg');
        if (!svg) return;
        const natural = {
            width: Number(svg.getAttribute('width')) || svg.getBoundingClientRect().width,
            height: Number(svg.getAttribute('height')) || svg.getBoundingClientRect().height
        };
        const style = getComputedStyle(stage.firstElementChild);
        const w = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const h = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        const scale = Math.min(1, w / natural.width, h / natural.height);
        svg.style.maxWidth = 'none';
        svg.style.width = `${Math.floor(natural.width * scale)}px`;
        svg.style.height = `${Math.floor(natural.height * scale)}px`;
        zoom()?.refresh();
    };
    const fit = () => zoom()?.reset();

    let resizeTimer;
    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(sizeToStage, 120);
    };

    const close = () => {
        window.removeEventListener('resize', onResize);
        document.removeEventListener('keydown', onKey, true);
        mounted?.destroy();
        overlay.remove();
        document.body.classList.remove('mermaid-fullscreen-open');
        trigger?.focus();
    };

    const onKey = (e) => {
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                close();
                break;
            case '+':
            case '=':
                e.preventDefault();
                zoom()?.zoomBy(ZOOM_STEP);
                break;
            case '-':
            case '_':
                e.preventDefault();
                zoom()?.zoomBy(1 / ZOOM_STEP);
                break;
            case '0':
                e.preventDefault();
                fit();
                break;
            case 'Tab': {
                // Keep focus inside the dialog
                const buttons = overlay.querySelectorAll('button');
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
                break;
            }
        }
        e.stopPropagation();
    };

    overlay.querySelector('.mermaid-fullscreen-tools').addEventListener('click', (e) => {
        const act = e.target.closest('button')?.dataset.act;
        if (act === 'close') close();
        else if (act === 'fit') fit();
        else if (act === 'in') zoom()?.zoomBy(ZOOM_STEP);
        else if (act === 'out') zoom()?.zoomBy(1 / ZOOM_STEP);
    });

    document.addEventListener('keydown', onKey, true);
    overlay.querySelector('[data-act="close"]').focus();

    mounted = await pele.mountAsync(stage.firstElementChild, source, {
        zoom: { always: true, controls: false, maxScale: 8 }
    });
    // Closed while the diagram was still rendering
    if (!overlay.isConnected) {
        mounted.destroy();
        return;
    }
    sizeToStage();
    window.addEventListener('resize', onResize);
}
