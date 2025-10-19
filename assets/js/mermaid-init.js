/**
 * Mermaid.js Custom Configuration
 *
 * This file provides additional customization options for Mermaid diagrams.
 * You can modify themes, styling, and behavior as needed.
 */

// Advanced configuration options (currently handled inline in default.html)
// If you need more control, you can:
// 1. Remove the inline script from default.html
// 2. Load this file instead: <script src="{{ '/assets/js/mermaid-init.js' | relative_url }}" type="module"></script>
// 3. Uncomment and customize the code below:

/*
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

// Detect dark mode preference
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

mermaid.initialize({
    startOnLoad: true,
    theme: isDarkMode ? 'dark' : 'default',
    securityLevel: 'loose',
    themeVariables: {
        primaryColor: '#4A90E2',
        primaryTextColor: '#333',
        primaryBorderColor: '#7C9CBF',
        lineColor: '#5C6773',
        secondaryColor: '#E8F4F8',
        tertiaryColor: '#F5F5F5'
    },
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    },
    sequence: {
        actorMargin: 50,
        useMaxWidth: true
    },
    gantt: {
        useMaxWidth: true,
        fontSize: 14
    }
});

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    mermaid.initialize({
        theme: e.matches ? 'dark' : 'default'
    });
    // Re-render all mermaid diagrams
    mermaid.contentLoaded();
});
*/

// For basic usage, the inline script in default.html is sufficient.
// This file is provided for future customization needs.
