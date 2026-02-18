from django.db import models
from django.contrib.auth.models import User

class Gangguan(models.Model):
    """Model untuk laporan gangguan pelanggan"""
    
    STATUS_CHOICES = [
        ('pending', 'Menunggu'),
        ('proses', 'Diproses'),
        ('selesai', 'Selesai'),
        ('ditolak', 'Ditolak'),
    ]
    
    KATEGORI_CHOICES = [
        ('jaringan', 'Jaringan'),
        ('perangkat', 'Perangkat'),
        ('tagihan', 'Tagihan'),
        ('lainnya', 'Lainnya'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gangguan')
    judul = models.CharField(max_length=200, verbose_name='Judul Laporan')
    deskripsi = models.TextField(verbose_name='Deskripsi Gangguan')
    kategori = models.CharField(max_length=50, choices=KATEGORI_CHOICES, default='jaringan', verbose_name='Kategori')
    tanggal = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal Laporan')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Status')
    
    class Meta:
        ordering = ['-tanggal']
        verbose_name = 'Gangguan'
        verbose_name_plural = 'Gangguan'
    
    def __str__(self):
        return f"{self.user.username} - {self.judul}"


class Pembayaran(models.Model):
    """Model untuk pembayaran pelanggan"""
    
    STATUS_CHOICES = [
        ('menunggu', 'Menunggu Konfirmasi'),
        ('diterima', 'Diterima'),
        ('ditolak', 'Ditolak'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pembayaran')
    nama = models.CharField(max_length=100, verbose_name='Nama Lengkap')
    no_wa = models.CharField(max_length=20, verbose_name='Nomor WhatsApp')
    bulan_tagihan = models.CharField(max_length=20, verbose_name='Bulan Tagihan')
    bukti_transfer = models.FileField(upload_to='bukti_bayar/', verbose_name='Bukti Transfer')
    tanggal = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal Upload')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='menunggu', verbose_name='Status')
    catatan = models.TextField(blank=True, null=True, verbose_name='Catatan Admin')
    
    class Meta:
        ordering = ['-tanggal']
        verbose_name = 'Pembayaran'
        verbose_name_plural = 'Pembayaran'
    
    def __str__(self):
        return f"{self.nama} - {self.bulan_tagihan}"


class Radboox(models.Model):
    """Model untuk data Radboox dari CSV"""
    
    no = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    profile = models.CharField(max_length=100, blank=True, null=True)
    nas = models.CharField(max_length=100, blank=True, null=True)
    service = models.CharField(max_length=50, blank=True, null=True)
    ip = models.GenericIPAddressField(blank=True, null=True)
    name = models.CharField(max_length=200, verbose_name='Nama Lengkap')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='No Telepon')
    address = models.TextField(blank=True, null=True, verbose_name='Alamat')
    
    # Field tambahan
    imported_at = models.DateTimeField(auto_now_add=True, verbose_name='Tanggal Import')
    status = models.CharField(max_length=20, default='Aktif', verbose_name='Status')
    
    class Meta:
        verbose_name = "Data Radboox"
        verbose_name_plural = "Data Radboox"
        ordering = ['-imported_at']
    
    def __str__(self):
        return f"{self.username} - {self.name}"