from django.shortcuts import render

def index(request):
    paket = [
        {"speed": 10, "price": 155},
        {"speed": 15, "price": 175},
        {"speed": 20, "price": 205},
        {"speed": 30, "price": 255},
    ]
    return render(request, 'web/index.html', {'paket': paket})
