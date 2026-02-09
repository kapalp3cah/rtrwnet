from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('pasang/', views.pricing, name='pricing'),
    path('pelanggan/', views.pelanggan, name='pelanggan'),
    path('pelanggan/bayar/', views.bayar, name='bayar'),
    path('pelanggan/gangguan/', views.gangguan, name='gangguan'),
]
