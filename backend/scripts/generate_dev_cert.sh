#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/certs"
mkdir -p "$CERT_DIR"

CERT_FILE="$CERT_DIR/dev-cert.pem"
KEY_FILE="$CERT_DIR/dev-key.pem"

if command -v openssl >/dev/null 2>&1; then
  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days 365 \
    -subj "/C=US/ST=State/L=City/O=Northwind/OU=Dev/CN=localhost"
  echo "Generated self-signed certificate:"
  echo "  $CERT_FILE"
  echo "  $KEY_FILE"
else
  echo "openssl not found; install openssl to generate a dev certificate." >&2
  exit 1
fi
