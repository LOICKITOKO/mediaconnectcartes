from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.views.decorators.http import require_http_methods
from .models import Carte, ScanLog


def home(request):
    return render(request, 'cartes/home.html')


@require_http_methods(["GET", "POST"])
def verify(request):
    card_id = request.GET.get('card')
    if not card_id:
        return render(request, 'cartes/home.html')

    carte = get_object_or_404(Carte, card_id=card_id)
    device_info = request.META.get('HTTP_USER_AGENT', 'Inconnu')
    ip = request.META.get('REMOTE_ADDR')

    if request.method == 'GET':
        ScanLog.objects.create(
            carte=carte,
            device=device_info,
            ip_address=ip,
            attempt_type='scan',
            success=None
        )
        return render(request, 'cartes/verify_secure.html', {'card': carte, 'show_details': False})

    code = request.POST.get('access_code', '').strip()
    secret_code = getattr(settings, 'SCAN_SECRET_CODE', None)
    success = secret_code and code == secret_code

    ScanLog.objects.create(
        carte=carte,
        device=device_info,
        ip_address=ip,
        attempt_type='auth',
        success=success
    )

    if success:
        return render(request, 'cartes/verify_secure.html', {'card': carte, 'show_details': True})
    else:
        return render(request, 'cartes/verify_secure.html', {
            'card': carte,
            'show_details': False,
            'error': 'Code incorrect. Accès refusé.'
        })
