#!/bin/sh
# EXFINPDKS compose kalıbı: `npx expo start --offline --port 8081`
# --host lan ve --offline Expo CLI v6'da birbirini dışlar; --offline imza 500'ünü keser.
# iOS Expo Go 58 App Store imzasız manifesto kabul etmez — EXPO_TOKEN varsa online imzala.
#
# Cold first-bundle (~15–30s, 0-byte stall) Expo Go’da beyaz ekran/timeout üretir.
# Bu yüzden Metro ayağa kalkınca iOS+Android hermes bundle’ını sırayla ısıtırız.
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
echo "Expo SDK: 58 (iPhone Expo Go 58)"
echo "Expo Go QR: exp://${PUBLIC_HOST}:${EXPO_PORT}"

if [ -f scripts/patch-expo-anonymous-manifest.js ]; then
  node scripts/patch-expo-anonymous-manifest.js || true
fi

warm_bundles() {
  base="http://127.0.0.1:${EXPO_PORT}"
  # Status hazır olana kadar bekle (max ~3 dk)
  i=0
  while [ "$i" -lt 90 ]; do
    if node -e "fetch('${base}/status').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
      break
    fi
    i=$((i + 1))
    sleep 2
  done
  q='index.bundle?platform=PLATFORM&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&unstable_transformProfile=hermes-stable'
  for plat in ios android; do
    url="${base}/$(echo "$q" | sed "s/PLATFORM/${plat}/")"
    echo "Warming ${plat} bundle..."
    # Sıralı ısıt — paralel istek Metro’yu 0-byte stall’a sokuyor
    node -e "fetch(process.argv[1]).then(async r=>{const b=await r.arrayBuffer();console.log('warm',process.argv[2],r.status,b.byteLength);process.exit(r.ok?0:1)}).catch(e=>{console.error(e);process.exit(1)})" "$url" "$plat" || echo "warm ${plat} failed (non-fatal)"
  done
  echo "Bundle warm complete"
}

# Arka planda ısıtıcı (Metro process ile birlikte yaşar)
(
  warm_bundles
  # Cache’i sıcak tut — Expo Go timeout’unu önler
  while true; do
    sleep 120
    base="http://127.0.0.1:${EXPO_PORT}"
    for plat in ios android; do
      url="${base}/index.bundle?platform=${plat}&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&unstable_transformProfile=hermes-stable"
      node -e "fetch(process.argv[1]).then(r=>r.arrayBuffer()).catch(()=>{})" "$url" || true
      sleep 5
    done
  done
) &
WARM_PID=$!
trap 'kill $WARM_PID 2>/dev/null || true' EXIT INT TERM

if [ -n "${EXPO_TOKEN:-}" ]; then
  unset EXPO_OFFLINE || true
  export EXPO_OFFLINE=
  echo "EXPO_OFFLINE unset (EXPO_TOKEN set — sign for iOS Expo Go 58)"
  # Mint/cache expo-root development cert before Metro (avoids unsigned iOS manifests)
  if [ -f scripts/prefetch-expo-codesigning.js ]; then
    node scripts/prefetch-expo-codesigning.js || echo "prefetch-expo-codesigning failed (Metro may stay unsigned)"
  fi
  exec npx expo start --port "$EXPO_PORT"
fi

export EXPO_OFFLINE=1
echo "EXPO_OFFLINE=1 (anonymous unsigned — iOS Expo Go 58 App Store may ask to login)"
exec npx expo start --offline --port "$EXPO_PORT"
