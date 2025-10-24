from django.contrib import admin
from django.utils.html import format_html
from .models import Carte

@admin.register(Carte)
class CarteAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'name', 'media_name', 'valid', 'issued_at', 'expiration_date', 'qr_preview')
    search_fields = ('card_id', 'name', 'media_name')
    list_filter = ('valid',)
    readonly_fields = ('qr_preview',)

    def qr_preview(self, obj):
        if obj.qr_code:
            # Affiche le QR code dans l’admin et clique droit → "Enregistrer sous" pour télécharger
            return format_html('<a href="{}" target="_blank"><img src="{}" width="100" height="100" /></a>', obj.qr_code.url, obj.qr_code.url)
        return "Pas de QR code"
    qr_preview.short_description = "QR Code"
