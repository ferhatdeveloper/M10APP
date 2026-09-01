# Dokploy — Expo web demo (`apk.retailex.app`)

Bu deploy **Expo web** statik çıktısıdır (`expo export --platform web` → nginx).  
Alt alan adı `apk` olsa da **native APK / App Store IPA değildir**.

Kaynak: [ferhatdeveloper/M10APP](https://github.com/ferhatdeveloper/M10APP) · dal `master`

## iPhone’da nasıl açılır? (önerilen)

| Yol | Adres / komut | Ne çalışır? |
|-----|----------------|-------------|
| **iOS Safari (web demo)** | `https://apk.retailex.app` | Dokploy’daki SPA. Touch + safe-area odaklı. |
| Ana ekrana ekle | Safari → Paylaş → **Ana Ekrana Ekle** | PWA benzeri tam ekran; ikon `apple-touch-icon`. |
| **Expo Go (native)** | Bilgisayarda `npx expo start` → aynı Wi‑Fi’de QR / LAN | Kamera / barkod / AR tam native. **nginx `exp://` sunamaz.** |
| App Store IPA | — | **Yok.** Apple Developer sertifikası + EAS Build gerekir; bu repo bunu üretmez. |

Özet: iPhone’da demo için **Safari + HTTPS** kullan. Expo Go için domain yeterli değil; LAN veya EAS Update gerekir.

## DNS (sen ekleyeceksin)

Dokploy sunucusunun **hostname** veya **IP** değerini panelden kopyala. İkisinden **birini** kullan.

| Name | Type | Value | Not |
|------|------|--------|-----|
| `apk` | **CNAME** | `<DOKPLOY_SUNUCU_HOSTNAME>` | Örn. `dokploy.ornek.com` veya paneldeki “Server hostname”. Apex değil; `apk.retailex.app` için yeterli. |
| `apk` | **A** | `<DOKPLOY_SUNUCU_IP>` | CNAME kullanmıyorsan. IPv4. |

- Host/Name alanı çoğu panelde sadece `apk` (zone: `retailex.app`). Tam FQDN isteyen panellerde `apk.retailex.app`.
- TTL: 300–600 sn yeterli.
- Let’s Encrypt için DNS’in **yayılmış** olması gerekir (genelde birkaç dakika).

## HTTPS (zorunlu — iOS)

iOS Safari’de kamera, barkod ve medya API’leri **yalnızca güvenli bağlamda** (HTTPS veya localhost) çalışır.  
Dokploy’da domain eklerken **Let’s Encrypt**’i aç; HTTP→HTTPS yönlendirmesi açık kalsın.

TLS **proxy’de** (Traefik/Caddy) biter; container içi nginx yalnızca **80** dinler. `nginx.conf` SPA fallback + güvenlik başlıkları içerir.

## Dokploy UI adımları

1. **Projects** → proje seç veya oluştur → **Create Service** → **Application**.
2. **Git Provider:** GitHub.
3. **Repository:** `ferhatdeveloper/M10APP`.
4. **Branch:** `master`.
5. **Build Type / Provider:** **Dockerfile** (Compose değil).
6. **Dockerfile path:** `Dockerfile` (repo kökü).
7. **Docker context:** `.` (kök).
8. **Port:** `80` (container içi nginx; HTTPS Traefik/Caddy tarafında).
9. **Domains** → **Add domain:** `apk.retailex.app`.
10. **HTTPS / Let’s Encrypt:** aç (Let’s Encrypt toggle). HTTP→HTTPS redirect varsa açık bırak.
11. **Build Arguments:** yok — bırak boş.
12. **Environment variables:** yok — bu web export `process.env` / `EXPO_PUBLIC_*` kullanmıyor.
13. Deploy / Rebuild.
14. iPhone Safari’de `https://apk.retailex.app` aç; kilit simgesi / geçerli sertifika kontrol et.

## Expo Go vs web (önemli)

Statik nginx **Expo Go native bundle** (`exp://…`) servis edemez.

- **Web:** `apk.retailex.app` → iOS Safari demosu (harita web’de placeholder; kamera/AR sınırlı veya manuel giriş).
- **Expo Go:** geliştirici makinesinde `npx expo start` (LAN) veya ileride **EAS Update** + `updates.url`. Domain üzerinden Expo Go istenirse ayrıca `eas.json` + updates yapılandırması gerekir; şu anki tercih **web’i iOS’ta iyi çalıştırmak**.

## iOS / Expo yapılandırma (repo)

| Alan | Değer |
|------|--------|
| SDK | Expo **54** |
| iOS `deploymentTarget` | **15.1** (`expo-build-properties`) |
| `bundleIdentifier` | `com.m10.app` |
| `supportsTablet` | `true` |
| Web | Metro SPA + PWA manifest / `apple-touch-icon` / `viewport-fit=cover` |

Bu ayarlar gelecekteki native / prebuild için uyumluluk sağlar; Dokploy çıktısı yine **web**’dir. App Store IPA veya sürekli iOS binary build bu akışın parçası değildir.

## Build özeti

| Alan | Değer |
|------|--------|
| Git | GitHub `ferhatdeveloper/M10APP` |
| Branch | `master` |
| Build | Dockerfile |
| Port | `80` |
| Domain | `apk.retailex.app` |
| HTTPS | Dokploy Let’s Encrypt (**zorunlu**) |
| Build args | yok |
| Env | yok |

Yerel kontrol: `npm run web:export` veya `docker compose up --build`.
