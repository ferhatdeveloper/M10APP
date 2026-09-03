// Sistem dokümantasyonu slaytları — M10 uygulamasının gerçek ekranlarını
// telefon mockup'ı içinde gösterir. 11 slayt, 3 dil (TR/EN/AR).

// Gerçek ekran görüntüleri (uygulamadan alınmış PNG'ler).
// Her slayt için elde hazır PNG varsa `image` alanı kullanılır, yoksa
// `mock` alanındaki MockXxx bileşeni PhoneMockup'a children olarak geçilir.
// `previewUrl` alanı sadece "Tam önizleme" modal'ı içindir — canlı
// apk.retailex.app'ı tam ekran iframe'de gösterir (sunumdaki telefon
// çerçevesinin içinde değil).
const IMG = {
  language: require('../../assets/presentation/language.png'),
  permissions: require('../../assets/presentation/permissions.png'),
  home: require('../../assets/presentation/home.png'),
  butler: require('../../assets/presentation/butler.png'),
  orders: require('../../assets/presentation/orders.png'),
  flyer: require('../../assets/presentation/flyer.png'),
  profileGuest: require('../../assets/presentation/profile-guest.png'),
}

// Tek bir canlı önizleme URL'i — tüm slaytlar aynı SPA'ya düşer, modal'da
// gösterildiği için sorun değil; her seferinde ilgili ekrana manuel
// gidilir. (apk.retailex.app/<sayfa> nginx fallback nedeniyle her path
// için aynı içerik döndürüyor.)
const LIVE_APP = 'https://apk.retailex.app/'

export const PRESENTATION_META = {
  title: 'Sistem Dokümantasyonu',
  subtitle: 'M10 — Süpermarket, Market ve Hizmet Platformu',
  brand: 'M10',
  copyright: '© 2024 M10. Tüm hakları saklıdır.',
}

// Slayt tipleri:
//   - "screen" : sol sütunda telefon mockup (mock bileşeni veya PNG), sağ sütunda açıklayıcı metin
//   - "ending" : kapanış — teşekkürler + iletişim
//
// mock bileşenleri src/components/PhoneMockup.jsx içinde tanımlı.
// `image` alanı varsa gerçek ekran görüntüsünü gösterir (mock yerine).
// `previewUrl` alanı varsa "Tam önizleme" butonu görünür ve tıklandığında
// tam ekran iframe modal'ı açılır (canlı apk.retailex.app).
export const PRESENTATION_SLIDES = [
  // 1 — Dil seçimi (PNG)
  {
    type: 'screen',
    mock: 'MockLanguage',
    image: IMG.language,
    previewUrl: LIVE_APP,
    badge: '01',
    title: { tr: 'Hoş Geldiniz', en: 'Welcome', ar: 'مرحباً' },
    subtitle: {
      tr: 'M10 — Irak pazarına yönelik mobil platform',
      en: 'M10 — mobile platform for the Iraqi market',
      ar: 'M10 — منصة الجوال للسوق العراقي',
    },
    body: {
      tr:
        'M10; süpermarket, pazar ve hizmet kategorilerini tek bir uygulamada birleştirir. Açılışta kullanıcı dilini seçer (Arapça varsayılan, İngilizce, Türkçe) ve tüm arayüz anında o dile ve yöne (RTL/LTR) geçer.',
      en:
        'M10 unifies supermarket, market and services in one app. On launch the user picks a language (Arabic default, English, Turkish) and the whole UI instantly switches to that language and direction.',
      ar:
        'تجمع M10 السوبر ماركت والسوق والخدمات في تطبيق واحد. عند الفتح يختار المستخدم اللغة وتتحول الواجهة فوراً إلى تلك اللغة واتجاهها.',
    },
    bullets: [
      { tr: '3 dil (AR · EN · TR)', en: '3 languages (AR · EN · TR)', ar: '3 لغات' },
      { tr: 'Otomatik RTL/LTR', en: 'Auto RTL/LTR', ar: 'اتجاه تلقائي' },
      { tr: 'Telefon + OTP ile giriş', en: 'Phone + OTP login', ar: 'دخول بالهاتف وOTP' },
    ],
  },

  // 2 — Login + OTP (PNG yok → MockLogin)
  {
    type: 'screen',
    mock: 'MockLogin',
    previewUrl: LIVE_APP,
    badge: '02',
    title: { tr: 'Giriş Akışı', en: 'Login Flow', ar: 'تسجيل الدخول' },
    subtitle: {
      tr: 'Demo OTP ve üç rol ile hızlı giriş',
      en: 'Demo OTP and three roles',
      ar: 'OTP تجريبي وثلاثة أدوار',
    },
    body: {
      tr:
        'Kullanıcı Irak telefon numarasını (+964) girer, OTP ekranına yönlendirilir. Demo OTP 12345 ve 3 hazır hesap (müşteri / kurye / admin) ekran altında listelenir. PIN 1234 admin için.',
      en:
        'User enters an Iraqi phone number (+964), lands on OTP screen. Demo OTP 12345 and three ready accounts (customer / courier / admin) are listed below. PIN 1234 for admin.',
      ar:
        'يدخل المستخدم رقم هاتف عراقي (+964) وينتقل لشاشة OTP. يتوفر OTP تجريبي 12345 وثلاثة حسابات جاهزة (عميل / سائق / إدارة).',
    },
    bullets: [
      { tr: 'OTP 12345 · 45 sn geri sayım', en: 'OTP 12345 · 45s countdown', ar: 'OTP 12345 · عدّاد 45ث' },
      { tr: 'Apple/Google sahte sağlayıcı', en: 'Mock Apple/Google provider', ar: 'مزود وهمي' },
      { tr: 'Admin PIN 1234', en: 'Admin PIN 1234', ar: 'رمز الإدارة 1234' },
    ],
  },

  // 3 — Anasayfa (PNG)
  {
    type: 'screen',
    mock: 'MockHome',
    image: IMG.home,
    previewUrl: LIVE_APP,
    badge: '03',
    title: { tr: 'Anasayfa', en: 'Home', ar: 'الرئيسية' },
    subtitle: {
      tr: 'Story, kampanya, M10+ banner, reyonlar',
      en: 'Stories, campaigns, M10+ banner, aisles',
      ar: 'قصص وحملات وبانر M10+ وأقسام',
    },
    body: {
      tr:
        'Story halkaları, M10+ abonelik bannerı, arama alanı, reyon ızgarası ve aktif kampanyalar tek ekranda. Alt sekme bar 5 sekmeli (Anasayfa · Ara · Şoför · Siparişler · Hesap).',
      en:
        'Story rings, M10+ subscription banner, search field, aisle grid and active campaigns on one screen. Bottom tab bar has 5 tabs (Home · Search · Butler · Orders · Profile).',
      ar:
        'حلقات القصص وبانر M10+ وحقل البحث وشبكة الأقسام والحملات النشطة في شاشة واحدة. شريط سفلي بخمسة تبويبات.',
    },
    bullets: [
      { tr: '5 sekmeli alt bar', en: '5-tab bottom bar', ar: 'شريط سفلي بخمسة تبويبات' },
      { tr: 'Story halkaları (5+)', en: 'Story rings (5+)', ar: 'حلقات القصص (5+)' },
      { tr: 'M10+ banner', en: 'M10+ banner', ar: 'بانر M10+' },
    ],
  },

  // 4 — Mağaza içi (PNG yok → MockStore)
  {
    type: 'screen',
    mock: 'MockStore',
    previewUrl: LIVE_APP,
    badge: '04',
    title: { tr: 'Mağaza İçi', en: 'Store', ar: 'داخل المتجر' },
    subtitle: {
      tr: 'Reyon sekmeleri ve ürün ızgarası',
      en: 'Aisle tabs and product grid',
      ar: 'تبويبات الأقسام وشبكة المنتجات',
    },
    body: {
      tr:
        '5 mağaza, 13 kategori, ~1.530 ürün. Her mağazada reyon sekmeleri, ürün kartında fiyat + miktar stepper + "stokta yok" durumu + AR rozeti. Stok ve fiyat admin panelinden yönetilir.',
      en:
        '5 stores, 13 categories, ~1,530 products. Each store shows aisle tabs; product card has price + qty stepper + out-of-stock badge + AR badge. Stock and price managed from admin.',
      ar:
        '5 متاجر و13 فئة وحوالي 1,530 منتج. تبويبات الأقسام وبطاقات المنتج مع شارات AR والمخزون.',
    },
    bullets: [
      { tr: '5 mağaza · 13 kategori', en: '5 stores · 13 categories', ar: '5 متاجر · 13 فئة' },
      { tr: '1.530+ ürün', en: '1,530+ products', ar: 'أكثر من 1,530 منتج' },
      { tr: 'AR rozetli ürünler', en: 'AR-badge products', ar: 'منتجات مع شارة AR' },
    ],
  },

  // 5 — Sepet (PNG yok → MockCart)
  {
    type: 'screen',
    mock: 'MockCart',
    previewUrl: LIVE_APP,
    badge: '05',
    title: { tr: 'Sepet', en: 'Cart', ar: 'السلة' },
    subtitle: {
      tr: 'Kupon, ücretsiz teslimat eşiği, alt toplam',
      en: 'Coupon, free delivery threshold, subtotal',
      ar: 'كوبون وحد التوصيل المجاني والإجمالي',
    },
    body: {
      tr:
        'Ücretsiz teslimata kalan tutar yeşil progress olarak gösterilir (eşik 25.000 IQD). Kupon alanı, mağaza değiştir uyarısı ve cüzdandan ödeme seçeneği. Sepet AsyncStorage\'da kalıcı.',
      en:
        'Amount remaining for free delivery shown as a green progress bar (threshold 25,000 IQD). Coupon field, store-switch warning and wallet payment. Cart persists in AsyncStorage.',
      ar:
        'يعرض المبلغ المتبقي للتوصيل المجاني كشريط أخضر (الحد 25,000 د.ع). حقل كوبون وتحذير تبديل المتجر.',
    },
    bullets: [
      { tr: 'Ücretsiz teslimat eşiği', en: 'Free delivery threshold', ar: 'حد التوصيل المجاني' },
      { tr: 'Kupon sistemi', en: 'Coupon system', ar: 'نظام الكوبونات' },
      { tr: 'Cüzdan entegrasyonu', en: 'Wallet integration', ar: 'تكامل المحفظة' },
    ],
  },

  // 6 — Checkout (PNG yok → MockCheckout)
  {
    type: 'screen',
    mock: 'MockCheckout',
    previewUrl: LIVE_APP,
    badge: '06',
    title: { tr: 'Ödeme', en: 'Checkout', ar: 'الدفع' },
    subtitle: {
      tr: 'Adres, teslimat saati, 4 ödeme yöntemi',
      en: 'Address, delivery slot, 4 payment methods',
      ar: 'العنوان ووقت التوصيل و4 طرق دفع',
    },
    body: {
      tr:
        '6 farklı 2-saatlik teslimat penceresi seçilebilir. 4 ödeme yöntemi: Cüzdan (başlangıç 15.000 IQD), Nakit, Kart, Apple/Google Pay. Cüzdan seçilirse otomatik düşüm yapılır.',
      en:
        '6 different 2-hour delivery windows. 4 payment methods: Wallet (15,000 IQD starter), Cash, Card, Apple/Google Pay. Wallet auto-deducts.',
      ar:
        '6 نوافذ توصيل مختلفة. 4 طرق دفع: المحفظة والنقد والبطاقة وApple/Google Pay.',
    },
    bullets: [
      { tr: '6 teslimat slotu', en: '6 delivery slots', ar: '6 نوافذ توصيل' },
      { tr: 'Nakit / Kart / Cüzdan / Apple/Google', en: 'Cash / Card / Wallet / Apple/Google', ar: 'نقد / بطاقة / محفظة / Apple/Google' },
      { tr: 'Otomatik cüzdan düşümü', en: 'Auto wallet deduction', ar: 'خصم تلقائي من المحفظة' },
    ],
  },

  // 7 — Sipariş takibi (PNG yok → MockTracking)
  {
    type: 'screen',
    mock: 'MockTracking',
    previewUrl: LIVE_APP,
    badge: '07',
    title: { tr: 'Canlı Sipariş Takibi', en: 'Live Order Tracking', ar: 'تتبع الطلب المباشر' },
    subtitle: {
      tr: 'Kurye harita üzerinde, adım göstergesi',
      en: 'Courier on map, step indicator',
      ar: 'السائق على الخريطة ومؤشر الخطوات',
    },
    body: {
      tr:
        'react-native-maps ile varış + kurye marker + polyline. Kurye lerp animasyonu ile gerçek zamanlı hareket eder. 4 adımlı gösterge (Alındı → Hazırlanıyor → Yolda → Teslim). Teslim sonrası otomatik anket açılır.',
      en:
        'Arrival + courier marker + polyline via react-native-maps. Courier moves in real-time with lerp animation. 4 steps (Received → Preparing → On the way → Delivered). Auto survey after delivery.',
      ar:
        'علامة الوصول والسائق ومسار. حركة السائق في الوقت الحقيقي عبر lerp. 4 خطوات وبعد التسليم استبيان تلقائي.',
    },
    bullets: [
      { tr: 'Canlı harita (lerp animasyon)', en: 'Live map (lerp animation)', ar: 'خريطة حية' },
      { tr: '4 adımlı gösterge', en: '4-step indicator', ar: 'مؤشر 4 خطوات' },
      { tr: 'Otomatik anket', en: 'Auto survey', ar: 'استبيان تلقائي' },
    ],
  },

  // 8 — Siparişler + Plus (PNG var)
  {
    type: 'screen',
    mock: 'MockOrders',
    image: IMG.orders,
    previewUrl: LIVE_APP,
    badge: '08',
    title: { tr: 'Siparişler & M10+', en: 'Orders & M10+', ar: 'الطلبات وM10+' },
    subtitle: {
      tr: 'Geçmiş siparişler, yeniden sipariş, abonelik',
      en: 'Order history, reorder, subscription',
      ar: 'سجل الطلبات وإعادة الطلب والاشتراك',
    },
    body: {
      tr:
        'Geçmiş siparişler liste halinde; yeniden sipariş, iptal, puan, iade, mağaza+kurye puanlama. M10+ abonelik (5.000 IQD/30 gün) ücretsiz teslimat + özel kampanyalar + öncelikli şoför sağlar.',
      en:
        'Historical orders in a list; reorder, cancel, points, returns, store + courier rating. M10+ subscription (5,000 IQD / 30 days) gives free delivery + exclusive campaigns + priority courier.',
      ar:
        'الطلبات السابقة في قائمة. إعادة الطلب والإلغاء والنقاط والمرتجعات. اشتراك M10+ (5,000 د.ع / 30 يوم).',
    },
    bullets: [
      { tr: 'Yeniden sipariş ver', en: 'Reorder', ar: 'إعادة الطلب' },
      { tr: 'Mağaza + kurye puanı', en: 'Store + courier rating', ar: 'تقييم المتجر والسائق' },
      { tr: 'M10+ abonelik', en: 'M10+ subscription', ar: 'اشتراك M10+' },
    ],
  },

  // 9 — Şoför hizmeti (PNG var)
  {
    type: 'screen',
    mock: 'MockButler',
    image: IMG.butler,
    previewUrl: LIVE_APP,
    badge: '09',
    title: { tr: 'Şoför Hizmeti', en: 'Butler Service', ar: 'خدمة السائق' },
    subtitle: {
      tr: 'Market dışı özel görevler için ikinci sekme',
      en: 'Second tab for off-market custom jobs',
      ar: 'تبويب ثانٍ لمهام خارج السوق',
    },
    body: {
      tr:
        'Pazardan almak, bir yere bırakmak, evrak götürmek gibi market dışı işler için ayrı bir akış. Kullanıcı başlangıç ve bitiş noktası girer, kurye atanır, harita üzerinden canlı takip edilir.',
      en:
        'A separate flow for off-market jobs: pick up from a market, drop off somewhere, paperwork. User enters start and end, courier is assigned, live tracking on map.',
      ar:
        'تدفق منفصل للمهام خارج السوق: استلام من سوق أو توصيل أو معاملات. يدخل المستخدم نقطتي البداية والنهاية ويُسند السائق.',
    },
    bullets: [
      { tr: 'Pazar dışı görevler', en: 'Off-market jobs', ar: 'مهام خارج السوق' },
      { tr: 'Canlı takip', en: 'Live tracking', ar: 'تتبع مباشر' },
      { tr: 'Mesafe + fiyat hesabı', en: 'Distance + price calc', ar: 'حساب المسافة والسعر' },
    ],
  },

  // 10 — Admin (PNG yok → MockAdmin)
  {
    type: 'screen',
    mock: 'MockAdmin',
    previewUrl: LIVE_APP,
    badge: '10',
    title: { tr: 'Admin Paneli', en: 'Admin Panel', ar: 'لوحة الإدارة' },
    subtitle: {
      tr: '8 modül + AI asistan',
      en: '8 modules + AI assistant',
      ar: '8 وحدات + مساعد ذكاء اصطناعي',
    },
    body: {
      tr:
        'Overview, Kategoriler, Ürünler, Müşteriler, Kampanyalar, Siparişler, Mağazalar ve AI. OpenRouter üzerinden çeviri (TR/EN/AR), görsel üretimi (/images + Gemini 2.5 Flash) ve Instagram/TikTok sosyal paket.',
      en:
        'Overview, Categories, Products, Customers, Campaigns, Orders, Stores, AI. Translation (TR/EN/AR) and image generation (/images + Gemini 2.5 Flash) and Instagram/TikTok social pack via OpenRouter.',
      ar:
        'نظرة عامة وفئات ومنتجات وعملاء وحملات وطلبات ومتاجر وذكاء اصطناعي. ترجمة وصور وحزم اجتماعية عبر OpenRouter.',
    },
    bullets: [
      { tr: '8 modül', en: '8 modules', ar: '8 وحدات' },
      { tr: 'OpenRouter çeviri', en: 'OpenRouter translate', ar: 'ترجمة OpenRouter' },
      { tr: 'Gemini görsel üretimi', en: 'Gemini image gen', ar: 'توليد صور Gemini' },
    ],
  },

  // 11 — Profil + Dokümantasyon girişi (PNG var)
  {
    type: 'screen',
    mock: 'MockProfile',
    image: IMG.profileGuest,
    previewUrl: LIVE_APP,
    badge: '11',
    title: { tr: 'Hesap & Çok Dilli', en: 'Profile & Multilingual', ar: 'الحساب واللغات' },
    subtitle: {
      tr: 'Cüzdan, M10+, puan, dil/yön ayarı, dokümantasyon',
      en: 'Wallet, M10+, points, language/direction, docs',
      ar: 'المحفظة وM10+ والنقاط واللغة والتوثيق',
    },
    body: {
      tr:
        'Cüzdan (top-up 5K/10K/25K), puan sistemi (Gold/Silver/Bronze tier), ödül kataloğu, 9 ödül, davet sistemi (M10-XXXX). Dil seçimi ve RTL/LTR ayarı. Sistem Dokümantasyonu bu menüden erişilebilir.',
      en:
        'Wallet (top-up 5K/10K/25K), points (Gold/Silver/Bronze tier), rewards catalog, 9 rewards, referral (M10-XXXX). Language pick and RTL/LTR. System Documentation is accessible from this menu.',
      ar:
        'المحفظة (شحن 5K/10K/25K) والنقاط (ذهبي/فضي/برونزي) والمكافآت والدعوات. اختيار اللغة والاتجاه. توثيق النظام متاح من هنا.',
    },
    bullets: [
      { tr: 'Cüzdan + puan + ödül', en: 'Wallet + points + rewards', ar: 'محفظة + نقاط + مكافآت' },
      { tr: 'Dil + yön ayarı', en: 'Language + direction', ar: 'اللغة + الاتجاه' },
      { tr: 'Davet sistemi (M10-XXXX)', en: 'Referral (M10-XXXX)', ar: 'دعوة (M10-XXXX)' },
    ],
  },
]

export const PRESENTATION_TOTAL = PRESENTATION_SLIDES.length
