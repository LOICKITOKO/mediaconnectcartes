from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from .models import Carte, ScanLog, CarteDemande
import json
from django.views.decorators.http import require_POST

# ------------------- Vérification d'une carte -------------------
@csrf_exempt
def verify(request):
    """
    Vérifie l'identité d'une carte via code secret.
    Retourne les informations JSON si le code est correct.
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Méthode non autorisée."})

    try:
        data = json.loads(request.body)
        card_id = data.get("card_id")
        code = data.get("access_code", "").strip()
    except:
        return JsonResponse({"success": False, "error": "Données invalides."})

    if not card_id:
        return JsonResponse({"success": False, "error": "Aucune carte fournie."})

    try:
        carte = Carte.objects.get(card_id=card_id)
    except Carte.DoesNotExist:
        return JsonResponse({"success": False, "error": "Carte introuvable."})

    # Vérification du code secret
    secret_code = getattr(settings, "SCAN_SECRET_CODE", None)
    success = secret_code and code == secret_code
    print("Code envoyé :", code)
    print("Code secret :", secret_code)

    # Log de la tentative
    ScanLog.objects.create(
        carte=carte,
        device=request.META.get('HTTP_USER_AGENT', 'Inconnu'),
        ip_address=request.META.get('REMOTE_ADDR'),
        attempt_type='auth',
        success=success
    )

    if not success:
        return JsonResponse({"success": False, "error": "Code secret incorrect."})

    # Retour des données de la carte
    return JsonResponse({
        "success": True,
        "card": {
            "card_id": carte.card_id,
            "name": carte.name,
            "genre": carte.genre,
            "role": carte.role,
            "email": carte.email,
            "personal_phone": carte.personal_phone,
            "emergency_phone": carte.emergency_phone,
            "birth_date": str(carte.birth_date),
            "birth_place": carte.birth_place,
            "owner_address": carte.owner_address,
            "issued_at": str(carte.issued_at),
            "expiration_date": str(carte.expiration_date),
            "valid": carte.valid,
        }
    })


# ------------------- Gestion des demandes de carte / document -------------------
@csrf_exempt
def handle_carte_request(request):
    """
    Gère la soumission d'une demande de carte/document officiel.
    Les demandes sont créées dans CarteDemande pour apparaître dans l'admin.
    """
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Méthode non autorisée."})

    # Récupération des données du formulaire
    full_name = request.POST.get("full_name")
    birth_date = request.POST.get("birth_date")
    email = request.POST.get("email")
    phone = request.POST.get("phone")
    doc_type = request.POST.get("doc_type")  # doit correspondre à CarteDemande.doc_type
    document_file = request.FILES.get("document_file")  # doit correspondre à CarteDemande.document_file

    # Vérification rapide côté serveur
    if not all([full_name, birth_date, email, phone, doc_type, document_file]):
        return JsonResponse({"success": False, "error": "Tous les champs sont obligatoires."})

    # Création de la demande dans CarteDemande
    carte_demande = CarteDemande.objects.create(
        full_name=full_name,
        birth_date=birth_date,
        email=email,
        phone=phone,
        doc_type=doc_type,
        document_file=document_file
    )

    # Optionnel : envoi d'un email de confirmation
    try:
        send_mail(
            subject="Confirmation de votre demande",
            message=f"Bonjour {full_name},\n\nVotre demande pour {carte_demande.get_doc_type_display()} a été reçue. Nous traiterons votre demande rapidement.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True
        )
    except Exception as e:
        print("Erreur envoi email:", e)

    return JsonResponse({
        "success": True,
        "message": "✅ Votre demande a été enregistrée avec succès et sera visible dans l'espace admin."
    })


# ------------------- Mise à jour du statut d'une demande -------------------
@require_POST
def update_request_status(request, request_id, new_status):
    """
    Met à jour le statut d'une demande de carte.
    new_status doit être une valeur valide du modèle CarteDemande.STATUS_CHOICES
    """
    try:
        demande = CarteDemande.objects.get(id=request_id)

        # Vérifie que le nouveau statut est valide
        if new_status not in dict(CarteDemande.STATUS_CHOICES):
            return JsonResponse({"success": False, "error": "Statut invalide"})

        demande.status = new_status
        demande.save()
        return JsonResponse({"success": True, "message": f"Demande mise à jour en '{new_status}'"})

    except CarteDemande.DoesNotExist:
        return JsonResponse({"success": False, "error": "Demande introuvable"})
