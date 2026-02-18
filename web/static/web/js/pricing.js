/* ======================================== */
/*  PRICING PAGE - BRZ AZURE GOLD THEME    */
/* ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Active nav link based on current URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link-brz');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.startsWith('/pricing') && href === '/pricing/')) {
            link.classList.add('active');
        }
    });
});