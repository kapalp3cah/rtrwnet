/* ======================================== */
/*  HOME PAGE - BRZ AZURE GOLD THEME       */
/*  Blue Router Zone - JavaScript Home     */
/* ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Active nav link based on current URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link-brz');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.startsWith('/pelanggan') && href === '/pelanggan/') ||
            (currentPath.startsWith('/pricing') && href === '/pricing/')) {
            link.classList.add('active');
        }
    });

    // Optional: Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});