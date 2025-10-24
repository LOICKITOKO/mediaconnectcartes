from django.shortcuts import render, get_object_or_404
from .models import Carte

def home(request):
    return render(request, 'cartes/home.html')

def verify(request):
    card_id = request.GET.get('card')
    if card_id:
        carte = get_object_or_404(Carte, card_id=card_id)
        return render(request, 'cartes/verify.html', {'card': carte})
    return render(request, 'cartes/home.html')
