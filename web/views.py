from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User
from datetime import datetime
import pandas as pd

from .forms import GangguanForm, PembayaranForm, ImportCSVForm
from .models import Gangguan, Pembayaran, Pelanggan


# ======================
# PUBLIC AREA
# ======================

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


@user_passes_test(is_admin)
def import_radboox(request):
    if request.method == 'POST':
        form = ImportCSVForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']

            # Baca file CSV (Radboox pakai tab separator)
            df = pd.read_csv(file, sep=None, engine='python')

            # Bersihkan nama kolom
            df.columns = df.columns.str.strip().str.lower()

            total = 0

            for _, row in df.iterrows():
                username = row.get('username')
                full_name = row.get('name')
                whatsapp = str(row.get('phone'))
                profile = row.get('profile')
                ip_address = row.get('ip')

                if not username:
                    continue
                if df.empty:
                    messages.error(request, "File kosong atau separator salah.")
                    return redirect('import_radboox')

                # Buat atau ambil user Django
                user, created = User.objects.get_or_create(username=username)

                # Jika user baru → password awal = nomor WA
                if created:
                    user.set_password(whatsapp)
                    user.save()

                # Update atau buat data pelanggan
                Pelanggan.objects.update_or_create(
                    user=user,
                    defaults={
                        'username_radius': username,
                        'full_name': full_name,
                        'profile': profile,
                        'ip_address': ip_address,
                        'whatsapp': whatsapp,
                    }
                )

                total += 1

            messages.success(request, f"Import berhasil! Total {total} data diproses.")
            return redirect('import_radboox')

    else:
        form = ImportCSVForm()

    return render(request, 'web/import_csv.html', {'form': form})
