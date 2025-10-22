// Table of Contents (TOC) Generator and Scroll Spy
// Generates a sticky sidebar minimap for post navigation

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        contentSelector: '.post-content, .cv-content',
        tocContainerSelector: '#toc-content',
        tocSidebarSelector: '#post-toc, #cv-toc',
        headingSelector: 'h2, h3',
        activeClass: 'active',
        scrollOffset: 100, // Activate section when this far from top
        minHeadingsRequired: 2 // Minimum headings to show TOC
    };

    // Generate unique ID for heading
    function generateId(text, index) {
        // Remove special characters and convert to kebab-case
        const base = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s가-힣-]/g, '') // Keep alphanumeric, Korean, and hyphens
            .replace(/\s+/g, '-');
        return base || `heading-${index}`;
    }

    // Generate TOC HTML
    function generateTOC() {
        const content = document.querySelector(CONFIG.contentSelector);
        const tocContainer = document.querySelector(CONFIG.tocContainerSelector);
        const tocSidebar = document.querySelector(CONFIG.tocSidebarSelector);

        if (!content || !tocContainer || !tocSidebar) {
            return;
        }

        // Find all headings
        const headings = content.querySelectorAll(CONFIG.headingSelector);

        // Check if we have enough headings
        if (headings.length < CONFIG.minHeadingsRequired) {
            tocSidebar.style.display = 'none';
            return;
        }

        // Generate TOC structure
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            // Ensure heading has an ID
            if (!heading.id) {
                heading.id = generateId(heading.textContent, index);
            }

            // Create TOC item
            const li = document.createElement('li');
            const level = heading.tagName.toLowerCase();
            li.className = `toc-item toc-${level}`;

            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = 'toc-link';
            link.setAttribute('data-heading-id', heading.id);

            // Smooth scroll on click
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.getElementById(heading.id);
                if (target) {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state immediately
                    updateActiveLink(heading.id);
                }
            });

            li.appendChild(link);
            tocList.appendChild(li);
        });

        tocContainer.appendChild(tocList);

        // Initialize scroll spy
        initScrollSpy(headings);
    }

    // Initialize scroll spy to highlight active section
    function initScrollSpy(headings) {
        let ticking = false;

        function updateOnScroll() {
            const scrollPosition = window.pageYOffset + CONFIG.scrollOffset;

            // Find the current active heading
            let activeHeading = null;

            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;

                if (scrollPosition >= headingTop) {
                    activeHeading = heading;
                    break;
                }
            }

            // Update active link
            if (activeHeading) {
                updateActiveLink(activeHeading.id);
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }

        // Listen to scroll events
        window.addEventListener('scroll', requestTick, { passive: true });

        // Initial update
        updateOnScroll();
    }

    // Update active link in TOC
    function updateActiveLink(activeId) {
        const tocLinks = document.querySelectorAll('.toc-link');

        tocLinks.forEach(link => {
            if (link.getAttribute('data-heading-id') === activeId) {
                link.classList.add(CONFIG.activeClass);
            } else {
                link.classList.remove(CONFIG.activeClass);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateTOC);
    } else {
        generateTOC();
    }
})();
