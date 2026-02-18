/* ======================================== */
/*  BRZ AZURE GOLD THEME v1.0              */
/*  "Azure Speed, Gold Service"            */
/*  Blue Router Zone - Premium WiFi Theme  */
/*  JavaScript Interactions & Animations   */
/* ======================================== */

// ===== BRZ AZURE GOLD THEME - MASTER JS =====
const BRZTheme = {
    
    // ===== CONFIGURATION =====
    config: {
        whatsappNumber: '6282312290956',
        adminName: 'Admin BRZ WIFI',
        responseTime: '< 5 menit',
        animationDuration: 300,
        scrollOffset: 100,
        breakpoints: {
            mobile: 576,
            tablet: 768,
            desktop: 992,
            wide: 1200
        }
    },

    // ===== INITIALIZE ALL FUNCTIONS =====
    init: function() {
        console.log('🚀 BRZ Azure Gold Theme initialized');
        this.initializeAnimations();
        this.initializeCounters();
        this.initializeSmoothScroll();
        this.initializeTooltips();
        this.initializeWhatsAppButtons();
        this.initializeNavbar();
        this.initializeFadeInElements();
        this.initializePackageHover();
        this.initializeBackToTop();
        this.initializeFormValidation();
        this.initializeLazyLoading();
    },

    // ===== 1. ANIMATIONS =====
    initializeAnimations: function() {
        // Floating animation for hero icons
        const heroIcons = document.querySelectorAll('.hero-icon, .hero-pricing-icon, .hero-icon-brz');
        heroIcons.forEach(icon => {
            icon.classList.add('animate-float');
        });

        // Pulse animation for badges
        const badges = document.querySelectorAll('.badge-brz-premium, .welcome-badge, [class*="badge-"].animate-pulse');
        badges.forEach(badge => {
            badge.classList.add('animate-pulse');
        });

        // Shine animation for premium cards
        const premiumCards = document.querySelectorAll('.card-brz-premium, .package-card.popular');
        premiumCards.forEach(card => {
            card.classList.add('animate-shine');
        });
    },

    // ===== 2. COUNTER ANIMATION =====
    initializeCounters: function() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value + (element.dataset.suffix || '');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    element.textContent = end + (element.dataset.suffix || '');
                }
            };
            window.requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const endValue = parseInt(counter.textContent.replace(/[^0-9]/g, '')) || 0;
                    const suffix = counter.textContent.replace(/[0-9]/g, '');
                    counter.dataset.suffix = suffix;
                    
                    if (!counter.classList.contains('counted')) {
                        animateCounter(counter, 0, endValue, 1500);
                        counter.classList.add('counted');
                    }
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    },

    // ===== 3. SMOOTH SCROLL =====
    initializeSmoothScroll: function() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    },

    // ===== 4. BOOTSTRAP TOOLTIPS =====
    initializeTooltips: function() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }
    },

    // ===== 5. WHATSAPP BUTTON ENHANCEMENT =====
    initializeWhatsAppButtons: function() {
        const waButtons = document.querySelectorAll('.btn-brz-wa, .btn-package, a[href*="wa.me"]');
        
        waButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.includes('wa.me')) {
                    // Track click (analytics)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click_whatsapp', {
                            'event_category': 'engagement',
                            'event_label': this.innerText.trim()
                        });
                    }
                    
                    // Optional: show popup confirmation
                    if (window.innerWidth <= 768) {
                        // Mobile - langsung buka WA
                        return true;
                    }
                }
            });
        });
    },

    // ===== 6. NAVBAR SCROLL EFFECT =====
    initializeNavbar: function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('navbar-scrolled');
                    navbar.style.boxShadow = 'var(--shadow-md)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.classList.remove('navbar-scrolled');
                    navbar.style.boxShadow = 'none';
                    navbar.style.backdropFilter = 'none';
                }
            });
        }
    },

    // ===== 7. FADE-IN ON SCROLL =====
    initializeFadeInElements: function() {
        const fadeElements = document.querySelectorAll('.animate-fade-in:not(.fade-in-done)');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-done');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(el);
        });
    },

    // ===== 8. PACKAGE CARD HOVER EFFECT =====
    initializePackageHover: function() {
        const packageCards = document.querySelectorAll('.package-card, .menu-card, .pricing-card');
        
        packageCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.package-icon, .menu-card-icon, i.bi-wifi, i.bi-router-fill');
                if (icon) {
                    icon.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.package-icon, .menu-card-icon, i.bi-wifi, i.bi-router-fill');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    },

    // ===== 9. BACK TO TOP BUTTON =====
    initializeBackToTop: function() {
        // Create back to top button if not exists
        if (!document.querySelector('.back-to-top')) {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--gradient-azure);
                color: white;
                border: none;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: var(--shadow-azure);
                transition: all 0.3s ease;
                z-index: 9999;
            `;
            
            backToTopBtn.addEventListener('mouseenter', function() {
                this.style.background = 'var(--gradient-gold)';
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow-gold-hover)';
            });
            
            backToTopBtn.addEventListener('mouseleave', function() {
                this.style.background = 'var(--gradient-azure)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-azure)';
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(backToTopBtn);
        }

        const backToTop = document.querySelector('.back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.display = 'flex';
                backToTop.style.animation = 'fadeIn 0.3s ease';
            } else {
                backToTop.style.display = 'none';
            }
        });
    },

    // ===== 10. FORM VALIDATION =====
    initializeFormValidation: function() {
        const forms = document.querySelectorAll('.needs-validation');
        
        forms.forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });

        // Phone number validation for WhatsApp
        const phoneInputs = document.querySelectorAll('input[type="tel"], .phone-number');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9+]/g, '');
            });
        });
    },

    // ===== 11. LAZY LOADING IMAGES =====
    initializeLazyLoading: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    },

    // ===== 12. COPY TO CLIPBOARD =====
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Berhasil disalin!', 'success');
        }).catch(() => {
            this.showToast('Gagal menyalin', 'error');
        });
    },

    // ===== 13. SHOW TOAST NOTIFICATION =====
    showToast: function(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || (() => {
            const container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
            `;
            document.body.appendChild(container);
            return container;
        })();

        const toast = document.createElement('div');
        toast.className = `toast-brz toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'info-circle-fill'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        toast.style.cssText = `
            background: ${type === 'success' ? 'var(--brz-success)' : 'var(--brz-azure)'};
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            margin-top: 10px;
            box-shadow: var(--shadow-md);
            animation: slideIn 0.3s ease;
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ===== 14. PRICE CALCULATOR =====
    calculatePrice: function(basePrice, months = 1) {
        const discount = months >= 12 ? 0.1 : months >= 6 ? 0.05 : 0;
        const total = basePrice * months * (1 - discount);
        const monthly = total / months;
        
        return {
            total: Math.round(total),
            monthly: Math.round(monthly),
            discount: discount * 100,
            months: months
        };
    },

    // ===== 15. DETECT MOBILE DEVICE =====
    isMobileDevice: function() {
        return (window.innerWidth <= 768) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    },

    // ===== 16. FORMAT CURRENCY =====
    formatCurrency: function(amount) {
        return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    // ===== 17. GET URL PARAMETERS =====
    getUrlParameter: function(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    // ===== 18. WHATSAPP LINK GENERATOR =====
    generateWhatsAppLink: function(packageName = '', price = '') {
        let message = `Halo Admin BRZ WIFI, saya ingin bertanya tentang layanan internet.`;
        
        if (packageName) {
            message = `Halo Admin BRZ WIFI, saya ingin pasang paket ${packageName} ${price ? 'Rp ' + price : ''}.`;
        }
        
        return `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    },

    // ===== 19. PRINT PAGE =====
    printPage: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(element.innerHTML);
            printWindow.document.close();
            printWindow.print();
        }
    },

    // ===== 20. DARK MODE TOGGLE (OPTIONAL) =====
    toggleDarkMode: function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('brz-dark-mode', isDark);
        
        this.showToast(
            isDark ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan',
            'info'
        );
    }
};

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    BRZTheme.init();
});

// ===== RE-INITIALIZE ON PAGE CHANGE (for SPA) =====
document.addEventListener('page:loaded', function() {
    BRZTheme.init();
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BRZTheme;
}

// ===== ADDITIONAL CSS FOR JS COMPONENTS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .back-to-top:hover {
        background: var(--gradient-gold) !important;
        transform: translateY(-5px) scale(1.1);
    }
    
    .toast-brz {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 250px;
        max-width: 350px;
    }
    
    .toast-brz .toast-content {
        display: flex;
        align-items: center;
        width: 100%;
    }
    
    .navbar-scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .dark-mode {
        filter: invert(1) hue-rotate(180deg);
    }
    
    .dark-mode img {
        filter: invert(1) hue-rotate(180deg);
    }
`;

document.head.appendChild(style);

console.log('📦 BRZ Azure Gold JS v1.0 loaded successfully');