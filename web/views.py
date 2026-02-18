from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime
import csv
import io
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required

from .forms import CSVUploadForm, GangguanForm, PembayaranForm  
from .models import Radboox, Gangguan  


# ======================
# PUBLIC AREA
# ======================

def home(request):
    return render(request, 'web/home.html')


def pricing(request):
    return render(request, 'web/pricing.html')


def pembayaran(request):
    """Halaman informasi metode pembayaran"""
    return render(request, 'web/pembayaran.html')


# ======================
# CUSTOMER AREA
# ======================

@login_required
def pelanggan(request):
    """Dashboard pelanggan - ringkasan gangguan"""
    gangguan_list = Gangguan.objects.filter(user=request.user).order_by('-tanggal')
    # HAPUS pembayaran_list

    context = {
        'total_gangguan': gangguan_list.count(),
        'gangguan_terakhir': gangguan_list.first(),
        'riwayat_gangguan': gangguan_list,
        # HAPUS total_pembayaran, pembayaran_terakhir, riwayat_pembayaran
    }
    return render(request, 'web/pelanggan.html', context)


@login_required
def gangguan(request):
    """Form laporan gangguan internet"""
    if request.method == 'POST':
        form = GangguanForm(request.POST)
        if form.is_valid():
            gangguan = form.save(commit=False)
            gangguan.user = request.user
            gangguan.save()
            messages.success(request, 'Laporan gangguan berhasil dikirim!')
            return redirect('pelanggan')
    else:
        form = GangguanForm()
    
    return render(request, 'web/gangguan.html', {'form': form})

def pembayaran(request):
    """Halaman informasi pembayaran + form upload bukti"""
    
    if request.method == 'POST':
        form = PembayaranForm(request.POST, request.FILES)
        if form.is_valid():
            pembayaran = form.save(commit=False)
            if request.user.is_authenticated:
                pembayaran.user = request.user
            pembayaran.save()
            messages.success(request, 'Bukti pembayaran berhasil diupload! Admin akan segera mengkonfirmasi.')
            return redirect('pembayaran')
    else:
        form = PembayaranForm()
    
    # Daftar bulan untuk dropdown
    bulan_list = [
        ('Januari 2025', 'Januari 2025'),
        ('Februari 2025', 'Februari 2025'),
        ('Maret 2025', 'Maret 2025'),
        ('April 2025', 'April 2025'),
        ('Mei 2025', 'Mei 2025'),
        ('Juni 2025', 'Juni 2025'),
        ('Juli 2025', 'Juli 2025'),
        ('Agustus 2025', 'Agustus 2025'),
        ('September 2025', 'September 2025'),
        ('Oktober 2025', 'Oktober 2025'),
        ('November 2025', 'November 2025'),
        ('Desember 2025', 'Desember 2025'),
    ]
    
    context = {
        'form': form,
        'bulan_list': bulan_list,
        'page_title': 'Pembayaran',
    }
    return render(request, 'web/pembayaran.html', context)


# ======================
# ADMIN AREA (IMPORT/EXPORT)
# ======================

@staff_member_required
def import_radboox(request):
    """Import data Radboox dari file CSV"""
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
                reader = csv.DictReader(io_string)
                
                success_count = 0
                error_count = 0
                errors = []
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        # Validasi username
                        if not row.get('username'):
                            errors.append(f"Baris {row_num}: Username tidak boleh kosong")
                            error_count += 1
                            continue
                        
                        # Cek duplikat username
                        if Radboox.objects.filter(username=row['username']).exists():
                            errors.append(f"Baris {row_num}: Username '{row['username']}' sudah ada")
                            error_count += 1
                            continue
                        
                        # Buat objek Radboox
                        radboox = Radboox(
                            no=row.get('no') or None,
                            username=row['username'],
                            password=row.get('password', ''),
                            profile=row.get('profile', ''),
                            nas=row.get('nas', ''),
                            service=row.get('service', ''),
                            ip=row.get('ip', ''),
                            name=row.get('name', row['username']),
                            phone=row.get('phone', ''),
                            address=row.get('address', ''),
                            status='Aktif'
                        )
                        radboox.save()
                        success_count += 1
                        
                    except Exception as e:
                        errors.append(f"Baris {row_num}: {str(e)}")
                        error_count += 1
                
                # Pesan hasil import
                if success_count > 0:
                    messages.success(request, f'✅ Berhasil mengimport {success_count} data Radboox!')
                if error_count > 0:
                    messages.warning(request, f'⚠️ Gagal mengimport {error_count} data. {errors[0] if errors else ""}')
                
            except Exception as e:
                messages.error(request, f'❌ Terjadi kesalahan: {str(e)}')
                
            return redirect('import_radboox')
    else:
        form = CSVUploadForm()
    
    context = {
        'form': form,
        'total_data': Radboox.objects.count(),
    }
    return render(request, 'web/import_radboox.html', context)


@staff_member_required
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


@staff_member_required
def export_radboox_csv(request):
    """Export semua data Radboox ke file CSV"""
    
    # Buat response
    response = HttpResponse(content_type='text/csv')
    filename = f"radboox_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
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