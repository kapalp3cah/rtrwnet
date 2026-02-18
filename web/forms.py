from django import forms
from .models import Gangguan, Pembayaran


# ======================
# CUSTOMER FORMS
# ======================

class GangguanForm(forms.ModelForm):
    """Form untuk laporan gangguan pelanggan"""
    
    class Meta:
        model = Gangguan
        fields = ['judul', 'deskripsi', 'kategori']  # ← Sesuai dengan model
        widgets = {
            'judul': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Contoh: Jaringan lambat, Tidak bisa connect, dll'
            }),
            'deskripsi': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Jelaskan detail gangguan yang Anda alami...'
            }),
            'kategori': forms.Select(attrs={
                'class': 'form-control'
            }),
        }
        labels = {
            'judul': 'Judul Laporan',
            'deskripsi': 'Deskripsi Gangguan',
            'kategori': 'Kategori Gangguan',
        }
        help_texts = {
            'judul': 'Buat judul yang singkat dan jelas',
            'deskripsi': 'Sertakan detail seperti sejak kapan, error apa yang muncul, dll',
        }


class PembayaranForm(forms.ModelForm):
    """Form untuk upload bukti pembayaran"""
    
    class Meta:
        model = Pembayaran
        fields = ['nama', 'no_wa', 'bulan_tagihan', 'bukti_transfer']
        widgets = {
            'nama': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Masukkan nama lengkap'
            }),
            'no_wa': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Contoh: 081234567890'
            }),
            'bulan_tagihan': forms.Select(attrs={
                'class': 'form-control'
            }),
            'bukti_transfer': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*,.pdf',
                'required': True
            }),
        }
        labels = {
            'nama': 'Nama Lengkap',
            'no_wa': 'Nomor WhatsApp',
            'bulan_tagihan': 'Bulan Tagihan',
            'bukti_transfer': 'Upload Bukti Transfer',
        }
        help_texts = {
            'no_wa': 'Nomor WhatsApp yang aktif untuk konfirmasi',
            'bukti_transfer': 'Format: JPG, PNG, atau PDF (max 2MB)',
        }


# ======================
# ADMIN FORMS (IMPORT/EXPORT)
# ======================

class CSVUploadForm(forms.Form):
    """Form untuk upload file CSV (khusus admin)"""
    
    file = forms.FileField(
        label='Pilih File CSV',
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': '.csv',
            'id': 'csv_file'
        }),
        help_text='Format: CSV dengan header: no,username,password,profile,nas,service,ip,name,phone,address'
    )