#!/bin/sh
# Metro public URL: Traefik terminates TLS on 443 and forwards to :8081.
# Expo Go must use exps:// (HTTPS). If EXPO_PACKAGER_PROXY_URL is missing,
# the manifest advertises host:8081 — that port is not public, so Expo Go fails.
set -eu

export CI=1
export EXPO_NO_TELEMETRY=1
export EXPO_NO_INTERACTIVE=1

PUBLIC_HOST="${PUBLIC_HOST:-metro.retailex.app}"
export PUBLIC_HOST
export EXPO_PACKAGER_HOSTNAME="${EXPO_PACKAGER_HOSTNAME:-$PUBLIC_HOST}"
export EXPO_PACKAGER_PROXY_URL="${EXPO_PACKAGER_PROXY_URL:-https://${PUBLIC_HOST}}"
export EXPO_PORT="${EXPO_PORT:-8081}"

echo "Metro public host: $PUBLIC_HOST"
echo "EXPO_PACKAGER_PROXY_URL: $EXPO_PACKAGER_PROXY_URL"
echo "Expo Go QR: exps://${PUBLIC_HOST}"

# Expo CLI v6+ rejects --non-interactive and --host 0.0.0.0.
# --host lan binds a reachable interface inside the container network.
exec npx expo start --host lan --port "$EXPO_PORT"
