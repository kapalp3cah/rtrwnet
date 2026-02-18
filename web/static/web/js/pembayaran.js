/* ======================================== */
/*  PEMBAYARAN PAGE - BRZ AZURE GOLD THEME */
/* ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== COPY TO CLIPBOARD FUNCTION =====
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(function() {
            showToast('Nomor berhasil disalin!', 'success');
            
            // Change button icon temporarily
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check-lg"></i>';
            
            setTimeout(function() {
                button.innerHTML = originalIcon;
            }, 2000);
            
        }).catch(function(err) {
            showToast('Gagal menyalin nomor', 'error');
        });
    }
    
    // ===== SHOW TOAST NOTIFICATION =====
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
        toast.innerHTML = `
            <i class="bi ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // ===== COPY BUTTON HANDLERS (Bank) =====
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const accountNumber = this.dataset.copy || this.closest('.bank-account').querySelector('.account-number').textContent.trim();
            copyToClipboard(accountNumber, this);
        });
    });
    
    // ===== E-WALLET COPY HANDLERS =====
    const ewalletItems = document.querySelectorAll('.ewallet-item');
    ewalletItems.forEach(item => {
        item.addEventListener('click', function() {
            const number = this.dataset.copy || this.querySelector('p').textContent.trim();
            copyToClipboard(number, this);
            
            // Visual feedback
            this.style.backgroundColor = '#e8f4ff';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
        });
    });
    
    // ===== ANIMATE ON SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.payment-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});