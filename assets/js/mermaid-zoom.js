/**
 * Mermaid Diagram Pan & Zoom Enhancement
 * Adds interactive pan, zoom, and move controls to all Mermaid diagrams
 * Uses svg-pan-zoom library for GitHub-style interaction
 */

// Expose function globally so it can be called from the module script
window.initMermaidZoom = function() {
    'use strict';

    // Check if device is mobile or tablet
    function isMobileOrTablet() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Check for common mobile/tablet patterns (most reliable)
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;
        const isMobileUA = mobileRegex.test(userAgent);

        // Check for touch capability
        const isTouchDevice = ('ontouchstart' in window) ||
                              (navigator.maxTouchPoints > 0) ||
                              (navigator.msMaxTouchPoints > 0);

        // Check viewport width (use window.innerWidth which respects viewport meta tag)
        // Most phones in portrait: ≤ 428px, tablets in portrait: ≤ 768px
        const isSmallViewport = window.innerWidth <= 768;

        // Primary check: User Agent (catches all mobile devices including high-res)
        if (isMobileUA) {
            console.log(`📱 Mobile detected via User Agent: ${userAgent}`);
            return true;
        }

        // Secondary check: Touch device with small viewport (catches edge cases)
        if (isTouchDevice && isSmallViewport) {
            console.log(`📱 Mobile detected via touch + small viewport: ${window.innerWidth}px`);
            return true;
        }

        console.log(`💻 Desktop detected: ${window.innerWidth}px, touch: ${isTouchDevice}`);
        return false;
    }

    // Skip zoom initialization on mobile/tablet devices
    if (isMobileOrTablet()) {
        console.log('📱 Mobile/tablet detected - Mermaid zoom interface disabled for better touch experience');

        // Just ensure minimum height for diagrams without zoom
        const mermaidDivs = document.querySelectorAll('.mermaid');
        mermaidDivs.forEach((mermaidDiv, index) => {
            const svg = mermaidDiv.querySelector('svg');
            if (svg) {
                const MIN_HEIGHT = 400;
                const currentHeight = svg.getAttribute('height');
                const computedHeight = svg.getBoundingClientRect().height;
                let actualHeight = currentHeight ? parseInt(currentHeight) : computedHeight;

                if (actualHeight < MIN_HEIGHT) {
                    svg.setAttribute('height', MIN_HEIGHT.toString());
                } else {
                    svg.setAttribute('height', actualHeight.toString());
                }

                // Add mobile class for styling
                mermaidDiv.classList.add('mermaid-mobile');
                console.log(`📱 Mobile diagram ${index}: height set to ${actualHeight}px (static, no zoom)`);
            }
        });
        return;
    }

    // Check if svg-pan-zoom is available
    if (typeof svgPanZoom === 'undefined') {
        console.warn('svg-pan-zoom library not loaded. Mermaid zoom functionality disabled.');
        return;
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Find all Mermaid diagram SVGs
    const mermaidDivs = document.querySelectorAll('.mermaid');

    if (mermaidDivs.length === 0) {
        console.log('No Mermaid diagrams found on this page.');
        return;
    }

    mermaidDivs.forEach((mermaidDiv, index) => {
        const svg = mermaidDiv.querySelector('svg');

        if (!svg) {
            console.warn('Mermaid div without SVG found, skipping...');
            return;
        }

        // Add unique ID if not present
        if (!svg.id) {
            svg.id = `mermaid-diagram-${index}`;
        }

        // Ensure minimum height for better visibility, but preserve larger original heights
        const MIN_HEIGHT = 500;
        const currentHeight = svg.getAttribute('height');
        const computedHeight = svg.getBoundingClientRect().height;

        // Get the actual height (prefer attribute, fallback to computed)
        let actualHeight = currentHeight ? parseInt(currentHeight) : computedHeight;

        // Only set height if it's smaller than minimum
        if (actualHeight < MIN_HEIGHT) {
            svg.setAttribute('height', MIN_HEIGHT.toString());
            actualHeight = MIN_HEIGHT;
        } else {
            // Preserve the original height if it's larger
            svg.setAttribute('height', actualHeight.toString());
        }

        // Set viewBox if not present to maintain aspect ratio
        if (!svg.getAttribute('viewBox')) {
            const width = svg.getAttribute('width') || svg.getBoundingClientRect().width;
            const height = actualHeight;
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }

        console.log(`📏 Diagram ${svg.id}: height set to ${actualHeight}px (min: ${MIN_HEIGHT}px)`);

        // Wrap the diagram in a container for better control
        const container = document.createElement('div');
        container.className = 'mermaid-zoom-container';

        // Replace the mermaid div with the container
        mermaidDiv.parentNode.insertBefore(container, mermaidDiv);
        container.appendChild(mermaidDiv);

        // Add interactive indicator
        const indicator = document.createElement('div');
        indicator.className = 'mermaid-interactive-badge';
        indicator.innerHTML = '🔍 Interactive: Pan, Zoom, Move';
        indicator.title = 'Drag to pan, scroll to zoom, double-click to reset';
        container.insertBefore(indicator, mermaidDiv);

        try {
            // Initialize svg-pan-zoom
            const panZoomInstance = svgPanZoom(`#${svg.id}`, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                fit: true,
                center: true,
                minZoom: 0.3,
                maxZoom: 15,
                zoomScaleSensitivity: 0.3,
                dblClickZoomEnabled: false, // We'll use double-click for reset
                mouseWheelZoomEnabled: true,
                preventMouseEventsDefault: true,

                // Callbacks
                beforeZoom: function(oldScale, newScale) {
                    return true;
                },

                onZoom: function(newScale) {
                    // Optional: Update zoom level display
                },

                beforePan: function(oldPan, newPan) {
                    return true;
                }
            });

            // Add double-click to reset zoom
            svg.addEventListener('dblclick', function(e) {
                e.preventDefault();
                panZoomInstance.resetZoom();
                panZoomInstance.center();
            });

            // Add keyboard shortcuts
            const keyHandler = function(e) {
                // Only if the diagram is in viewport
                if (!isElementInViewport(svg)) return;

                switch(e.key) {
                    case '+':
                    case '=':
                        e.preventDefault();
                        panZoomInstance.zoomIn();
                        break;
                    case '-':
                    case '_':
                        e.preventDefault();
                        panZoomInstance.zoomOut();
                        break;
                    case '0':
                        e.preventDefault();
                        panZoomInstance.resetZoom();
                        panZoomInstance.center();
                        break;
                }
            };

            // Add keyboard listener
            document.addEventListener('keydown', keyHandler);

            // Add reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'mermaid-reset-btn';
            resetBtn.innerHTML = '⟲ Reset View';
            resetBtn.title = 'Reset zoom and center diagram';
            resetBtn.onclick = function() {
                panZoomInstance.resetZoom();
                panZoomInstance.center();
            };
            container.appendChild(resetBtn);

            // Store instance for potential later access
            svg.panZoomInstance = panZoomInstance;

            console.log(`✅ Initialized pan/zoom for diagram: ${svg.id}`);
        } catch (error) {
            console.error('❌ Error initializing svg-pan-zoom for diagram:', svg.id, error);
        }
    });

    console.log(`🎉 Mermaid zoom initialization completed for ${mermaidDivs.length} diagram(s)`);
};
