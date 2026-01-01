import json
import logging
from typing import Any, Dict, Optional

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import ContactEmail, Customer

logger = logging.getLogger(__name__)


def _parse_json(request) -> Optional[Dict[str, Any]]:
    try:
        body = request.body.decode("utf-8") or "{}"
        return json.loads(body)
    except (ValueError, json.JSONDecodeError):
        return None


def _serialize_customer(customer: Customer) -> Dict[str, Any]:
    return {
        "id": customer.id,
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone,
        "company": customer.company,
        "address": customer.address,
        "project_type": customer.project_type,
        "budget": customer.budget,
        "notes": customer.notes,
        "created_at": customer.created_at.isoformat(),
        "updated_at": customer.updated_at.isoformat(),
    }


def _serialize_contact(contact: ContactEmail) -> Dict[str, Any]:
    return {
        "id": contact.id,
        "customer_id": contact.customer_id,
        "from_name": contact.from_name,
        "from_email": contact.from_email,
        "phone": contact.phone,
        "subject": contact.subject,
        "message": contact.message,
        "source": contact.source,
        "created_at": contact.created_at.isoformat(),
    }


@csrf_exempt
def customers(request):
    if request.method == "GET":
        data = [_serialize_customer(cust) for cust in Customer.objects.all()]
        return JsonResponse({"customers": data})

    if request.method == "POST":
        payload = _parse_json(request)
        if payload is None:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)

        name = payload.get("name", "").strip()
        email = payload.get("email", "").strip()
        if not name or not email:
            return JsonResponse({"error": "Name and email are required"}, status=400)

        defaults = {
            "phone": payload.get("phone", "").strip(),
            "company": payload.get("company", "").strip(),
            "address": payload.get("address", "").strip(),
            "project_type": payload.get("project_type", "").strip(),
            "budget": payload.get("budget", "").strip(),
            "notes": payload.get("notes", "").strip(),
        }
        customer, created = Customer.objects.get_or_create(email=email, defaults={"name": name, **defaults})
        if not created:
            updated_fields = []
            if customer.name != name:
                customer.name = name
                updated_fields.append("name")
            for field, value in defaults.items():
                if value and getattr(customer, field) != value:
                    setattr(customer, field, value)
                    updated_fields.append(field)
            if updated_fields:
                customer.updated_at = timezone.now()
                updated_fields.append("updated_at")
                customer.save(update_fields=updated_fields)

        return JsonResponse(
            {"customer": _serialize_customer(customer), "created": created},
            status=201 if created else 200,
        )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def submit_email(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    payload = _parse_json(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)

    from_name = payload.get("name") or payload.get("from_name") or ""
    from_email = payload.get("email") or payload.get("from_email") or ""
    subject = payload.get("subject") or "Project inquiry"
    message = payload.get("message") or ""
    phone = payload.get("phone", "")
    source = payload.get("source", "web")

    if not from_name.strip() or not from_email.strip() or not message.strip():
        return JsonResponse({"error": "Name, email, and message are required"}, status=400)

    customer = None
    if payload.get("customer_id"):
        customer = Customer.objects.filter(id=payload["customer_id"]).first()
    elif from_email:
        customer, _ = Customer.objects.get_or_create(email=from_email, defaults={"name": from_name, "phone": phone})

    contact = ContactEmail.objects.create(
        customer=customer,
        from_name=from_name.strip(),
        from_email=from_email.strip(),
        phone=phone.strip(),
        subject=subject.strip(),
        message=message.strip(),
        source=source,
    )

    email_sent = False
    recipients = getattr(settings, "CONTACT_RECIPIENTS", [])
    if recipients:
        email_body = (
            f"Name: {from_name}\n"
            f"Email: {from_email}\n"
            f"Phone: {phone}\n"
            f"Source: {source}\n"
            f"Customer ID: {customer.id if customer else 'N/A'}\n\n"
            f"{message}"
        )
        try:
            send_mail(
                subject=f"[Website] {subject}",
                message=email_body,
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                recipient_list=recipients,
                fail_silently=False,
            )
            email_sent = True
        except Exception as exc:  # noqa: BLE001
            logger.exception("Failed to send contact email: %s", exc)

    return JsonResponse({"contact": _serialize_contact(contact), "email_sent": email_sent}, status=201)
