# M10 — Proje Analizi

**M10**, Irak pazarına yönelik, **Expo + React Native + react-native-web** üzerinde çalışan, **tek kod tabanından** üç platforma (iOS, Android, Web) çıkan bir **süpermarket + marketplace + hizmet** uygulamasıdır.

> Şu anki sürüm tamamen demo amaçlıdır — tüm veriler mock JSON + AsyncStorage'da yaşar, gerçek bir backend/sunucu yoktur.

---

## Expo Go — telefonla aç

<p align="center">
  <img src="apk-retailex-expo-go-qr.png" alt="Expo Go QR exp://72.60.182.107:8081" width="280" />
</p>

<p align="center">
  <b>Kamera yok — URL’yi elle gir</b><br />
  <code>exp://72.60.182.107:8081</code>
</p>

**iPhone Expo Go 57’de uygulama içi QR kamerası yok.** Safari, iPhone **Kamera** ve Notlar’daki `exp://` linki **aynı deep link** — hepsi imzasız Metro’da `npx expo login` der.

1. Telefonda **Expo Go**’yu aç (App Store, SDK 57).
2. Alt menüde **Home**.
3. Sağ üst **avatar** → Expo hesabına **giriş yap** (iOS 57 zorunlu).
4. Home’da aşağı kaydır → **Enter URL manually** (bazen **+** veya URL kutusu).
   - Kutu: `exp://` — yaz: `exp://72.60.182.107:8081`
   - **Connect** / klavyede **Go**.
5. Görmüyorsan: girişten sonra Home’da **Development servers** listesine bak; yoksa adresi **Notlar**’a yapıştırıp mavi `exp://…` satırına dokun (Kamera ile aynı deep link).

Eski kayıtlı **M10** (SDK 54) varsa sil. GitHub master / `u.expo.dev` kullanma.

Safari / Kamera / Enter URL hâlâ `npx expo login` derse Metro imzasızdır. Aynı Expo hesabının **EXPO_TOKEN** değeri Dokploy `m10-metro` env’sine eklenmeli — adımlar: [`DOKPLOY.md`](./DOKPLOY.md#expo-token-ios-57). Token’ı sohbete yapıştırma.

**EXFINPDKS örneği login sormuyordu** çünkü o Metro **SDK 54 / eski Expo Go** + `https://exp.exfinpdks.com` idi; `EXPO_TOKEN` yoktu, komut da `--offline`. Aynı bayraklar M10’da duruyor. iPhone App Store Go **57** artık imzasızda giriş ister — EXFIN kalıbı bunu kaldırmaz.

**Android login sormaz, iPhone sorar:** Metro her iki platforma **aynı imzasız SDK 57** manifestini verir. [Expo](https://expo.dev/changelog/expo-go-57-login): giriş zorunluluğu **yalnızca iOS App Store Expo Go 57**; Android’e sonra gelecek. Play Store Expo Go hâlâ 54/eski istemci olduğu için imzasızı açar. iPhone’u Android gibi yapmak (tokensız) **mümkün değil**. 54’e geri alınmaz (iPhone Go 57 onu reddeder). Android şu an tokensız kalır.

**Android:** Play Store hâlâ 54 ise proje 57 olduğu için uyumsuzluk çıkabilir → [SDK 57](https://expo.dev/go?sdkVersion=57&platform=android).

<details>
<summary>Web önizleme (Safari / Chrome)</summary>

<p align="center">
  <img src="apk-retailex-qr.png" alt="Web QR https://apk.retailex.app" width="200" />
</p>

<p align="center"><a href="https://apk.retailex.app">https://apk.retailex.app</a></p>

</details>

> Native bundle: `exp://72.60.182.107:8081` (Dokploy Metro, HTTP — TLS yok). Detay: [`DOKPLOY.md`](./DOKPLOY.md).

---

---

## 1. Platform ve Yığın (Tech Stack)

| Katman | Teknoloji |
|---|---|
| Çatı | Expo SDK 57, React Native 0.86.3, React 19.2, yeni mimari (newArchEnabled) |
| Web export | Metro bundler, single-page, statik nginx'e derleniyor (`web-dist`) |
| Yönlendirme | `@react-navigation/native-stack` + `bottom-tabs` (native), `react-router` (web kalıntı) |
| UI | React Native primitives + `lucide-react-native` ikonlar + özel tema |
| Veri | Mock JSON tabanlı, **AsyncStorage** ile kalıcı (sunucu yok) |
| AI | OpenRouter API (GPT-4o-mini chat, Gemini 2.5 Flash image) |
| Konum | `expo-network` (offline tespiti), `react-native-maps` (delivery tracking) |
| Kamera | `expo-camera` (barkod tarama + AR try-in-room) |
| 3D / AR | `expo-gl` + `three.js` + `expo-three` (gerçek FurniMesh GLB modelleri — remote cache'li) |
| Push | `expo-notifications` (yerel demo bildirimler) |
| Ödeme | Demo akışı (Apple/Google Pay, card, wallet, cash simülasyonu) |
| Build | `expo export --platform web` → Docker (alpine + nginx 1.27) → **Dokploy** için hazır |
| Vite | Web geliştirme için (yalnız dev) |

`App.js` (kök) ve `index.js` — RN girişi; `src/App.jsx` + `src/main.jsx` + `index.html` — web/Dokploy varyantı. Aslında **iki paralel giriş noktası** var; build sırasında yalnızca biri kullanılıyor (Dockerfile `expo export` yapıyor → metro).

---

## 2. Marka ve Tema

- **Renkler:** Kırmızı `#E31E24` (birincil), sarı `#FFF200` (vurgu/rozet), siyah mürekkep, yeşil (açık), turuncu (meşgul).
- **Yön:** **RTL/LTR otomatik** — `lang === 'ar'` olunca `isRTL=true`; dizin `dir="rtl"` (HTML).
- **Çoklu dil:** Arapça (varsayılan), İngilizce, **Türkçe** (tam çeviri mevcut).
- **Tema dosyası:** `src/theme.js` — renkler, radius, spacing, shadow üç seviye.
- **Bundle ID:** `com.m10.app` (iOS ve Android).

---

## 3. Veri Katmanı

`src/data/mock.js` — **3.047 satır**, tek gerçek veri kaynağı:

### Sabitler
- `DEFAULT_STORE_ID = 'm10-dora-mechanic'` — Dora/Mekanik şubesi (Baghdad)
- `ADMIN_PIN = '1234'`, `DEMO_OTP = '12345'`
- `M10_PLUS`: 5.000 IQD / 30 gün abonelik
- `REFERRAL_BONUS = 200` (paylaşan), `REFERRAL_REDEEM_BONUS = 150` (kullanan)
- `WALLET_TOPUPS = [5000, 10000, 25000]`
- `FREE_DELIVERY_FROM = 25000` IQD (eşik)
- `DELIVERY_SLOTS`: 6 adet 2-saatlik teslimat pencereleri
- `LEGACY_STORE_IDS` — eski şube ID'lerini Dora'ya yeniden yönlendirir

### Mağazalar
**5 ana şube** (hepsi Baghdad):
1. **Dora Mekanik** (varsayılan, express)
2. **Dora Çarşı**
3. **Seyyidiye**
4. **Zeyyune** (Erbil alias'ı burada)
5. **Filistin**

Her mağazada: rating, ETA (10-20 dk), teslimat ücreti, min. sipariş, koordinatlar (Baghdad bölgesi için), açık/kapalı durumu, "comingSoon" bayrağı.

### Katalog
**~1.530 ürün** (`mm-*` ID'li), çok dilli isim/açıklama, fiyat, eski fiyat (indirim), stok, birim (kg/adet), barkod, marka, varyantlar, `tryInRoom` (AR uyumlu) bayrağı, resim URL'leri.

### Kategoriler (13 adet)
`offers`, `ready`, `dairy`, `coldcuts`, `meat`, `bakery`, `drinks`, `pantry`, `produce`, `snacks`, `frozen`, `household`, `home`, `personal`.

### Filtreler
`offers`, `freeDelivery`, `topRated`, `new`, `under30` — chip olarak.

### Diğerleri
- **Story'ler** (7 tane, M10 kampanyaları)
- **Flyer'lar** (3 aktif kampanya)
- **Bildirimler** (seed)
- **15 tarif/liste** (tohum recipe'ler)
- **15 ödül** (puan karşılığı)
- **9 FAQ** (destek için)

### Konum yardımcıları
`AREA_COORDS` — Bağdat bölgeleri için lat/lng; `coordsForAddress`/`coordsForStore` fuzzy eşleştirme; `lerpCoords` (animasyonlu kurye simülasyonu için).

---

## 4. State Yönetimi

`src/context/AppContext.jsx` (1.295 satır) — tek mega context. İçerdiği state'ler:

| Kategori | State |
|---|---|
| Sepet | `cart`, `cartCount`, `cartStore`, `cartTotal`, `cartFee`, `cartDiscount`, `cartPayable`, `coupon` |
| Kullanıcı | `user`, `accounts`, `addresses`, `walletBalance` (başlangıç 15.000 IQD) |
| Sipariş | `orders`, `returns`, `butlerJobs` |
| Bildirim | `notifications`, `unreadCount`, `seenStories`, `toast` |
| Favoriler | `favorites` |
| Yönetim | `liveCatalog`, `liveAisles`, `liveCampaigns`, `liveStores`, `storeOverrides`, `adminUnlocked`, `demoMode` |
| Offline | `isOffline`, `simulateOffline` |
| Liste | `lists` (alışveriş + tarifler) |

**Tüm veri AsyncStorage'a persist edilir** (anahtarlar: `m10-cart`, `m10-orders`, `m10-user`, `m10-accounts`, `m10-notifs`, `m10-wallet`, `m10-lists`, `m10-butler`, `m10-returns`, `m10-store-overrides`, `m10-admin-catalog/aisles/campaigns/stores`, `m10-coupon`, `m10-favs`, `m10-seen-stories`, `m10-sim-offline`, `m10-demo-mode`, `m10-close-demo`, `m10-catalog-cache`).

Önemli metodlar:
- `addToCart`, `setQty`, `clearCart`, `reorder`, `cancelOrder`, `rateOrder`
- `login/logout`, `unlockAdmin/lockAdmin`
- Admin: `adminUpsertProduct/Aisle/Campaign/Store`, `adminToggleStock`, `adminSetOrderStatus`, `adminSetCustomerPoints`
- Butler: `requestButler`
- Wallet: `topUpWallet`, `redeemReward`, `redeemReferral`, `shareReferralCredit`
- Plus: `subscribePlus/cancelPlus`
- `placeOrder` — ödeme yöntemi (cash/card/wallet/apple/google), cüzdan bakiyesi düşümü, puan kazanma

---

## 5. Navigasyon ve Ekranlar

`src/navigation/RootNavigator.jsx` — Native Stack + Bottom Tabs.

### Alt Bar (5 sekme)
1. **Home** (Anasayfa)
2. **Search** (Ara)
3. **Butler** (Şoför — kurye hizmeti, ikinci sırada vurgulu)
4. **Orders** (Siparişler)
5. **Profile** (Hesap)

### 36 Native Ekran (`src/screens/`)

**Müşteri akışı:**
| Ekran | Amaç |
|---|---|
| `Language` | İlk açılış: dil seçimi (Arapça/İngilizce/Türkçe) |
| `Login` | Telefon numarası + Irak bayrağı (`🇮🇶 +964`), demo hesapları listesi |
| `Verify` | 5 haneli OTP (`12345`), 45s geri sayım, demo OTP gösterimi |
| `Home` | Story'ler, kampanya, M10+ banner, "Sizin için" öneriler, reyonlar, mağaza listesi, alt sepet bar |
| `Search` | Ürün/mağaza araması, filtreler |
| `Category` | Kategoriye göre ürünler |
| `Store` | Mağaza içi — reyon sekmeleri, ürün ızgarası, "satın alındı" rozeti, AR rozeti |
| `ProductDetail` | Ürün detayı, varyantlar, miktar, sepete ekle, AR "Odanızda Dene" |
| `Cart` | Sepet — kupon, ücretsiz teslimat progress, alt toplam |
| `Checkout` | Adres, zaman dilimi (6 slot), 4 ödeme yöntemi, kart formu, cüzdan, simülasyon |
| `Orders` | Geçmiş + yeniden sipariş ver, iptal, puan, iade |
| `OrderTracking` | Canlı harita (kurye lerp animasyonu), adım göstergesi, kurye kartı |
| `RateOrder` | Mağaza + kurye yıldız, yorum, çoklu seçim, otomatik açılır (delivered sonrası) |
| `ReturnRequest` | Eksik/yanlış ürün bildirimi |
| `Notifications` | Tüm bildirimler, okundu işaretle |
| `StoryViewer` | Story'ler için ışık kutusu |
| `Flyer` | Aktüel ürünler sayfası, "tümünü sepete ekle" |
| `Favorites` | Favori mağazalar |
| `Address/Addresses` | Adres listesi |
| `Wallet` | Bakiye + top-up (3 paket) + ödeme yöntemi açıklamaları |
| `Rewards` | Puan tablosu, altın/gümüş/bronz tier, 9 ödül, "ödül kullan" |
| `Plus` | M10+ abonelik tanıtımı |
| `Lists` | Alışveriş listeleri + tarifler (YouTube videosu ile) |
| `RecipeDetail` | Malzemeler + adım adım tarif + "malzemeleri sepete ekle" |
| `Referral` | Davet kodu (`M10-XXXX`), paylaş butonu, bonus bilgisi |
| `Support` | 9 FAQ |
| `Scan` | Barkod tarama (kamera + manuel), ürünü bul + sepete ekle |
| `TryInRoom` | AR — kameraya ürün PNG cutout yerleştir, sürükle/yakınlaştır/döndür |

**Courier (Kurye) akışı:**
- `Courier` — Sipariş listesi (kuryenin görmesi için), harita, "picked"/"delivered" işaretle, Butler işlerini de gör, müşteri rolüne dön

**Admin akışı:**
- `Admin` (koruma: PIN `1234` veya rol) — 8 bölüm:
  1. Overview (metrikler: bugünkü siparişler, aktif kampanyalar, müşteri sayısı)
  2. Categories (reyon ekle/sil/düzenle, çok dilli)
  3. Products (ürün ekle/düzenle/sil, görsel yükleme — `expo-image-picker`)
  4. Customers (müşteri listesi, puan düzenleme)
  5. Campaigns (kampanya ekle, ürün ID'leri ile, indirim %)
  6. Orders (sipariş durumu güncelle)
  7. Stores (mağaza bilgisi düzenle)
  8. **AI** (lazy load) — OpenRouter entegrasyonu
- `AdminAI` — OpenRouter API anahtarı kaydet, **3 alt-sekme**:
  - Setup (API key, chat/image model seç, bağlantı testi)
  - Translate (ürün metnini AR/EN/TR'ye çevir, ürüne uygula)
  - Image (görsel üret — `/images` endpoint, sonra chat fallback, en sonra Unsplash öneri)
  - Social (Instagram/TikTok için caption paketi oluştur + image prompt)

---

## 6. Özel Bileşenler (`src/components/`)

| Bileşen | İşlev |
|---|---|
| `TopBar` | Kırmızı arka planlı üst çubuk — lokasyon, başlık, zil (okunmamış badge), geri |
| `BottomNav` | Web-only alt nav |
| `ProductCard` | Ürün kartı — görsel, fiyat, miktar stepper, AR rozeti, "stokta yok" durumu, alternatif ürün önerisi |
| `StoreCard` | Mağaza kartı — kapak, puan, ETA, teslimat |
| `ProductImage` | Güvenli `Image` — hata olursa kategori fallback |
| `SearchField` | Hem basılabilir hem input modunda çalışan arama çubuğu (barkod ikonu dahil) |
| `Logo` | M10 logo bileşeni (kırmızı/sarı varyantları) |
| `SoftPress` | iOS uyumlu basma efekti |
| `Layout` | Web için sayfa çerçevesi |
| `InAppToast` | Uygulama içi bildirim |
| `OfflineBanner` | Çevrimdışı uyarı şeridi |
| `DeliveryMap` | `react-native-maps` — varış + kurye marker + polyline |
| `DeliveryMap.web.jsx` | Web stub |
| `ARModelScene` | **Three.js + GLView** ile GLB model render (legacy, artık kullanılmıyor) |
| `ErrorBoundary` | Hata yakalama |
| `LogoPath` | Logo SVG path tanımı |

---

## 7. Araçlar (Utils)

- `utils/openrouter.js` — OpenRouter API istemcisi: `listModels`, `chatCompletion`, `translateProductText`, `generateImage` (3 katmanlı fallback), `generateSocialPack`, `testConnection`. API anahtarı AsyncStorage'da maskelenmiş saklanır.
- `utils/push.js` — Yerel bildirimler için `expo-notifications` sarmalayıcı (web'de devre dışı, fallback'li).
- `utils/images.js` — Görsel URL fallback'leri (kategoriye göre Unsplash), `src()` yardımcısı (lokal/mix).
- `data/arModels.js` — AR cutout boyut/skalası (`mm-lamp`, `mm-vase`, vb., ürün ID'lerine göre).

---

## 8. Demo Modu (Çoklu Rol)

`demoMode` state'i (`customer | admin | courier`) ile rol değiştirme:
- **Müşteri:** Tüm alışveriş akışı.
- **Kurye:** Login ekranında demo telefonlarından biriyle (`0771 555 0001`) girilirse otomatik Courier ekranına yönlenir.
- **Admin:** PIN `1234` veya Login ekranındaki `0772 999 0000` numarasıyla girilince admin erişimi açılır.

Login ekranı, üç demo hesabını rol rozetleriyle listeler.

---

## 9. Çevrimdışı Davranış

- `expo-network` ile ağ durumu dinlenir.
- `simulateOffline` (admin panelinden açılır) — sahte çevrimdışı mod.
- Çevrimdışıyken:
  - `OfflineBanner` gösterilir.
  - `placeOrder` `null` döner.
- Ürün katalog snapshot'ı (`m10-catalog-cache`) son açılışta kaydedilir — hızlı başlangıç için.

---

## 10. i18n Anahtarları

Üç sözlük (`src/i18n/ar.js`, `en.js`, `tr.js`) — eşit kapsam. Türkçe çeviriler tamamlanmış. Toplam ~430 anahtar (her dil için). Eksik anahtar olursa `key` döner.

`localeFor(lang)` ile sayı/tarih formatlama: `ar-IQ`, `en-US`, `tr-TR`.

---

## 11. Build ve Dağıtım

- **iOS/Android:** `expo run:ios` / `expo run:android` (gradle build mevcut `android/` klasörü).
- **Web:** `npx expo export --platform web --output-dir web-dist`.
- **Docker:** Çok aşamalı build — Node 22 alpine ile derle, nginx 1.27 alpine ile serve et. Healthcheck: 30s aralıkla `wget http://127.0.0.1/`.
- **Dokploy hedefli** (yorumlu: "iPhone Safari preview").
- **Vite config:** Yalnızca dev için (5173 port).

---

## 12. Scripts

- `generate-icons.js` — `logoPath.js`'ten SVG → PNG (`sharp` ile). Üretir: `icon.png`, `adaptive-icon.png`, `splash.png`, `m10-logo.png`.
- `mealdb-seed.json` — TheMealDB'den tohumlanmış 15 tarif.
- `fresh-extra-products.js`, `apply-fresh-fix.mjs`, `patch-fresh-catalog.mjs` — alt menü/döküm scriptleri (geliştirme yardımcıları).
- `trace-logo.js` — logo path debug.

---

## 13. Neler Var ✅

- 36 ekranlı tam çok dilli (AR/EN/TR) mobil + web uygulama
- Çok rollü (müşteri/kurye/admin) auth + rol tabanlı navigasyon
- 1.530+ ürünlü, 5 mağazalı, 13 kategorili tam katalog
- Sepet, kupon, puan, cüzdan, M10+ abonelik, davet sistemi
- Demo ödeme akışı (cash/card/wallet/Apple Pay/Google Pay)
- Sipariş takibi (canlı harita simülasyonu, adım göstergesi, kurye animasyonu)
- Puan/lip sistemi, ödül kataloğu
- Tarifler + alışveriş listeleri (YouTube video bağlantılı)
- Barkod tarama (kamera + manuel)
- AR "Odanızda Dene" — gerçek FurniMesh GLB modelleri (lamba, vazo, saksı, palm ağacı, bonsai, minder, çerçeve, duvar lambası) runtime'da cache'e indirilip Three.js ile render; jest ile sürükle/zoom/döndür; APK boyutu küçük kalır
- Admin paneli: ürün/reyon/kampanya/mağaza/müşteri/sipariş yönetimi
- AI yardımcısı: OpenRouter üzerinden çeviri, görsel üretimi, sosyal medya paketi
- Push notification (yerel demo)
- Story/Flyer sistemi
- Offline-first (snapshot + network listener)
- AsyncStorage ile tüm state persist
- Docker + nginx ile statik web dağıtımı
- iOS, Android, Web için aynı kod tabanı

---

## 14. Neler Yok / Eksikler ❌

1. **Gerçek backend/sunucu yok** — tüm veri mock + AsyncStorage. Çoklu cihaz senkronizasyonu, gerçek ödeme, gerçek kurye ataması yok.
2. **Gerçek auth yok** — OTP demo (`12345`), sadece client-side `accounts` map.
3. **Gerçek push yok** — yalnızca yerel `expo-notifications`; sunucu tarafı bildirim tetikleme yok.
4. **Gerçek harita verisi yok** — kurye konumu `lerp` ile simüle ediliyor.
5. **Gerçek GLB/3D pipeline var** — FurniMesh GLB modelleri runtime'da indirilip cache'leniyor, Three.js ile render ediliyor. Gıda ürünleri için Khronos duck/avocado/boombox sample mesh'leri kullanılıyor.
6. **Çoklu dil çevirileri eşit değil** — TR çevirileri var ama tam audit gerekir; örneğin bazı bileşenlerde hard-coded Arapça var.
7. **Web (Vite) gerçek router kullanılmıyor** — `src/pages/*` ve `vite.config.js` eski web prototipinden kalma; aktif giriş `expo export` üzerinden.
8. **E2E test / unit test yok** — yalnızca manuel demo.
9. **CI/CD pipeline tanımı yok** (GitHub Actions vb.) — yalnızca Dockerfile + docker-compose.
10. **iOS `Podfile` yok** — `expo prebuild` ile üretilebilir ama repoda mevcut değil (`expo run:ios` çalıştırınca üretir).
11. **EAS / OTA update yapılandırması yok**.
12. **App icon/splash üretim scripti var ama `sharp` devDependency** — `npm install` ile çalışır.
13. **`_toters_dump` ve `scripts/fresh-extra-products.js`** — eski Toters (esin kaynağı) veri dump'ı, kalıntı.
14. **Erişilebilirlik (accessibility) etiketleri bazı yerlerde eksik**.
15. **Storybook / design system paketlenmesi yok**.

---

## 15. Genel Değerlendirme

**M10**, tek başına çalışan, demo amaçlı, tam işlevsel bir **Irak süpermarket + hizmet** prototipidir. Müşteri/kurye/admin için uçtan uca akışlar, AI entegrasyonu (OpenRouter), AR önizleme, çoklu dil (TR dahil), offline çalışma ve Docker deploy hattı içerir. Gerçek bir üretim uygulamasına dönüştürmek için backend entegrasyonu, gerçek ödeme sağlayıcı, gerçek harita API'si ve test altyapısı eklemek gerekir; mevcut haliyle demo, MVP veya tasarım doğrulama amacıyla idealdir.
