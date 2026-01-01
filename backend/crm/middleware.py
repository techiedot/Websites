from django.conf import settings
from django.http import HttpResponse


class SimpleCorsMiddleware:
    """
    Lightweight CORS headers for local React dev. Replace with django-cors-headers for production.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        response["Access-Control-Allow-Origin"] = getattr(settings, "CORS_ALLOW_ORIGIN", "*")
        response["Access-Control-Allow-Methods"] = getattr(settings, "CORS_ALLOW_METHODS", "GET, POST, OPTIONS")
        response["Access-Control-Allow-Headers"] = getattr(settings, "CORS_ALLOW_HEADERS", "Content-Type, X-CSRFToken")
        return response
