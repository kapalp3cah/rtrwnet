from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # ===== PUBLIC AREA =====
    path('', views.home, name='home'),
    path('pricing/', views.pricing, name='pricing'),
    # ===== PEMBAYARAN =====
    path('pembayaran/', views.pembayaran, name='pembayaran'),
    
    # ===== CUSTOMER AREA (DASHBOARD) =====
    path('pelanggan/', views.pelanggan, name='pelanggan'),
    path('pelanggan/gangguan/', views.gangguan, name='gangguan'),
    
    # ===== ADMIN AREA (IMPORT/EXPORT) =====
    path('admin/import-radboox/', views.import_radboox, name='import_radboox'),
    path('admin/download-template/', views.download_template, name='download_template_radboox'),
    path('admin/export-radboox/', views.export_radboox_csv, name='export_radboox'),
    
    # ===== AUTHENTICATION =====
    path('login/', auth_views.LoginView.as_view(
        template_name='web/login.html',
        redirect_authenticated_user=True
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
]