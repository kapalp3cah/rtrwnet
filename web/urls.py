from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
#from .views import import_radboox

urlpatterns = [
    # Halaman utama
    path('', views.home, name='home'),
    path('pricing/', views.pricing, name='pricing'),
    path('pelanggan/', views.pelanggan, name='pelanggan'),

    path('pelanggan/bayar/', views.bayar, name='bayar'),
    path('pelanggan/gangguan/', views.gangguan, name='gangguan'),

    # Import/Export
    path('import-radboox/', views.import_radboox, name='import_radboox'),
    path('download-template/', views.download_template, name='download_template_radboox'),
    path('export-radboox/', views.export_radboox_csv, name='export_radboox'),

    # ===== AUTHENTICATION URLS =====
    path('login/', auth_views.LoginView.as_view(
        template_name='web/login.html',
        redirect_authenticated_user=True
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
]

