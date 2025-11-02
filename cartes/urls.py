from django.urls import path
from . import views

urlpatterns = [
    # Vérification d'une carte via QR ou input
    path('verify/', views.verify, name='verify'),

    # Soumission d'une nouvelle demande de carte / document
    path('request/new/', views.handle_carte_request, name='carte_request'),
]
