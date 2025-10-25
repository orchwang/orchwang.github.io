// Category Tree Expand/Collapse Functionality

function toggleNode(header) {
    const node = header.closest('.tree-node');

    if (node) {
        node.classList.toggle('collapsed');

        // Save state to localStorage
        const parent = node.getAttribute('data-parent');
        if (parent) {
            saveTreeState(parent, node.classList.contains('collapsed'));
        }
    }
}

// Save tree state to localStorage
function saveTreeState(categoryName, isCollapsed) {
    const treeState = JSON.parse(localStorage.getItem('categoryTreeState') || '{}');
    treeState[categoryName] = isCollapsed;
    localStorage.setItem('categoryTreeState', JSON.stringify(treeState));
}

// Load tree state from localStorage
function loadTreeState() {
    const treeState = JSON.parse(localStorage.getItem('categoryTreeState') || '{}');

    // Apply saved states to nodes
    Object.keys(treeState).forEach(categoryName => {
        const node = document.querySelector(`.tree-node[data-parent="${categoryName}"]`);
        if (node && treeState[categoryName]) {
            node.classList.add('collapsed');
        }
    });
}

// Initialize tree view on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved tree state
    loadTreeState();

    // Add keyboard navigation support
    document.querySelectorAll('.tree-node-header').forEach(header => {
        header.setAttribute('tabindex', '0');

        header.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNode(this);
            }
        });
    });
});

// Expand all nodes
function expandAll() {
    document.querySelectorAll('.tree-node.collapsed').forEach(node => {
        node.classList.remove('collapsed');
    });
    localStorage.removeItem('categoryTreeState');
}

// Collapse all nodes
function collapseAll() {
    document.querySelectorAll('.tree-node').forEach(node => {
        node.classList.add('collapsed');
    });
}
