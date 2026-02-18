from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User
from datetime import datetime
import pandas as pd

import io
import chardet
import csv
from .forms import CSVUploadForm
from .models import Radboox
from django.http import HttpResponse
import os
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required


from .forms import GangguanForm, PembayaranForm
from .models import Gangguan, Pembayaran, Pelanggan


# ======================
# PUBLIC AREA
# ======================

@login_required
def pelanggan(request):
    # Hanya user yang login bisa akses
    return render(request, 'web/pelanggan.html')

@login_required
def import_radboox(request):
    # Hanya admin yang bisa akses
    if not request.user.is_staff:
        return redirect('home')
    

def home(request):
    return render(request, 'web/home.html')


def pricing(request):
    return render(request, 'web/pricing.html')


# ======================
# CUSTOMER AREA (LOGIN REQUIRED)
# ======================

@login_required
def pelanggan(request):
    gangguan_list = Gangguan.objects.filter(user=request.user).order_by('-tanggal')
    pembayaran_list = Pembayaran.objects.filter(user=request.user).order_by('-tanggal')

    context = {
        'total_gangguan': gangguan_list.count(),
        'total_pembayaran': pembayaran_list.count(),
        'gangguan_terakhir': gangguan_list.first(),
        'pembayaran_terakhir': pembayaran_list.first(),
    }

    return render(request, 'web/pelanggan.html', context)


@login_required
def gangguan(request):
    if request.method == 'POST':
        form = GangguanForm(request.POST)
        if form.is_valid():
            gangguan = form.save(commit=False)
            gangguan.user = request.user
            gangguan.save()
            return redirect('gangguan')
    else:
        form = GangguanForm()

    return render(request, 'web/gangguan.html', {'form': form})


@login_required
def bayar(request):
    if request.method == 'POST':
        form = PembayaranForm(request.POST, request.FILES)
        if form.is_valid():
            pembayaran = form.save(commit=False)
            pembayaran.user = request.user
            pembayaran.save()
            return redirect('bayar')
    else:
        form = PembayaranForm()

    return render(request, 'web/bayar.html', {'form': form})


# ======================
# ADMIN AREA
# ======================

def is_admin(user):
    return user.is_superuser


def import_radboox(request):
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['file']
            
            # Validasi ekstensi file
            if not csv_file.name.endswith('.csv'):
                messages.error(request, 'File harus berformat CSV!')
                return redirect('import_radboox')
            
            # Validasi ukuran file (max 5MB)
            if csv_file.size > 5 * 1024 * 1024:
                messages.error(request, 'Ukuran file maksimal 5MB!')
                return redirect('import_radboox')
            
            try:
                # Baca file dengan berbagai encoding
                raw_data = csv_file.read()
                decoded_file = None
                
                for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
                    try:
                        decoded_file = raw_data.decode(encoding)
                        print(f"✅ Decode dengan encoding: {encoding}")
                        break
                    except UnicodeDecodeError:
                        continue
                
                if decoded_file is None:
                    messages.error(request, '❌ Gagal membaca file. Encoding tidak dikenal!')
                    return redirect('import_radboox')
                
                # Hapus BOM jika ada
                if decoded_file.startswith('\ufeff'):
                    decoded_file = decoded_file[1:]
                
                io_string = io.StringIO(decoded_file)
                reader = csv.DictReader(io_string)  # Gunakan DictReader untuk membaca header
                
                # Tampilkan header untuk debugging
                print("Header CSV:", reader.fieldnames)
                
                success_count = 0
                error_count = 0
                errors = []
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        # Validasi data penting
                        if not row.get('username'):
                            errors.append(f"Baris {row_num}: Username tidak boleh kosong")
                            error_count += 1
                            continue
                        
                        # Cek apakah username sudah ada
                        if Radboox.objects.filter(username=row['username']).exists():
                            errors.append(f"Baris {row_num}: Username '{row['username']}' sudah ada")
                            error_count += 1
                            continue
                        
                        # Buat objek Radboox sesuai struktur CSV
                        radboox = Radboox(
                            no=row.get('no') if row.get('no') else None,
                            username=row['username'],
                            password=row.get('password', ''),
                            profile=row.get('profile', ''),
                            nas=row.get('nas', ''),
                            service=row.get('service', ''),
                            ip=row.get('ip', ''),
                            name=row.get('name', row['username']),  # Gunakan username jika name kosong
                            phone=row.get('phone', ''),
                            address=row.get('address', ''),
                            status='Aktif'
                        )
                        radboox.save()
                        success_count += 1
                        
                    except Exception as e:
                        errors.append(f"Baris {row_num}: {str(e)}")
                        error_count += 1
                        continue
                
                # Tampilkan pesan hasil import
                if success_count > 0:
                    messages.success(
                        request, 
                        f'✅ Berhasil mengimport {success_count} data Radboox!'
                    )
                
                if error_count > 0:
                    error_msg = f'⚠️ Gagal mengimport {error_count} data.'
                    if errors:
                        error_msg += f' Error pertama: {errors[0]}'
                    messages.warning(request, error_msg)
                
                # Log errors ke console
                if errors:
                    print("\n".join(errors[:10]))
                
            except Exception as e:
                messages.error(request, f'❌ Terjadi kesalahan: {str(e)}')
                print(f"Error detail: {str(e)}")
                
            return redirect('import_radboox')
    else:
        form = CSVUploadForm()
    
    # Hitung statistik untuk ditampilkan di template
    context = {
        'form': form,
        'page_title': 'Import Data Radboox',
        'total_data': Radboox.objects.count(),
        'header_format': ['no', 'username', 'password', 'profile', 'nas', 'service', 'ip', 'name', 'phone', 'address'],
    }
    return render(request, 'web/import_radboox.html', context)


# pembayaran
def pembayaran(request):
    """Halaman informasi pembayaran"""
    return render(request, 'web/pembayaran.html')

# ======================
# Upload CSV
# ======================

def download_template(request):
    """Download template CSV untuk import data Radboox"""
    
    # Buat response HTTP dengan content-type CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="template_radboox.csv"'
    
    # Buat writer CSV
    writer = csv.writer(response)
    
    # Tulis header sesuai format CSV Anda
    writer.writerow(['no', 'username', 'password', 'profile', 'nas', 'service', 'ip', 'name', 'phone', 'address'])
    
    # Tulis contoh data (opsional)
    writer.writerow([1, 'user001', 'pass123', '20Mbps', 'router1', 'pppoe', '192.168.1.100', 'John Doe', '08123456789', 'Jl. Merdeka No.1'])
    writer.writerow([2, 'user002', 'pass456', '30Mbps', 'router1', 'pppoe', '192.168.1.101', 'Jane Smith', '08129876543', 'Jl. Sudirman No.2'])
    writer.writerow([3, 'user003', 'pass789', '50Mbps', 'router2', 'pppoe', '192.168.1.102', 'Bob Johnson', '08125556677', 'Jl. Gatot Subroto No.3'])
    
    return response

# ========================
# Export CSV
# ========================

@staff_member_required  # Hanya admin yang bisa export
def export_radboox_csv(request):
    """Export semua data Radboox ke file CSV"""
    
    # Buat response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="radboox_export_{}.csv"'.format(
        datetime.now().strftime('%Y%m%d_%H%M%S')
    )
    
    # Buat writer
    writer = csv.writer(response)
    
    # Tulis header
    writer.writerow(['No', 'Username', 'Password', 'Profile', 'NAS', 'Service', 'IP', 'Nama', 'Telepon', 'Alamat', 'Status', 'Tanggal Import'])
    
    # Tulis data
    for i, data in enumerate(Radboox.objects.all(), 1):
        writer.writerow([
            i,
            data.username,
            data.password,
            data.profile,
            data.nas,
            data.service,
            data.ip,
            data.name,
            data.phone,
            data.address,
            data.status,
            data.imported_at.strftime('%Y-%m-%d %H:%M:%S') if data.imported_at else ''
        ])
    
    return response


