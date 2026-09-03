# M10 — Expo web static build for Dokploy (iPhone Safari preview)
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
# --legacy-peer-deps: expo-three@8.0.0 vs three@0.169.0 peer uyumsuzluğunu
# geçici olarak yoksay (expo-three SDK 55+'a kadar güncellenmedi).
RUN npm ci --legacy-peer-deps --no-audit --no-fund

COPY . .

# Static web export (served on iPhone via Safari)
ENV CI=1
RUN npx expo export --platform web --output-dir web-dist

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web-dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
