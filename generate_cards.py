import os
import django
import qrcode

# Configurer Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mediaconnectcartes.settings")
django.setup()

from cartes.models import Card

# Paramètres
output_dir = "qrcodes"
os.makedirs(output_dir, exist_ok=True)
base_url = "http://127.0.0.1:8000/verify?card="  # Remplace par ton domaine réel
start_index = 1  # MC-2025-0001
count = 50       # Combien de cartes générer à la fois

for i in range(start_index, start_index + count):
    card_id = f"MC-2025-{i:04d}"
    card, created = Card.objects.get_or_create(card_id=card_id)
    if created:
        print(f"[OK] Carte créée : {card_id}")
    else:
        print(f"[INFO] Carte existe déjà : {card_id}")

    qr_data = base_url + card_id
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    file_path = os.path.join(output_dir, f"{card_id}.png")
    img.save(file_path)
    print(f"[OK] QR généré : {file_path}")

print("✅ Tous les QR codes ont été générés.")
