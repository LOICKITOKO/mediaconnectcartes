from django.contrib import admin
from .models import Carte

@admin.register(Carte)
class CarteAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'name', 'media_name', 'valid', 'issued_at', 'expiration_date')
    search_fields = ('card_id', 'name', 'media_name')
    list_filter = ('valid',)
