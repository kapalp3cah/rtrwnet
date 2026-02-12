from django import forms
from .models import Gangguan, Pembayaran

class GangguanForm(forms.ModelForm):
    class Meta:
        model = Gangguan
        fields = '__all__'


class PembayaranForm(forms.ModelForm):
    class Meta:
        model = Pembayaran
        fields = ['nama', 'no_wa', 'bulan_tagihan', 'bukti_transfer']


class ImportCSVForm(forms.Form):
    file = forms.FileField()
