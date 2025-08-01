"""
Django settings for LIEAS project.

Generated by 'django-admin startproject' using Django 5.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

from pathlib import Path
import os
from decouple import config, Csv
from django.core.management.utils import get_random_secret_key

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [
  'lieas.onrender.com',
  "100.20.92.101",
  "44.225.181.72",
  "44.227.217.144",
]

# Application definition
INSTALLED_APPS = [
    "jazzmin",  # Must come first
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Your custom apps
    "leader",
]

# Jazzmin customization
JAZZMIN_SETTINGS = {
    "site_title": "LIEAS Admin",
    "site_header": "LIEAS Administration",
    "site_brand": "LIEAS",
    "welcome_sign": "Welcome to the LIEAS Admin Panel",
    "copyright": "LIEAS",
    "site_logo": "images/logo.jpg",
    "login_logo": "images/logo.jpg",
    "login_logo_dark": "images/logo.png",
    "site_logo_classes": "img-circle",
    "site_icon": "images/logo.png",
    "search_model": ["auth.User"],

    "custom_css": "custom/admin.css",  # relative to /static/
    "custom_js": "custom/admin.js",

    "show_sidebar": True,
    "navigation_expanded": True,
    "theme": "flatly",  # You can also try: darkly, solar, litera, etc.

    "icons": {
        "auth.User": "fas fa-user",
        "auth.Group": "fas fa-users",
    },
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

ROOT_URLCONF = "LIEAS.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "LIEAS.wsgi.application"

# Database
# Use SQLite for development, PostgreSQL for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='postgres'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
  }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Security settings - only apply in production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year in seconds
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Cookie Security Settings
    SESSION_COOKIE_SECURE = True        # Only send session cookies over HTTPS
    CSRF_COOKIE_SECURE = True          # Only send CSRF cookies over HTTPS
    SESSION_COOKIE_HTTPONLY = True     # Prevent JavaScript access to session cookies
    CSRF_COOKIE_HTTPONLY = True        # Prevent JavaScript access to CSRF cookies
    SESSION_COOKIE_SAMESITE = 'Strict' # Prevent CSRF attacks
    CSRF_COOKIE_SAMESITE = 'Strict'    # Prevent CSRF attacks
    
    # Additional security headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'