/* ======================================== */
/*  PEMBAYARAN PAGE - BRZ AZURE GOLD THEME */
/*  Digabung dari kedua versi              */
/* ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== COPY TO CLIPBOARD FUNCTION (DARI KODE LAMA) =====
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(function() {
            // Gunakan custom toast dari kode lama (lebih fleksibel)
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
    
    // ===== SHOW TOAST NOTIFICATION (DARI KODE LAMA) =====
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
    
    // ===== COPY BUTTON HANDLERS (GABUNGKAN DUA SELECTOR) =====
    
    // Handler untuk .btn-copy (dari kode lama - untuk bank)
    const bankCopyButtons = document.querySelectorAll('.btn-copy');
    bankCopyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Cari nomor rekening
            let accountNumber = this.dataset.copy;
            if (!accountNumber) {
                const accountElement = this.closest('.bank-account')?.querySelector('.account-number');
                accountNumber = accountElement ? accountElement.textContent.trim() : null;
            }
            if (accountNumber) {
                copyToClipboard(accountNumber, this);
            }
        });
    });
    
    // Handler untuk .copy-btn (dari kode baru - untuk button salin)
    const newCopyButtons = document.querySelectorAll('.copy-btn');
    newCopyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.dataset.copy;
            if (text) {
                copyToClipboard(text, this);
            }
        });
    });
    
    // ===== E-WALLET COPY HANDLERS (DARI KODE LAMA) =====
    const ewalletItems = document.querySelectorAll('.ewallet-item');
    ewalletItems.forEach(item => {
        item.addEventListener('click', function() {
            const number = this.dataset.copy || this.querySelector('p')?.textContent.trim();
            if (number) {
                copyToClipboard(number, this);
                
                // Visual feedback
                this.style.backgroundColor = '#e8f4ff';
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 200);
            }
        });
    });
    
    // ===== FORM VALIDATION (DARI KODE BARU) =====
    function initFormValidation() {
        const uploadForm = document.querySelector('form[enctype="multipart/form-data"]');
        if (uploadForm) {
            uploadForm.addEventListener('submit', function(e) {
                const fileInput = document.querySelector('input[type="file"]');
                const namaInput = document.querySelector('input[name="nama"]');
                const waInput = document.querySelector('input[name="no_wa"]');
                
                // Validasi file size
                if (fileInput && fileInput.files.length > 0) {
                    const fileSize = fileInput.files[0].size / 1024 / 1024; // in MB
                    if (fileSize > 2) {
                        e.preventDefault();
                        showToast('Ukuran file maksimal 2MB!', 'error');
                    }
                }
                
                // Validasi nomor WhatsApp
                if (waInput && waInput.value) {
                    const waValue = waInput.value.replace(/\D/g, '');
                    if (waValue.length < 10 || waValue.length > 13) {
                        e.preventDefault();
                        showToast('Nomor WhatsApp tidak valid! (10-13 digit)', 'error');
                    }
                }
            });
        }
    }
    initFormValidation();
    
    // ===== ANIMATE ON SCROLL (GABUNGKAN DUA TARGET) =====
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
    
    // Target dari kode lama (.payment-card)
    document.querySelectorAll('.payment-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Target dari kode baru (.card)
    document.querySelectorAll('.card').forEach(el => {
        // Jangan duplikasi jika sudah diobservasi
        if (!el.classList.contains('payment-card')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        }
    });
    
    console.log('✅ Pembayaran page JS loaded (gabungan)');
    
});