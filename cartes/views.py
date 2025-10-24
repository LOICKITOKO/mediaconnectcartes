from django.shortcuts import render, get_object_or_404
from .models import Carte
from datetime import date

def verify(request):
    card_id = request.GET.get('card')
    carte = get_object_or_404(Carte, card_id=card_id)

    # Calcul de la date d'expiration si nécessaire
    expiration_date = carte.expiration_date

    return render(request, 'cartes/verify.html', {
        'card': carte,
        'expiration_date': expiration_date
    })
