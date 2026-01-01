# Construction Company Site (React + Django)

This project pairs a Django backend (customer/email models + admin) with a React frontend tailored for a construction company marketing site.

## Structure

- `backend/` — Django project `construction_site` with `crm` app, customer and contact email models, and API endpoints.
- `frontend/` — Vite + React single-page site with hero, services, projects, and a contact form wired to the backend.

## Backend (Django)

1. `cd backend`
2. Create/activate a virtual env and install deps: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Create an admin user: `python manage.py createsuperuser`
5. Start the server: `python manage.py runserver 0.0.0.0:8000`

### Admin

- Visit `/admin/` to manage `Customer` and `ContactEmail` records (searchable, filterable lists).

### API Endpoints

- `POST /api/contact/` — Create a `ContactEmail` (fields: `name`, `email`, `phone`, `subject`, `message`, optional `source`, `customer_id`). Creates/links a `Customer` by email when possible.
- `GET /api/customers/` — List customers.
- `POST /api/customers/` — Upsert by email (fields: `name`, `email`, optional `phone`, `company`, `address`, `project_type`, `budget`, `notes`).

`crm.middleware.SimpleCorsMiddleware` adds permissive CORS headers for local React dev; swap for `django-cors-headers` in production.

### Email notifications

- On `POST /api/contact/`, the backend attempts to email site admins; response includes `email_sent: true/false`.
- Configure recipients and SMTP via env:
  - `CONTACT_RECIPIENTS`: comma-separated recipient list (required to send)
  - `DEFAULT_FROM_EMAIL`: sender address (default `no-reply@northwindbuilds.local`)
  - `EMAIL_HOST`/`EMAIL_PORT`/`EMAIL_USE_TLS`
  - `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD`
  - `EMAIL_BACKEND` (override; defaults to console in DEBUG, SMTP otherwise)

### SSL / HTTPS

- Security toggles (set env vars): `SECURE_SSL_REDIRECT=true`, `SESSION_COOKIE_SECURE=true`, `CSRF_COOKIE_SECURE=true`, optional `SECURE_PROXY_SSL_HEADER=true` behind reverse proxies. HSTS via `SECURE_HSTS_SECONDS` etc.
- For local HTTPS, generate a self-signed cert: `cd backend && bash scripts/generate_dev_cert.sh`
- Run Django over TLS: `python manage.py runserver 0.0.0.0:8443 --cert-file certs/dev-cert.pem --key-file certs/dev-key.pem`
- Point the frontend dev proxy to `https://localhost:8443` if you switch the backend to HTTPS in dev.

## Frontend (React)

1. `cd frontend`
2. Install deps: `npm install`
3. Dev server with proxy to Django: `npm run dev` (talks to `http://localhost:8000/api` via Vite proxy)
4. Production build: `npm run build` (outputs to `dist/`)

The contact form posts to `/api/contact/` and surfaces success/error messages. Adjust branding, copy, or colors in `src/App.jsx` and `src/index.css`.

### runserver_plus (optional)

- Included via `django-extensions`; install deps: `pip install -r requirements.txt`
- Start with SSL: `python manage.py runserver_plus 0.0.0.0:8443 --cert-file certs/dev-cert.pem --key-file certs/dev-key.pem`
- For plain HTTP: `python manage.py runserver_plus 0.0.0.0:8000`
