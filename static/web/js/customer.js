/* ======================================== */
/*  CUSTOMER DASHBOARD - BRZ AZURE GOLD     */
/*  Blue Router Zone - Halaman Pelanggan    */
/*  JavaScript Interactions & API Calls     */
/* ======================================== */

// ===== CUSTOMER DASHBOARD MODULE =====
const BRZCustomer = {
    
    // ===== CONFIGURATION =====
    config: {
        apiEndpoint: '/api/customer/',
        refreshInterval: 30000, // 30 detik
        whatsappNumber: '6282312290956',
        toastDuration: 3000,
        animationDuration: 300
    },

    // ===== INITIALIZE DASHBOARD =====
    init: function() {
        console.log('👤 BRZ Customer Dashboard initialized');
        this.loadCustomerData();
        this.initializeEventListeners();
        this.initializeAutoRefresh();
        this.initializeCharts();
        this.initializePaymentReminder();
        this.initializeNotificationSystem();
        this.initializeQuickActions();
        this.initializeDataExport();
    },

    // ===== LOAD CUSTOMER DATA VIA API =====
    loadCustomerData: function() {
        // Simulasi load data - ganti dengan API call sesungguhnya
        this.fetchCustomerSummary();
        this.fetchRecentTickets();
        this.fetchPaymentHistory();
        this.fetchActivePackage();
    },

    fetchCustomerSummary: function() {
        // Example API call
        fetch(`${this.config.apiEndpoint}summary/`)
            .then(response => response.json())
            .then(data => {
                this.updateDashboardSummary(data);
            })
            .catch(error => {
                console.error('Error loading customer summary:', error);
                this.showToast('Gagal memuat data', 'error');
            });
    },

    fetchRecentTickets: function() {
        fetch(`${this.config.apiEndpoint}tickets/recent/`)
            .then(response => response.json())
            .then(data => {
                this.updateTicketList(data);
            })
            .catch(error => console.error('Error loading tickets:', error));
    },

    fetchPaymentHistory: function() {
        fetch(`${this.config.apiEndpoint}payments/recent/`)
            .then(response => response.json())
            .then(data => {
                this.updatePaymentList(data);
            })
            .catch(error => console.error('Error loading payments:', error));
    },

    fetchActivePackage: function() {
        fetch(`${this.config.apiEndpoint}package/active/`)
            .then(response => response.json())
            .then(data => {
                this.updatePackageInfo(data);
            })
            .catch(error => console.error('Error loading package:', error));
    },

    // ===== UPDATE UI =====
    updateDashboardSummary: function(data) {
        // Update statistik cards
        const gangguanEl = document.getElementById('total-gangguan');
        const pembayaranEl = document.getElementById('total-pembayaran');
        
        if (gangguanEl) {
            this.animateNumber(gangguanEl, parseInt(gangguanEl.textContent) || 0, data.total_gangguan || 0);
        }
        
        if (pembayaranEl) {
            this.animateNumber(pembayaranEl, parseInt(pembayaranEl.textContent) || 0, data.total_pembayaran || 0);
        }
    },

    updatePackageInfo: function(data) {
        const packageNameEl = document.getElementById('package-name');
        const packageSpeedEl = document.getElementById('package-speed');
        const packagePriceEl = document.getElementById('package-price');
        const dueDateEl = document.getElementById('due-date');
        const installDateEl = document.getElementById('install-date');
        
        if (packageNameEl) packageNameEl.textContent = data.nama || 'BRZ WIFI 20 Mbps';
        if (packageSpeedEl) packageSpeedEl.textContent = data.kecepatan || '20 Mbps';
        if (packagePriceEl) packagePriceEl.textContent = this.formatCurrency(data.harga || 205000);
        if (dueDateEl) dueDateEl.textContent = data.tagihan_bulan || '25 Februari 2025';
        if (installDateEl) installDateEl.textContent = data.tanggal_pasang || '15 Januari 2025';
    },

    updateTicketList: function(tickets) {
        const container = document.getElementById('recent-tickets-list');
        if (!container) return;

        if (tickets && tickets.length > 0) {
            let html = '';
            tickets.slice(0, 3).forEach(ticket => {
                html += `
                    <div class="list-group-item-customer">
                        <div>
                            <small class="text-muted">${this.formatDate(ticket.tanggal)}</small>
                            <div class="fw-bold">${this.truncateText(ticket.deskripsi, 50)}</div>
                        </div>
                        <span class="status-badge-customer status-${ticket.status.toLowerCase()}">
                            ${ticket.status}
                        </span>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = `
                <div class="empty-state-customer">
                    <i class="bi bi-check2-circle"></i>
                    <p>Tidak ada riwayat gangguan</p>
                </div>
            `;
        }
    },

    updatePaymentList: function(payments) {
        const container = document.getElementById('recent-payments-list');
        if (!container) return;

        if (payments && payments.length > 0) {
            let html = '';
            payments.slice(0, 3).forEach(payment => {
                html += `
                    <div class="list-group-item-customer">
                        <div>
                            <small class="text-muted">${this.formatDate(payment.tanggal)}</small>
                            <div class="fw-bold">${this.formatCurrency(payment.jumlah)}</div>
                        </div>
                        <span class="status-badge-customer status-${payment.status.toLowerCase()}">
                            ${payment.status}
                        </span>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = `
                <div class="empty-state-customer">
                    <i class="bi bi-wallet2"></i>
                    <p>Belum ada riwayat pembayaran</p>
                </div>
            `;
        }
    },

    // ===== EVENT LISTENERS =====
    initializeEventListeners: function() {
        // Report issue button
        const reportBtn = document.getElementById('btn-report-issue');
        if (reportBtn) {
            reportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openReportModal();
            });
        }

        // Upload payment button
        const uploadBtn = document.getElementById('btn-upload-payment');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openUploadModal();
            });
        }

        // Chat admin button
        const chatBtn = document.getElementById('btn-chat-admin');
        if (chatBtn) {
            chatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        }

        // Copy account number
        const copyBtns = document.querySelectorAll('.btn-copy');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = btn.dataset.copy || btn.textContent;
                this.copyToClipboard(text);
            });
        });

        // Refresh data
        const refreshBtn = document.getElementById('btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadCustomerData();
                this.showToast('Data diperbarui', 'success');
            });
        }
    },

    // ===== AUTO REFRESH =====
    initializeAutoRefresh: function() {
        setInterval(() => {
            // Only refresh if page is visible
            if (!document.hidden) {
                this.loadCustomerData();
            }
        }, this.config.refreshInterval);
    },

    // ===== CHARTS INITIALIZATION =====
    initializeCharts: function() {
        // Example: Payment history chart
        const chartCanvas = document.getElementById('payment-chart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            fetch(`${this.config.apiEndpoint}payments/history/`)
                .then(response => response.json())
                .then(data => {
                    new Chart(chartCanvas, {
                        type: 'line',
                        data: {
                            labels: data.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                            datasets: [{
                                label: 'Pembayaran',
                                data: data.values || [205, 205, 205, 410, 205, 205],
                                borderColor: '#00cfff',
                                backgroundColor: 'rgba(0,207,255,0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });
                });
        }
    },

    // ===== PAYMENT REMINDER =====
    initializePaymentReminder: function() {
        const dueDateEl = document.getElementById('due-date');
        if (dueDateEl) {
            const dueDate = new Date(dueDateEl.textContent);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            if (daysLeft <= 3 && daysLeft > 0) {
                this.showToast(`Tagihan jatuh tempo dalam ${daysLeft} hari`, 'warning');
                
                // Add reminder badge
                const reminderEl = document.createElement('span');
                reminderEl.className = 'badge-brz badge-brz-gold pulse-customer ms-2';
                reminderEl.innerHTML = `<i class="bi bi-bell-fill"></i> Sisa ${daysLeft} hari`;
                dueDateEl.parentNode.appendChild(reminderEl);
            } else if (daysLeft <= 0) {
                this.showToast('Tagihan sudah melewati jatuh tempo!', 'error');
            }
        }
    },

    // ===== NOTIFICATION SYSTEM =====
    initializeNotificationSystem: function() {
        // Check for new notifications
        fetch(`${this.config.apiEndpoint}notifications/unread/`)
            .then(response => response.json())
            .then(data => {
                if (data.count > 0) {
                    this.showNotificationBadge(data.count);
                    
                    if (data.notifications) {
                        data.notifications.forEach(notif => {
                            this.showToast(notif.message, 'info');
                        });
                    }
                }
            })
            .catch(error => console.error('Error loading notifications:', error));
    },

    showNotificationBadge: function(count) {
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = count;
        
        const notificationIcon = document.querySelector('.notification-icon');
        if (notificationIcon) {
            notificationIcon.appendChild(badge);
        }
    },

    // ===== QUICK ACTIONS =====
    initializeQuickActions: function() {
        // Speed test
        const speedTestBtn = document.getElementById('btn-speed-test');
        if (speedTestBtn) {
            speedTestBtn.addEventListener('click', () => {
                this.runSpeedTest();
            });
        }

        // Check bill
        const checkBillBtn = document.getElementById('btn-check-bill');
        if (checkBillBtn) {
            checkBillBtn.addEventListener('click', () => {
                this.showBillDetails();
            });
        }

        // View invoice
        const invoiceBtn = document.getElementById('btn-invoice');
        if (invoiceBtn) {
            invoiceBtn.addEventListener('click', () => {
                this.generateInvoice();
            });
        }
    },

    runSpeedTest: function() {
        this.showToast('Memulai tes kecepatan...', 'info');
        
        // Simulate speed test
        setTimeout(() => {
            const speed = Math.floor(Math.random() * 30) + 10;
            this.showToast(`Kecepatan internet Anda: ${speed} Mbps`, 'success');
        }, 3000);
    },

    showBillDetails: function() {
        const modal = document.getElementById('bill-modal');
        if (modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        }
    },

    generateInvoice: function() {
        // Implementation for invoice generation
        window.open('/customer/invoice/', '_blank');
    },

    // ===== MODAL HANDLERS =====
    openReportModal: function() {
        const modal = document.getElementById('report-modal');
        if (modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Redirect to report page
            window.location.href = '/gangguan/';
        }
    },

    openUploadModal: function() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Redirect to upload page
            window.location.href = '/bayar/';
        }
    },

    // ===== WHATSAPP INTEGRATION =====
    openWhatsApp: function(message = '') {
        let text = 'Halo Admin BRZ WIFI, saya ingin bertanya tentang layanan internet saya.';
        if (message) {
            text = message;
        }
        
        const url = `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    },

    // ===== DATA EXPORT =====
    initializeDataExport: function() {
        const exportBtn = document.getElementById('btn-export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCustomerData();
            });
        }
    },

    exportCustomerData: function() {
        const data = {
            summary: {
                total_gangguan: document.getElementById('total-gangguan')?.textContent || '0',
                total_pembayaran: document.getElementById('total-pembayaran')?.textContent || '0'
            },
            package: {
                name: document.getElementById('package-name')?.textContent || 'BRZ WIFI',
                speed: document.getElementById('package-speed')?.textContent || '20 Mbps',
                price: document.getElementById('package-price')?.textContent || 'Rp 205.000'
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brz-customer-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showToast('Data berhasil diekspor', 'success');
    },

    // ===== UTILITY FUNCTIONS =====
    formatCurrency: function(amount) {
        return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    truncateText: function(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    animateNumber: function(element, start, end, duration = 1000) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    },

    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Berhasil disalin!', 'success');
        }).catch(() => {
            this.showToast('Gagal menyalin', 'error');
        });
    },

    showToast: function(message, type = 'info') {
        if (typeof BRZTheme !== 'undefined' && BRZTheme.showToast) {
            BRZTheme.showToast(message, type);
        } else {
            // Fallback alert
            alert(message);
        }
    },

    // ===== VALIDATION =====
    validatePaymentAmount: function(amount) {
        const minPayment = 10000;
        const maxPayment = 1000000;
        
        if (amount < minPayment) {
            return { valid: false, message: `Minimal pembayaran ${this.formatCurrency(minPayment)}` };
        }
        if (amount > maxPayment) {
            return { valid: false, message: `Maksimal pembayaran ${this.formatCurrency(maxPayment)}` };
        }
        return { valid: true, message: '' };
    },

    validateReportDescription: function(description) {
        if (!description || description.trim() === '') {
            return { valid: false, message: 'Deskripsi gangguan tidak boleh kosong' };
        }
        if (description.length < 10) {
            return { valid: false, message: 'Deskripsi minimal 10 karakter' };
        }
        if (description.length > 500) {
            return { valid: false, message: 'Deskripsi maksimal 500 karakter' };
        }
        return { valid: true, message: '' };
    }
};

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on customer dashboard page
    if (document.querySelector('.dashboard-header')) {
        BRZCustomer.init();
    }
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BRZCustomer;
}

console.log('👤 BRZ Customer Dashboard JS v1.0 loaded');