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
