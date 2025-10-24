from django.db import models
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files import File

class Carte(models.Model):
    card_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    media_name = models.CharField(max_length=100)
    owner_address = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    issued_at = models.DateField(default=timezone.now)
    expiration_date = models.DateField(blank=True, null=True)
    valid = models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Date d'expiration automatique à +1 an si absente
        if not self.expiration_date:
            self.expiration_date = self.issued_at.replace(year=self.issued_at.year + 1)

        # Générer le QR code
        qr_url = f"https://mediaconnect.vercel.app/verify/?card={self.card_id}"
        qr_img = qrcode.make(qr_url)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        self.qr_code.save(f"{self.card_id}.png", File(buffer), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.card_id
