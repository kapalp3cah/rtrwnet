# web/admin.py
from django.contrib import admin
from .models import Radboox, Gangguan, Pembayaran

@admin.register(Radboox)
class RadbooxAdmin(admin.ModelAdmin):
    list_display = ['username', 'name', 'profile', 'phone', 'status']
    search_fields = ['username', 'name']

@admin.register(Gangguan)
class GangguanAdmin(admin.ModelAdmin):
    list_display = ['user', 'judul', 'tanggal', 'status']
    list_filter = ['status', 'kategori']

@admin.register(Pembayaran)
class PembayaranAdmin(admin.ModelAdmin):
    list_display = ['nama', 'bulan_tagihan', 'tanggal', 'status']
    list_filter = ['status']