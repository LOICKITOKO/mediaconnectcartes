from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from .models import Carte, ScanLog, CarteDemande, CarteRequest
import json
from django.views.decorators.http import require_POST

# ------------------- Vérification d'une carte -------------------
@csrf_exempt
def verify(request):
    """
    Vérifie l'identité d'une carte via code secret.
    GET : ?card=MC-xxxx
    POST : { "card_id": "MC-xxxx", "access_code": "Kano" }
    Retourne les informations JSON si le code est correct.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            card_id = data.get("card_id")
            code = data.get("access_code", "").strip()
        except:
            return JsonResponse({"success": False, "error": "Données invalides."})
    elif request.method == "GET":
        card_id = request.GET.get("card")
        code = request.GET.get("access_code", "").strip()
    else:
        return JsonResponse({"success": False, "error": "Méthode non autorisée."})

    if not card_id:
        return JsonResponse({"success": False, "error": "Aucune carte fournie."})

    try:
        carte = Carte.objects.get(card_id=card_id)
    except Carte.DoesNotExist:
        return JsonResponse({"success": False, "error": "Carte introuvable."})

    # Vérification du code secret (ici on suppose "Kano")
    access_granted = code == "Kano"

    # Sérialisation de la carte
    card_info = {
        "card_id": carte.card_id,
        "name": carte.name,
        "genre": carte.genre,
        "role": carte.role,
        "email": carte.email,
        "personal_phone": carte.personal_phone,
        "emergency_phone": carte.emergency_phone,
        "birth_date": str(carte.birth_date) if carte.birth_date else None,
        "birth_place": carte.birth_place,
        "owner_address": carte.owner_address,
        "issued_at": str(carte.issued_at),
        "expiration_date": str(carte.expiration_date) if carte.expiration_date else None,
        "valid": carte.valid,
        # URLs complètes pour l'image et le QR code
        "photo": request.build_absolute_uri(carte.photo.url) if carte.photo else None,
        "qr_code": request.build_absolute_uri(carte.qr_code.url) if carte.qr_code else None,
    }

    # Si le code est incorrect, tu peux cacher certaines infos sensibles
    if not access_granted:
        # Par exemple, on ne montre pas email et téléphone personnel
        card_info["email"] = None
        card_info["personal_phone"] = None

    return JsonResponse({"success": True, "card": card_info})

    # Vérification du code secret
    secret_code = getattr(settings, "SCAN_SECRET_CODE", None)
    success = secret_code and code == secret_code

    # Log de la tentative
    ScanLog.objects.create(
        carte=carte,
        device=request.META.get('HTTP_USER_AGENT', 'Inconnu'),
        ip_address=request.META.get('REMOTE_ADDR'),
        attempt_type='auth',
        success=success
    )

    if not success and code:
        return JsonResponse({"success": False, "error": "Code secret incorrect."})

    # Retour des données de la carte
    card_data = {
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

    return JsonResponse({
        "success": True,
        "card": card_data
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
    doc_type = request.POST.get("doc_type")
    document_file = request.FILES.get("document_file")

    if not all([full_name, birth_date, email, phone, doc_type, document_file]):
        return JsonResponse({"success": False, "error": "Tous les champs sont obligatoires."})

    carte_demande = CarteDemande.objects.create(
        full_name=full_name,
        birth_date=birth_date,
        email=email,
        phone=phone,
        doc_type=doc_type,
        document_file=document_file
    )

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
    try:
        demande = CarteDemande.objects.get(id=request_id)

        if new_status not in dict(CarteDemande.STATUS_CHOICES):
            return JsonResponse({"success": False, "error": "Statut invalide"})

        demande.status = new_status
        demande.save()
        return JsonResponse({"success": True, "message": f"Demande mise à jour en '{new_status}'"})

    except CarteDemande.DoesNotExist:
        return JsonResponse({"success": False, "error": "Demande introuvable"})


def all_carte_requests(request):
    demandes = CarteDemande.objects.all().order_by('-created_at')
    data = [
        {
            "id": d.id,
            "full_name": d.full_name,
            "birth_date": str(d.birth_date),
            "phone": d.phone,
            "email": d.email,
            "doc_type": d.get_doc_type_display(),
            "status": d.get_status_display(),
            "created_at": d.created_at.strftime("%d/%m/%Y %H:%M"),
        }
        for d in demandes
    ]
    return JsonResponse({"success": True, "demandes": data})


# ------------------- Déclaration de carte perdue -------------------
@csrf_exempt
def declare_lost_card(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"success": False, "error": "Données invalides"})

        full_name = data.get("full_name")
        card_id_lost = data.get("carte_related")
        email = data.get("email")
        phone = data.get("phone")
        message = data.get("message")

        if not all([full_name, card_id_lost, email, phone]):
            return JsonResponse({"success": False, "error": "Tous les champs obligatoires"})

        CarteRequest.objects.create(
            full_name=full_name,
            email=email,
            phone=phone,
            carte_id_lost=card_id_lost,
            message=message
        )

        return JsonResponse({"success": True, "message": "✅ Votre déclaration de carte perdue a bien été envoyée !"})
    return JsonResponse({"success": False, "error": "Méthode non autorisée"})


def all_lost_cards(request):
    pertes = CarteRequest.objects.filter(carte_id_lost__isnull=False).order_by('-created_at')
    data = [
        {
            "id": p.id,
            "full_name": p.full_name,
            "card_id": p.carte_id_lost,
            "phone": p.phone,
            "email": p.email,
            "message": p.message,
            "created_at": p.created_at.strftime("%d/%m/%Y %H:%M"),
        }
        for p in pertes
    ]
    return JsonResponse({
        "success": True,
        "count": len(data),
        "lost_cards": data
    })

# ------------------- Vérification GET pour navigateur -------------------
def verify_get(request, card_id):
    """
    Vérifie une carte via GET pour test dans le navigateur.
    Paramètre URL : card_id
    Paramètre query : ?code=Kano
    """
    code = request.GET.get("code", "")
    try:
        carte = Carte.objects.get(card_id=card_id)
    except Carte.DoesNotExist:
        return JsonResponse({"success": False, "error": "Carte introuvable."})
    
    secret_code = getattr(settings, "SCAN_SECRET_CODE", "")
    success = code == secret_code
    
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
