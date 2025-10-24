import os
import django
import qrcode
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

# Configurer Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mediaconnectcartes.settings")
django.setup()

from cartes.models import Card

# Paramètres
output_dir = "qrcodes"
pdf_file = "cartes_qr.pdf"
os.makedirs(output_dir, exist_ok=True)
base_url = "http://127.0.0.1:8000/verify?card="  # Remplace par ton domaine réel
start_index = 1   # MC-2025-0001
count = 50        # Nombre de cartes à générer
cards_per_row = 5
cards_per_col = 8
card_size_mm = 40

# Générer cartes et QR
cards_list = []
for i in range(start_index, start_index + count):
    card_id = f"MC-2025-{i:04d}"
    card, created = Card.objects.get_or_create(card_id=card_id)
    cards_list.append((card_id, card))
    
    qr_data = base_url + card_id
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(os.path.join(output_dir, f"{card_id}.png"))

print("✅ Toutes les cartes et QR ont été générés.")

# Générer PDF
c = canvas.Canvas(pdf_file, pagesize=A4)
page_width, page_height = A4
margin_mm = 10
x_start = margin_mm * mm
y_start = page_height - margin_mm * mm - card_size_mm * mm

x = x_start
y = y_start

for idx, (card_id, card) in enumerate(cards_list):
    qr_path = os.path.join(output_dir, f"{card_id}.png")
    c.drawImage(qr_path, x, y, card_size_mm*mm, card_size_mm*mm)
    c.drawString(x, y - 10, card_id)
    
    # Avancer à la prochaine colonne
    x += card_size_mm * mm + 5*mm
    if (idx+1) % cards_per_row == 0:
        x = x_start
        y -= card_size_mm * mm + 15*mm
        if (idx+1) % (cards_per_row*cards_per_col) == 0:
            c.showPage()
            y = y_start

c.save()
print(f"✅ PDF généré : {pdf_file}")
