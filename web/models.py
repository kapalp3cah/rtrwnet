from django.db import models
from django.contrib.auth.models import User


class Gangguan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    nama = models.CharField(max_length=100)
    alamat = models.TextField()
    no_wa = models.CharField(max_length=20)
    keluhan = models.TextField()

    tanggal = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Progress', 'Progress'),
        ('Done', 'Done'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')

    def __str__(self):
        return f"{self.nama} - {self.status}"


class Pembayaran(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    nama = models.CharField(max_length=100)
    no_wa = models.CharField(max_length=20)
    bulan_tagihan = models.CharField(max_length=50)
    bukti_transfer = models.ImageField(upload_to='bukti/')

    tanggal = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Verified', 'Verified'),
        ('Rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.nama} - {self.status}"

class Pelanggan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username_radius = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)
    profile = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    whatsapp = models.CharField(max_length=20)
    invoice_status = models.CharField(max_length=20)
    active_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username_radius

class Radboox(models.Model):
    # Sesuaikan dengan struktur CSV
    no = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    profile = models.CharField(max_length=100)
    nas = models.CharField(max_length=100, blank=True, null=True)
    service = models.CharField(max_length=50, blank=True, null=True)
    ip = models.GenericIPAddressField(blank=True, null=True)
    name = models.CharField(max_length=200)  # Nama lengkap
    phone = models.CharField(max_length=20)   # No telepon
    address = models.TextField(blank=True, null=True)  # Alamat
    
    # Tambahan field untuk tracking
    imported_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Aktif')
    
    class Meta:
        verbose_name = "Data Radboox"
        verbose_name_plural = "Data Radboox"
    
    def __str__(self):
        return f"{self.username} - {self.name}"