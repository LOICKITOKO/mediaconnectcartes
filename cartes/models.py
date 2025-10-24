from django.db import models
from django.utils import timezone

class Carte(models.Model):
    card_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    media_name = models.CharField(max_length=100, blank=True, null=True)
    owner_address = models.CharField(max_length=200, blank=True, null=True)
    issued_at = models.DateField(auto_now_add=True)
    expiration_date = models.DateField(blank=True, null=True)
    valid = models.BooleanField(default=True)
    photo = models.ImageField(upload_to='cartes_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.card_id} — {self.name or 'Non renseigné'}"
