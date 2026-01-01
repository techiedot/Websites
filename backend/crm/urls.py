from django.urls import path

from . import views

urlpatterns = [
    path("customers/", views.customers, name="customers"),
    path("contact/", views.submit_email, name="submit_email"),
]
