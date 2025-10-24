from django.shortcuts import render, get_object_or_404
from .models import Carte

def home(request):
    # Affiche la dernière carte ajoutée (ou None si aucune)
    carte = Carte.objects.last()
    expiration_date = carte.expiration_date if carte else None

    return render(request, 'cartes/home.html', {
        'card': carte,
        'expiration_date': expiration_date
    })


def verify(request):
    card_id = request.GET.get('card')
    carte = get_object_or_404(Carte, card_id=card_id)

    expiration_date = carte.expiration_date

    return render(request, 'cartes/verify.html', {
        'card': carte,
        'expiration_date': expiration_date
    })
