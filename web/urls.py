from django.urls import path
from . import views
from .views import import_radboox

urlpatterns = [
    path('', views.home, name='home'),
    path('pasang/', views.pricing, name='pricing'),
    path('pelanggan/', views.pelanggan, name='pelanggan'),
    path('pelanggan/bayar/', views.bayar, name='bayar'),
    path('pelanggan/gangguan/', views.gangguan, name='gangguan'),
    path('import-radboox/', import_radboox, name='import_radboox'),
]
