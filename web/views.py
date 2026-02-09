from django.shortcuts import render

def home(request):
    return render(request, 'web/home.html')

def pricing(request):
    return render(request, 'web/pricing.html')

def pelanggan(request):
    return render(request, 'web/pelanggan.html')

def bayar(request):
    return render(request, 'web/bayar.html')

def gangguan(request):
    return render(request, 'web/gangguan.html')