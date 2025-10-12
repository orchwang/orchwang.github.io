// Simple client-side search functionality
(function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let posts = [];

    // Fetch search data
    fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
        })
        .catch(error => console.error('Error loading search data:', error));

    // Debounce function to limit search frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Search function
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        query = query.toLowerCase();
        const results = posts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(query);
            const contentMatch = post.content.toLowerCase().includes(query);
            const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
            return titleMatch || contentMatch || tagMatch;
        });

        displayResults(results, query);
    }

    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>';
            searchResults.style.display = 'block';
            return;
        }

        const html = results.slice(0, 10).map(post => {
            // Get excerpt with highlighted query
            const excerpt = getExcerpt(post.content, query);

            return `
                <div class="search-result-item">
                    <h3><a href="${post.url}">${highlightText(post.title, query)}</a></h3>
                    <div class="search-result-date">${post.date}</div>
                    ${post.tags.length > 0 ? `
                        <div class="search-result-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <p class="search-result-excerpt">${excerpt}</p>
                </div>
            `;
        }).join('');

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Get excerpt around matched text
    function getExcerpt(content, query) {
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) {
            return content.substring(0, 150) + '...';
        }

        const start = Math.max(0, index - 75);
        const end = Math.min(content.length, index + query.length + 75);
        let excerpt = content.substring(start, end);

        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';

        return highlightText(excerpt, query);
    }

    // Highlight matched text
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Escape special regex characters
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            performSearch(e.target.value);
        }, 300));

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Show results when focusing on input with existing query
        searchInput.addEventListener('focus', function() {
            if (searchInput.value.length >= 2) {
                performSearch(searchInput.value);
            }
        });
    }
})();
