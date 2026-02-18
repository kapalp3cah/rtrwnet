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


#class ImportCSVForm(forms.Form):
#   file = forms.FileField()


class CSVUploadForm(forms.Form):
    file = forms.FileField(
        label='Pilih file CSV',
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': '.csv',
            'id': 'csv_file'
        })
    )