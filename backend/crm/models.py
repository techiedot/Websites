from django.db import models


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    company = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255, blank=True)
    project_type = models.CharField(max_length=255, blank=True)
    budget = models.CharField(max_length=128, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.email})"


class ContactEmail(models.Model):
    customer = models.ForeignKey(
        Customer, related_name="emails", null=True, blank=True, on_delete=models.SET_NULL
    )
    from_name = models.CharField(max_length=255)
    from_email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    source = models.CharField(max_length=64, default="web")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        label = self.subject or "Inquiry"
        return f"{label} from {self.from_email}"
