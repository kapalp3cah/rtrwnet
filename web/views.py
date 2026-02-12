from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import GangguanForm, PembayaranForm
from .models import Gangguan, Pembayaran



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
            gangguan.user = request.user   # nanti kita hubungkan ke user
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
            pembayaran.user = request.user   # nanti kita hubungkan ke user
            pembayaran.save()
            return redirect('bayar')
    else:
        form = PembayaranForm()

    return render(request, 'web/bayar.html', {'form': form})
