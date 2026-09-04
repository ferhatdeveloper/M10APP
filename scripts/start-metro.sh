#!/bin/sh
# EXFINPDKS compose kalıbı: `npx expo start --offline --port 8081`
# --host lan ve --offline Expo CLI v6'da birbirini dışlar; --offline imza 500'ünü keser.
# iOS Expo Go 57 App Store imzasız manifesto kabul etmez — EXPO_TOKEN varsa online imzala.
set -eu

export CI=1
export EXPO_NO_TELEMETRY=1
export EXPO_NO_INTERACTIVE=1
export EXPO_NO_DOTENV=1
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

PUBLIC_HOST="${PUBLIC_HOST:-72.60.182.107}"
export PUBLIC_HOST
export EXPO_PACKAGER_HOSTNAME="${EXPO_PACKAGER_HOSTNAME:-$PUBLIC_HOST}"
export REACT_NATIVE_PACKAGER_HOSTNAME="${REACT_NATIVE_PACKAGER_HOSTNAME:-$PUBLIC_HOST}"
export EXPO_PORT="${EXPO_PORT:-8081}"
export EXPO_PACKAGER_PROXY_URL="${EXPO_PACKAGER_PROXY_URL:-http://${PUBLIC_HOST}:${EXPO_PORT}}"

echo "Metro public host: $PUBLIC_HOST"
echo "EXPO_PACKAGER_PROXY_URL: $EXPO_PACKAGER_PROXY_URL"
echo "Expo SDK: 57 (iPhone Expo Go 57)"
echo "Expo Go QR: exp://${PUBLIC_HOST}:${EXPO_PORT}"

if [ -f scripts/patch-expo-anonymous-manifest.js ]; then
  node scripts/patch-expo-anonymous-manifest.js || true
fi

if [ -n "${EXPO_TOKEN:-}" ]; then
  unset EXPO_OFFLINE || true
  echo "EXPO_OFFLINE=0 (EXPO_TOKEN set — sign for iOS Expo Go 57)"
  exec npx expo start --port "$EXPO_PORT"
fi

export EXPO_OFFLINE=1
echo "EXPO_OFFLINE=1 (anonymous unsigned — iOS Expo Go 57 App Store will ask to login)"
exec npx expo start --offline --port "$EXPO_PORT"
