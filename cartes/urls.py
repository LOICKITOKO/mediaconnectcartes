from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),           # Page d'accueil
    path('verifier/', views.verify, name='verifier'),  # Vérification QR
]
