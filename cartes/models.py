import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.utils import timezone
from django.conf import settings

class Carte(models.Model):
    card_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, default="Non renseigné")
    media_name = models.CharField(max_length=100, default="Non renseigné")
    owner_address = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    issued_at = models.DateField(default=timezone.now)
    expiration_date = models.DateField(blank=True, null=True)
    valid = models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Définir une expiration à +1 an si vide
        if not self.expiration_date:
            self.expiration_date = self.issued_at.replace(year=self.issued_at.year + 1)

        # Générer QR code
        # Détecte si DEBUG pour choisir l'URL
        if settings.DEBUG:
            base_url = 'http://127.0.0.1:8000'
        else:
            base_url = 'https://mediaconnectcartes.onrender.com'

        qr_url = f"{base_url}/verify/?card={self.card_id}"

        # Génération de l'image QR
        qr_img = qrcode.make(qr_url)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')

        # Sauvegarde dans le champ qr_code
        self.qr_code.save(f"{self.card_id}.png", File(buffer), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.card_id} — {self.name}"
