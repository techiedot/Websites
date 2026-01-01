from django.contrib import admin

from .models import ContactEmail, Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "project_type", "budget", "created_at")
    search_fields = ("name", "email", "phone", "project_type", "company")
    list_filter = ("project_type", "budget")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(ContactEmail)
class ContactEmailAdmin(admin.ModelAdmin):
    list_display = ("subject", "from_email", "from_name", "phone", "source", "created_at")
    search_fields = ("subject", "from_email", "from_name", "message")
    list_filter = ("source", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
