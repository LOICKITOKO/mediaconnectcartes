import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.utils import timezone


class Carte(models.Model):
    GENRE_CHOICES = [
        ('Masculin', 'Masculin'),
        ('Féminin', 'Féminin'),
    ]

    card_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, default="Non renseigné")
    role = models.CharField(max_length=50, blank=True)
    genre = models.CharField(max_length=10, choices=GENRE_CHOICES, blank=True, null=True)
    owner_address = models.CharField(max_length=255, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    birth_place = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    issued_at = models.DateField(default=timezone.now)
    expiration_date = models.DateField(blank=True, null=True)
    valid = models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    # Champs facultatifs pour infos supplémentaires
    personal_phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)

    # Consentement et signature
    consent = models.BooleanField(default=False)
    signature_date = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Expiration automatique à +1 an si non définie
        if not self.expiration_date:
            self.expiration_date = self.issued_at.replace(year=self.issued_at.year + 1)

        # Génération du QR code pointant vers le site
        base_url = 'https://mediaconnectcartes.onrender.com'
        qr_url = f"{base_url}/verify/?card={self.card_id}"

        qr_img = qrcode.make(qr_url)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        self.qr_code.save(f"{self.card_id}.png", File(buffer), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.card_id} — {self.name}"


class ScanLog(models.Model):
    carte = models.ForeignKey(Carte, related_name='scan_logs', on_delete=models.CASCADE)
    device = models.CharField(max_length=255, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    attempt_type = models.CharField(
        max_length=10,
        choices=[('scan', 'Scan'), ('auth', 'Auth')],
        default='scan'
    )
    date = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(null=True)

    def __str__(self):
        status = "Succès" if self.success else "Échec" if self.success is False else "En attente"
        return f"{self.carte.card_id} - {self.attempt_type} - {status} - {self.date.strftime('%d/%m/%Y %H:%M')}"


# ----------------------------- NOUVEAU -----------------------------
class CarteRequest(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('new_card', 'Nouvelle carte'),
        ('lost_card', 'Déclaration de perte'),
        ('issue', 'Problème / Signalement'),
        ('contact', 'Contact'),
    ]

    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES)
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    carte_related = models.ForeignKey(Carte, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.get_request_type_display()} - {self.full_name} ({self.created_at.strftime('%d/%m/%Y %H:%M')})"

class CarteDemande(models.Model):
    DOCUMENT_TYPES = [
        ('CNI', 'Carte Nationale'),
        ('PASS', 'Passeport'),
        ('ACTE', 'Acte de naissance'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Refusée'),
    ]

    full_name = models.CharField("Nom complet", max_length=150)
    birth_date = models.DateField("Date de naissance")
    phone = models.CharField("Téléphone", max_length=20)
    email = models.EmailField("Email")
    doc_type = models.CharField("Type de document", max_length=5, choices=DOCUMENT_TYPES)
    document_file = models.FileField("Document joint", upload_to='demande_documents/')
    created_at = models.DateTimeField("Date de création", auto_now_add=True)
    status = models.CharField("Statut", max_length=10, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Demande de carte"
        verbose_name_plural = "Demandes de cartes"

    def __str__(self):
        return f"{self.full_name} ({self.get_doc_type_display()}) - {self.status}"
