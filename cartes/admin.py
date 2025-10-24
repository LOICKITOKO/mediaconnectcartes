from django.contrib import admin
from .models import Carte
from django.utils.html import format_html

@admin.register(Carte)
class CarteAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'name', 'role', 'valid', 'issued_at', 'expiration_date', 'qr_preview')
    search_fields = ('card_id', 'name', 'role')
    list_filter = ('valid',)

    def qr_preview(self, obj):
        if obj.qr_code:
            return format_html('<img src="{}" style="width:80px;height:80px;"/>', obj.qr_code.url)
        return "-"
    qr_preview.short_description = "QR Code"
