#!/bin/sh
# Validates the sample Nginx config with `nginx -t` in a container, using throwaway
# self-signed certs at the Let's Encrypt paths. Run from the repo root.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp/live/cse031sust02.online"
openssl req -x509 -nodes -newkey rsa:2048 -days 1 -subj "/CN=cse031sust02.online" \
  -keyout "$tmp/live/cse031sust02.online/privkey.pem" \
  -out "$tmp/live/cse031sust02.online/fullchain.pem" >/dev/null 2>&1
docker run --rm \
  -v "$here/cse031sust02.online.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$tmp:/etc/letsencrypt:ro" \
  nginx:stable-alpine nginx -t
