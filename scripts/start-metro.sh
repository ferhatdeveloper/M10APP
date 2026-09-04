#!/bin/sh
# Expo Go native URL: exp://metro.retailex.app:8081
# 8081 host'ta yayınlanır (Dokploy published port). HTTPS 443 web/manifest içindir.
set -eu

export CI=1
export EXPO_NO_TELEMETRY=1
export EXPO_NO_INTERACTIVE=1

PUBLIC_HOST="${PUBLIC_HOST:-72.60.182.107}"
export PUBLIC_HOST
export EXPO_PACKAGER_HOSTNAME="${EXPO_PACKAGER_HOSTNAME:-$PUBLIC_HOST}"
export EXPO_PORT="${EXPO_PORT:-8081}"
export EXPO_PACKAGER_PROXY_URL="${EXPO_PACKAGER_PROXY_URL:-http://${PUBLIC_HOST}:${EXPO_PORT}}"

echo "Metro public host: $PUBLIC_HOST"
echo "EXPO_PACKAGER_PROXY_URL: $EXPO_PACKAGER_PROXY_URL"
echo "Expo Go QR: exp://${PUBLIC_HOST}:${EXPO_PORT}"

# Expo CLI v6+ rejects --non-interactive and --host 0.0.0.0.
exec npx expo start --host lan --port "$EXPO_PORT" --offline
