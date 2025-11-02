from django.contrib import admin
from .models import Carte, ScanLog, CarteDemande


class ScanLogInline(admin.TabularInline):
    model = ScanLog
    extra = 0
    readonly_fields = ('attempt_type', 'device', 'ip_address', 'date', 'success')
    can_delete = False


@admin.register(Carte)
class CarteAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'name', 'role', 'genre', 'issued_at', 'expiration_date', 'valid')
    list_filter = ('valid', 'genre', 'issued_at')
    search_fields = ('card_id', 'name', 'role', 'email', 'personal_phone')
    inlines = [ScanLogInline]

    fieldsets = (
        ("Informations principales", {
            'fields': ('card_id', 'name', 'photo', 'role', 'genre', 'profession', 'email')
        }),
        ("Détails personnels", {
            'fields': ('birth_date', 'birth_place', 'owner_address', 'personal_phone', 'emergency_phone')
        }),
        ("Validité & QR code", {
            'fields': ('issued_at', 'expiration_date', 'valid', 'qr_code')
        }),
        ("Consentement & signature", {
            'fields': ('consent', 'signature_date')
        }),
    )

    readonly_fields = ('qr_code',)


@admin.register(ScanLog)
class ScanLogAdmin(admin.ModelAdmin):
    list_display = ('carte', 'attempt_type', 'success', 'device', 'ip_address', 'date')
    list_filter = ('attempt_type', 'success', 'date')
    search_fields = ('carte__card_id', 'carte__name', 'device', 'ip_address')

@admin.register(CarteDemande)
class CarteDemandeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'doc_type', 'phone', 'email', 'status', 'created_at')
    list_filter = ('doc_type', 'status', 'created_at')
    search_fields = ('full_name', 'phone', 'email')
    readonly_fields = ('created_at',)

    # Actions personnalisées
    actions = ['mark_as_approved', 'mark_as_rejected']

    def mark_as_approved(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f"{updated} demande(s) approuvée(s).")
    mark_as_approved.short_description = "Marquer comme approuvée"

    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f"{updated} demande(s) rejetée(s).")
    mark_as_rejected.short_description = "Marquer comme rejetée"
