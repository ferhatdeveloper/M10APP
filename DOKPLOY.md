# Dokploy — `apk.retailex.app` (Expo web demo)

Bu servis **iki kanaldan** yayın yapar:

| Kanal | Adres | İçerik | Çalıştıran |
|-------|-------|--------|------------|
| **Web** (Dokploy) | `https://apk.retailex.app` | Statik web SPA (`expo export --platform web` → nginx) | iOS Safari, Android tarayıcı |
| **Native** (EAS Update) | `https://u.expo.dev/<projectId>?channel-name=production&runtime-version=1.0.0&platform=ios` | Metro iOS/Android bundle | Expo Go (kamera, barkod, AR) |

Kaynak: [ferhatdeveloper/M10APP](https://github.com/ferhatdeveloper/M10APP) · dal `master`.

> iOS Safari’de **HTTPS zorunlu** (kamera/barkod/medya API'leri güvenli bağlam ister). Let’s Encrypt Dokploy tarafında açık olmalı.

---

## iPhone’da nasıl açılır?

| Yol | Adres / komut | Ne çalışır? |
|-----|----------------|-------------|
| **iOS Safari (web demo)** | `https://apk.retailex.app` | Dokploy’daki SPA. Touch + safe-area odaklı. |
| Ana ekrana ekle | Safari → Paylaş → **Ana Ekrana Ekle** | PWA benzeri tam ekran; ikon `apple-touch-icon`. |
| **Expo Go (native)** | `exp://apk.retailex.app:8081` | Metro dev server’dan native bundle indirir. **Kamera / barkod / AR tam native.** |
| **EAS Update (alternatif)** | `exps://u.expo.dev/.../manifest?...` | EAS Update ile native bundle (asset HMAC bazen sorunlu) |

### DNS (sen ekleyeceksin)

Dokploy sunucusunun **hostname** veya **IP** değerini panelden kopyala.

| Name | Type | Value | Not |
|------|------|-------|-----|
| `apk` | **CNAME** | `<DOKPLOY_SUNUCU_HOSTNAME>` | Örn. `dokploy.ornek.com` |
| `apk` | **A** | `<DOKPLOY_SUNUCU_IP>` | CNAME kullanmıyorsan (IPv4) |

- TTL: 300–600 sn yeterli.
- Let’s Encrypt için DNS’in **yayılmış** olması gerekir (birkaç dakika).

### HTTPS

TLS proxy’de (Traefik/Caddy) biter; container içi nginx yalnızca **80** dinler. `nginx.conf` SPA fallback + güvenlik başlıkları içerir.

### Dokploy UI adımları

**İki ayrı servis oluştur:**

#### Servis 1: `m10-web` (mevcut — statik web)

1. **Projects** → proje seç veya oluştur → **Create Service** → **Application**.
2. **Git Provider:** GitHub.
3. **Repository:** `ferhatdeveloper/M10APP`.
4. **Branch:** `master`.
5. **Build Type / Provider:** **Dockerfile** (Compose değil).
6. **Dockerfile path:** `Dockerfile` (repo kökü).
7. **Docker context:** `.` (kök).
8. **Port:** `80` (container içi nginx; HTTPS Traefik/Caddy tarafında).
9. **Domains** → **Add domain:** `apk.retailex.app`.
10. **HTTPS / Let’s Encrypt:** aç. HTTP→HTTPS redirect açık kalsın.
11. **Build Arguments:** yok.
12. **Environment variables:** yok — bu web export `process.env` / `EXPO_PUBLIC_*` kullanmıyor.
13. Deploy / Rebuild.
14. iPhone Safari’de `https://apk.retailex.app` aç; kilit simgesi / geçerli sertifika kontrol et.

#### Servis 2: `m10-metro` (yeni — Expo Go native bundle)

> EXFINPDKS'te (`exp.exfinpdks.com:8081`) kullanılan kalıplı yapı.
> QR: `exp://apk.retailex.app:8081`

**EXFINPDKS pattern'i (referans):**

| Env | Değer | Açıklama |
|-----|-------|----------|
| `PUBLIC_HOST` | `apk.retailex.app` | Manifest içindeki public hostname |
| `EXPO_PACKAGER_HOSTNAME` | `apk.retailex.app` | Aynı |
| `EXPO_PACKAGER_PROXY_URL` | `https://apk.retailex.app:443` | HTTPS proxy adresi |
| `EXPO_PORT` | `8081` | Metro port |
| `METRO_TRAEFIK_ENABLE` | `false` | Traefik proxy yok, Metro doğrudan dinler |

**Compose yöntemi (önerilen, EXFINPDKS ile aynı):**

1. Aynı projede → **Create Service** → **Application** → **Compose**.
2. **Repository:** `ferhatdeveloper/M10APP`.
3. **Branch:** `master`.
4. **Compose file:** `docker-compose.yml`.
5. **Service:** `m10-metro` seç.
6. **Port:** `8081` (sadece bu port açık, Traefik host-based rule ile).
7. **Environment variables:** yukarıdaki tablo (zaten `docker-compose.yml`'de tanımlı).
8. **Host binding:** Dokploy panelinde `apk.retailex.app` host'unu bu servise yönlendir.
9. Deploy.

**Dockerfile yöntemi (Compose yoksa):**

1. **Create Service** → **Application** → **Dockerfile**.
2. **Dockerfile path:** `Dockerfile.metro`.
3. **Port:** `8081`.
4. **Environment variables** yukarıdaki tablo.
5. Deploy.

**Domain / Host yapısı (Dokploy'da):**

| Service | Host | Port | Yönlendirme |
|---------|------|------|-------------|
| `m10-web` | `apk.retailex.app` | 443 → 80 | Traefik HTTPS (Let's Encrypt) |
| `m10-metro` | `apk.retailex.app` | 8081 | Metro doğrudan (HTTP) |

### DNS (Metro için)

| Name | Type | Value | Not |
|------|------|-------|-----|
| `metro` | **CNAME** | `<DOKPLOY_SUNUCU_HOSTNAME>` | Opsiyonel. Yöntem C ise ekle |

### Dockerfile davranışı

`Dockerfile` iki aşamalı:

1. `node:22-alpine` → `npm ci --legacy-peer-deps` → `npx expo export --platform web --output-dir web-dist`
   - `--legacy-peer-deps` gerekli: `expo-three@8.0.0` ↔ `three@0.169.0` peer uyumsuzluğu var (expo-three SDK 55+ ile çözülecek).
2. `nginx:1.27-alpine` → `web-dist` klasörünü servis eder.

---

## 2) Native (EAS Update) — yeni kanal

Dokploy nginx **native bundle servis edemez** (statik dosya). Bunun için **EAS Update** kullanıyoruz: native JS bundle Expo sunucusunda (`u.expo.dev`) durur, Expo Go indirir ve çalıştırır. **Aynı Wi-Fi gerekmez.**

### İlk kurulum (bir kere)

```bash
# 1. Login (zaten yapıldıysa atla)
eas login

# 2. Konfigürasyon (zaten yapıldı)
# app.json içine otomatik eklendi:
#   "updates": { "url": "https://u.expo.dev/<projectId>" }
#   "runtimeVersion": "1.0.0"

# 3. İlk update'i yayınla
npm run update:publish
```

Bu komut:
- Metro ile iOS + Android bundle üretir
- Asset’leri Expo sunucusuna yükler
- `production` branch’ine publish eder

### Yeni sürüm yayınlama

JS kodu değiştikten sonra:

```bash
npm run update:publish
```

Expo Go’da uygulama yeniden açıldığında yeni bundle otomatik iner (OTA — over-the-air). App Store’a gerek yok.

### Mevcut update’ler

```bash
npm run update:list
# veya
# https://expo.dev/accounts/dev.ferhatnas/projects/m10/updates
```

İlk publish: branch `production`, runtime `1.0.0`, group ID `ef0c7d6d-...` (iOS: `01a06675-...`).

### iPhone’da açma

1. **Expo Go** yükle (App Store).
2. `apk-retailex-eas-update-qr.png` dosyasını telefona gönder (AirDrop / iCloud Drive / mail).
3. QR’ı **Expo Go içinden** aç → kamera ile okut.
   - veya `Enter URL manually` ile manifest URL’ini gir:
     ```
     https://u.expo.dev/f5df0de1-7a05-4d7d-a056-217d9da60e29?channel-name=production&runtime-version=1.0.0&platform=ios
     ```
4. Native bundle iner, uygulama açılır. Kamera/barkod/AR çalışır.

> QR `exps://` şeması da kabul eder (Safari’den Expo Go’ya yönlendirir), ama manifest URL’sini direkt Expo Go’ya girmek en garantili yol.

### Channel / Branch mantığı

- `branch = production`, `channel = production` (eas.json'da tanımlı).
- Yeni geliştirme için `branch = staging` açılabilir; staging'i test edip production'a merge.
- İleride native release: `eas build --platform ios --branch production` ile App Store IPA üretilebilir (mevcut EAS project zaten `production` branch'i için yapılandırıldı).

---

## QR dosyaları (repo kökü)

| Dosya | Kodlanan string | Ne olur? |
|-------|-----------------|----------|
| `apk-retailex-qr.png` | `https://apk.retailex.app` | Telefon kamerası / Safari → **web** |
| `apk-retailex-expo-go-qr.png` | `exp://apk.retailex.app:8081` | Expo Go → **Metro dev server** (kamera/AR tam) |
| `apk-retailex-eas-update-qr.png` | `exps://u.expo.dev/.../manifest?...` | Alternatif: EAS Update manifest (asset HMAC sorunlu olabilir) |
| `apk-retailex-expo-go-android-intent-qr.png` | Android intent → host.exp.exponent | Eski deneme — **kullanma** |

---

## İki kanal birlikte nasıl çalışır?

- **Web** (`apk.retailex.app`): Hızlı önizleme, sıfır kurulum, PWA. Native özellikler sınırlı veya placeholder (örn. harita web’de stub).
- **Native** (Expo Go + EAS Update): Tam özellik — kamera, barkod, AR, push bildirim. QR ile tek tıkla açılır.

Geliştirme akışı:

1. Kod değiştir → `git push origin master`
2. Dokploy otomatik rebuild → web güncellenir (`apk.retailex.app`)
3. Native istiyorsan → `npm run update:publish` → Expo Go günceller

---

## iOS / Expo yapılandırma (repo)

| Alan | Değer |
|------|-------|
| SDK | Expo **54** |
| iOS `deploymentTarget` | **15.1** |
| `bundleIdentifier` | `com.m10.app` |
| `supportsTablet` | `true` |
| `runtimeVersion` | `1.0.0` |
| `updates.url` | `https://u.expo.dev/f5df0de1-7a05-4d7d-a056-217d9da60e29` |
| Web | Metro SPA + PWA manifest / `apple-touch-icon` / `viewport-fit=cover` |

---

## Build özeti

### Web (`m10-web`)

| Alan | Değer |
|------|-------|
| Git | GitHub `ferhatdeveloper/M10APP` |
| Branch | `master` |
| Build | Dockerfile |
| Port | `80` |
| Domain | `apk.retailex.app` |
| HTTPS | Dokploy Let’s Encrypt (**zorunlu**) |
| Build args | yok |
| Env | yok |

### Metro (`m10-metro`)

| Alan | Değer |
|------|-------|
| Build | Compose (`docker-compose.yml`) **veya** Dockerfile (`Dockerfile.metro`) |
| Service | `m10-metro` |
| Port | `8081` |
| Domain | Opsiyonel (Yöntem C: `metro.apk.retailex.app`) |
| Env | `EXPO_PACKAGER_HOSTNAME=apk.retailex.app`, `EXPO_PACKAGER_PROXY_URL=https://apk.retailex.app:443` |
| QR | `exp://apk.retailex.app:8081` |
| Restart | unless-stopped |

Yerel kontrol: `npm run web:export` veya `docker compose up --build`.
