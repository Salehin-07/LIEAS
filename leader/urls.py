from django.urls import path
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('courses/', views.courses, name='courses'),
    path('courses/<int:id>',views.courses_id, name='courses_id'),
    path('contact/', views.contact, name='contact'),
    path('teachers/', views.teachers, name='teachers'),
    path('enroll/', views.enroll, name='enroll'),
    path('enroll-requests/', views.show_enroll_requests, name='enroll-requests'),
    path('notice/', views.notice, name='notice'),
    path('sjanwvsgmsklmabsbanjsja/', admin.site.login),
]