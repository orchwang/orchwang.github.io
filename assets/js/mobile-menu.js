// Mobile Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNavigation = document.getElementById('main-navigation');

    if (hamburgerMenu && mainNavigation) {
        hamburgerMenu.addEventListener('click', function() {
            // Toggle active class on both hamburger and navigation
            this.classList.toggle('active');
            mainNavigation.classList.toggle('active');
        });

        // Close menu when clicking on a navigation link
        const navLinks = mainNavigation.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mainNavigation.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mainNavigation.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && mainNavigation.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                mainNavigation.classList.remove('active');
            }
        });
    }
});
