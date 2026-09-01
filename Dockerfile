# M10 — Expo web static export → nginx (Dokploy demo: apk.retailex.app)
# Bu bir WEB demosu; native APK / IPA üretmez.
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Ensure PNG icons exist for favicon / apple-touch-icon (idempotent)
RUN npm run generate-icons || true

ENV CI=1
ENV NODE_ENV=production
ENV EXPO_NO_TELEMETRY=1
RUN npm run web:export

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web-dist /usr/share/nginx/html
# iOS Safari home-screen icon (from brand icon)
COPY --from=build /app/assets/icon.png /usr/share/nginx/html/apple-touch-icon.png
COPY --from=build /app/public/manifest.json /usr/share/nginx/html/manifest.json
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
