from django.urls import path
from . import views
from .views import all_lost_cards

urlpatterns = [
    # Vérification d'une carte via QR ou input
    path('verify/', views.verify, name='verify'),

    # Soumission d'une nouvelle demande de carte / document
    path('verify/<str:card_id>/', views.verify_get, name='verify_get'),  # <-- ajouté
    path('request/new/', views.handle_carte_request, name='carte_request'),
    path('requests/all/', views.all_carte_requests, name='all_carte_requests'),
    path('request/lost/', views.declare_lost_card, name='declare_lost_card'),
    path('request/lost/all/', all_lost_cards, name='all_lost_cards'),
]
