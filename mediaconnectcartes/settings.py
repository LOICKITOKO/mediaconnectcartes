import os
import environ
from pathlib import Path

# -----------------------------
# Chemins de base
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------
# Lecture des variables d'environnement
env = environ.Env(
    DEBUG=(bool, False)
)

# Essaie de lire un fichier .env local si présent (utile pour dev)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# -----------------------------
# Clés et debug
SECRET_KEY = env('SECRET_KEY', default='ta-cle-secrete')
DEBUG = env('DEBUG', default=True)
ALLOWED_HOSTS = ['127.0.0.1', '.onrender.com']

# -----------------------------
# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cartes',  # ton app
    'corsheaders'
]

# -----------------------------
# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
# -----------------------------
# URLs et WSGI
ROOT_URLCONF = 'mediaconnectcartes.urls'
WSGI_APPLICATION = 'mediaconnectcartes.wsgi.application'

# -----------------------------
# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# -----------------------------
# Base de données PostgreSQL via variables d'environnement
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT', default='5432'),
    }
}

# -----------------------------
# Langue et fuseau horaire
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Kinshasa'
USE_I18N = True
USE_TZ = True

# -----------------------------
# Statics et médias
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# -----------------------------
# Auto field par défaut
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------------
# Code secret pour accéder aux infos privées des cartes
SCAN_SECRET_CODE = env('SCAN_SECRET_CODE', default='Kano')
