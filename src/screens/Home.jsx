/**
 * M10 Market — Talabat Mart yoğun Home
 * Görseller: Migros Sanal Market ürün CDN (demo)
 * App bar: orijinal TopBar + beyaz M10 Logo
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Snowflake, Zap } from 'lucide-react-native'
import SoftPress from '../components/SoftPress'
import TopBar from '../components/TopBar'
import SearchField from '../components/SearchField'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { DEFAULT_STORE_ID, formatIQD, getNearestStore } from '../data/mock'
import { nescafeBannerImg } from '../utils/images'
import { colors } from '../theme'
import {
  BEVERAGES,
  BEST_SELLERS,
  BRANDS,
  BUY_AGAIN,
  CATEGORIES,
  CATEGORIES_PAGE2,
  CLEANING,
  DAIRY,
  EXPLORE,
  LOGO_BRANDS,
  NESCAFE_ROW,
  PROMOS,
  SNACKS,
  TOP_SAVERS,
  WORLD,
} from '../data/martCatalog'

const { width: W } = Dimensions.get('window')
const PAD = 16
const GAP = 10

/** Şartname palette — Pantone 2347 C / 116 C / 1365 C / 2287 C */
const C = {
  bg: colors.card,
  ink: colors.ink,
  muted: colors.muted,
  soft: colors.bg,
  line: colors.line,
  cream: '#F5EFE6',
  orange: colors.orange,
  red: colors.red,
  green: colors.open,
  lime: colors.yellow,
}

const label = (p, lang) => p.names?.[lang] || p.names?.en || p.name || ''

function AddBtn({ onPress, size = 32 }) {
  return (
    <SoftPress
      onPress={onPress}
      hitSlop={8}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
    >
      <Text style={{ color: C.orange, fontWeight: '900', fontSize: size * 0.55, marginTop: -1 }}>+</Text>
    </SoftPress>
  )
}

function SectionTitle({ title, action, onAction }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: PAD, marginBottom: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink, letterSpacing: -0.2 }}>{title}</Text>
      {action ? (
        <SoftPress onPress={onAction}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: C.ink,
              textDecorationLine: 'underline',
              textDecorationColor: C.lime,
            }}
          >
            {action}
          </Text>
        </SoftPress>
      ) : null}
    </View>
  )
}

/** Talabat tarzı Flash Sale — app bar / arama altı şerit + geri sayım */
function FlashSaleHeader({ title, endsInLabel, secondsLeft, isRTL, onPress }) {
  const h = Math.floor(secondsLeft / 3600)
  const m = Math.floor((secondsLeft % 3600) / 60)
  const s = secondsLeft % 60
  const pad = (n) => String(n).padStart(2, '0')
  const cells = [pad(h), pad(m), pad(s)]
  return (
    <SoftPress
      onPress={onPress}
      style={{
        marginHorizontal: PAD,
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: C.lime,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: C.red,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Zap size={16} color="#fff" fill="#fff" strokeWidth={2.4} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ color: C.ink, fontWeight: '900', fontSize: 15 }}>{title}</Text>
        <Text style={{ color: 'rgba(22,22,22,0.7)', fontWeight: '600', fontSize: 11, marginTop: 1 }}>
          {endsInLabel}
        </Text>
      </View>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
        {cells.map((cell, i) => (
          <View key={`${i}-${cell}`} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 3 }}>
            {i > 0 ? <Text style={{ color: C.ink, fontWeight: '900', fontSize: 12 }}>:</Text> : null}
            <View
              style={{
                minWidth: 26,
                paddingHorizontal: 4,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: 'rgba(0,0,0,0.12)',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: C.ink, fontWeight: '900', fontSize: 13, fontVariant: ['tabular-nums'] }}>{cell}</Text>
            </View>
          </View>
        ))}
      </View>
    </SoftPress>
  )
}

/** Tek banner — yatay kaydırma / otomatik geçiş (Talabat hero) */
function BrandBannerCarousel({ items, onPress }) {
  const [page, setPage] = useState(0)
  const scrollRef = useRef(null)
  const pageRef = useRef(0)
  const bannerW = W - PAD * 2
  const bannerH = Math.round(bannerW * 0.42)

  useEffect(() => {
    if (!items?.length) return undefined
    const id = setInterval(() => {
      const next = (pageRef.current + 1) % items.length
      pageRef.current = next
      setPage(next)
      scrollRef.current?.scrollTo({ x: next * W, animated: true })
    }, 4200)
    return () => clearInterval(id)
  }, [items?.length])

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / W)
          pageRef.current = next
          setPage(next)
        }}
      >
        {items.map((item) => (
          <View key={item.id} style={{ width: W, paddingHorizontal: PAD }}>
            <SoftPress
              onPress={onPress}
              style={{
                width: bannerW,
                height: bannerH,
                borderRadius: 18,
                overflow: 'hidden',
                backgroundColor: C.cream,
              }}
            >
              <Text
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 18,
                  zIndex: 2,
                  fontSize: 22,
                  fontWeight: '900',
                  color: C.ink,
                }}
              >
                {item.name}
              </Text>
              <Image
                source={item.image}
                style={{ position: 'absolute', right: 18, top: 18, bottom: 28, width: bannerW * 0.42 }}
                resizeMode="contain"
              />
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 22,
                  backgroundColor: C.red,
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                }}
              />
            </SoftPress>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 6 }}>
        {items.map((item, i) => (
          <View
            key={`dot-${item.id}`}
            style={{
              width: i === page ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === page ? C.lime : C.line,
            }}
          />
        ))}
      </View>
    </View>
  )
}

function ProductChip({ product, lang, onAdd, width = 118, showSave }) {
  return (
    <View style={{ width, marginRight: 12 }}>
      <View style={{ width, height: width, borderRadius: 16, backgroundColor: C.soft, overflow: 'hidden' }}>
        <Image source={product.image} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        {showSave && product.save ? (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: C.lime,
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.ink }}>Save {product.save}%</Text>
          </View>
        ) : null}
        <View style={{ position: 'absolute', right: 8, bottom: 8 }}>
          <AddBtn onPress={onAdd} size={30} />
        </View>
      </View>
      <Text numberOfLines={2} style={{ marginTop: 8, fontSize: 13, fontWeight: '700', color: C.ink, lineHeight: 17, minHeight: 34 }}>
        {label(product, lang)}
      </Text>
      <Text style={{ marginTop: 2, fontSize: 14, fontWeight: '800', color: C.ink }}>{formatIQD(product.price, lang)}</Text>
      {product.old ? (
        <Text style={{ fontSize: 11, color: C.muted, textDecorationLine: 'line-through' }}>{formatIQD(product.old, lang)}</Text>
      ) : null}
    </View>
  )
}

function ProductRow({ title, action, onAction, products, lang, onAdd, showSave }) {
  return (
    <View style={{ marginTop: 22 }}>
      <SectionTitle title={title} action={action} onAction={onAction} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD }}>
        {products.map((p, i) => (
          <ProductChip key={`${p.id}-${i}`} product={p} lang={lang} onAdd={() => onAdd(p)} showSave={showSave} />
        ))}
      </ScrollView>
    </View>
  )
}

/** Talabat-style category tile: 3 ürün kolajı — beyaz zemin (Migros beyaz arka planıyla kaynansın) */
function CategoryTile({ item, size, lang, onPress }) {
  const imgs = item.images?.length ? item.images : [item.image]
  const pad = 4
  return (
    <SoftPress onPress={onPress} style={{ width: size, alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#EEEEEE',
        }}
      >
        {imgs.length >= 3 ? (
          <View style={{ flex: 1, flexDirection: 'row', padding: pad }}>
            <View style={{ flex: 1.2, marginRight: 2, justifyContent: 'center' }}>
              <Image source={imgs[0]} style={{ width: '100%', height: '92%' }} resizeMode="contain" />
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
              <Image source={imgs[1]} style={{ width: '100%', height: '48%' }} resizeMode="contain" />
              <Image source={imgs[2]} style={{ width: '100%', height: '48%' }} resizeMode="contain" />
            </View>
          </View>
        ) : (
          <Image source={imgs[0]} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        )}
        {item.snow ? (
          <View style={{ position: 'absolute', top: 6, right: 6 }}>
            <Snowflake size={13} color={C.orange} fill={C.orange} />
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={2}
        style={{
          marginTop: 6,
          fontSize: 11,
          fontWeight: '700',
          color: C.ink,
          textAlign: 'center',
          lineHeight: 14,
          minHeight: 28,
        }}
      >
        {label(item, lang)}
      </Text>
    </SoftPress>
  )
}

/** 3×4 paging grid + bottom pill indicator (Talabat Shop by category) */
function CategoryPager({ pages, lang, onPress }) {
  const [page, setPage] = useState(0)
  const pageW = W
  const tile = Math.floor((W - PAD * 2 - GAP * 3) / 4)
  const rowH = tile + 36
  const gridH = rowH * 3 + 4

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x
          setPage(Math.round(x / pageW))
        }}
      >
        {pages.map((cats, pi) => (
          <View key={`catpage-${pi}`} style={{ width: pageW, paddingHorizontal: PAD }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, minHeight: gridH }}>
              {cats.map((c) => (
                <CategoryTile key={c.id} item={c} size={tile} lang={lang} onPress={onPress} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 0 }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#E0E0E0',
            overflow: 'hidden',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: 18,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.ink,
              marginLeft: page === 0 ? 0 : 18,
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { lang, t, isRTL } = useI18n()
  const { addToCart, cartCount, cartTotal, cartStore, user } = useApp()
  const storeId = useMemo(() => getNearestStore(user?.address)?.id || DEFAULT_STORE_ID, [user?.address])
  const minOrder = Number(cartStore?.minOrder) || 0
  const remain = minOrder > 0 ? Math.max(0, minOrder - (cartTotal || 0)) : 0

  /** Flash sale geri sayım — her açılışta ~2 saat (demo) */
  const [flashLeft, setFlashLeft] = useState(2 * 60 * 60 + 14 * 60 + 37)
  useEffect(() => {
    const id = setInterval(() => setFlashLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  const logoTile = Math.floor((W - PAD * 2 - GAP * 3) / 4)
  const exploreW = Math.floor((W - PAD * 2 - GAP) / 2)
  const categoryPages = useMemo(() => [CATEGORIES, CATEGORIES_PAGE2], [])
  const flashProducts = useMemo(() => TOP_SAVERS.slice(0, 8), [])

  const go = (screen, params) => navigation.navigate(screen, params)
  const goStore = () => navigation.navigate('Store', { id: storeId })
  const goSearch = () => navigation.navigate('SearchTab')
  const onAdd = (p) => {
    if (!p?.id) return
    const img = typeof p.image === 'string' ? p.image : p.image?.uri
    const name = p.names?.tr || p.names?.en || p.name || p.id
    addToCart(storeId, p.id, 1, {
      unitPrice: p.price,
      product: {
        id: p.id,
        nameTr: name,
        nameEn: p.names?.en || name,
        nameAr: p.names?.ar || name,
        names: p.names,
        price: p.price,
        image: img,
        aisle: 'produce',
        stock: 99,
      },
    })
  }

  const L = {
    viewAll: lang === 'tr' ? 'Tümü' : lang === 'ar' ? 'عرض الكل' : 'View all',
    buyAgain: lang === 'tr' ? 'Tekrar al' : lang === 'ar' ? 'اشترِ مجدداً' : 'Buy again',
    best: lang === 'tr' ? 'Yakınındaki en çok satanlar 🔥' : lang === 'ar' ? 'الأكثر مبيعاً قربك 🔥' : 'Best sellers near you 🔥',
    shopCat: lang === 'tr' ? 'Kategoriye göre alışveriş' : lang === 'ar' ? 'تسوّق حسب القسم' : 'Shop by category',
    shopBrand: lang === 'tr' ? 'Markaya göre alışveriş' : lang === 'ar' ? 'تسوّق حسب العلامة' : 'Shop by brand',
    world: lang === 'tr' ? 'Dünyadan lezzetler' : lang === 'ar' ? 'من حول العالم' : 'Around the world',
    savers: lang === 'tr' ? 'En iyi fırsatlar' : lang === 'ar' ? 'أفضل العروض' : 'Top savers',
    dairy: lang === 'tr' ? 'Süt ve yumurta' : lang === 'ar' ? 'ألبان وبيض' : 'Dairy & eggs',
    snacks: lang === 'tr' ? 'Atıştırmalıklar' : lang === 'ar' ? 'سناكات' : 'Snacks',
    drinks: lang === 'tr' ? 'İçecekler' : lang === 'ar' ? 'مشروبات' : 'Beverages',
    clean: lang === 'tr' ? 'Temizlik' : lang === 'ar' ? 'منظفات' : 'Care & clean',
    nescafe: 'NESCAFÉ',
    explore: lang === 'tr' ? "Market'i keşfet" : lang === 'ar' ? 'استكشف Market' : 'Explore Market',
    viewCart: lang === 'tr' ? 'Sepeti gör' : lang === 'ar' ? 'عرض السلة' : 'View cart',
    yourCart: lang === 'tr' ? 'Sepetin' : lang === 'ar' ? 'سلتك' : 'Your cart',
    flashSale: lang === 'tr' ? 'Flash Sale' : lang === 'ar' ? 'عروض سريعة' : 'Flash sale',
    endsIn: lang === 'tr' ? 'Bitiş' : lang === 'ar' ? 'ينتهي خلال' : 'Ends in',
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar
        showLocation
        onLocation={() => go('Addresses')}
        onBell={() => go('Notifications')}
        onProfile={() => go('ProfileTab')}
      />
      <View style={{ paddingHorizontal: PAD, paddingTop: 6, paddingBottom: 2, backgroundColor: C.bg }}>
        <SearchField
          mode="pressable"
          compact
          onPress={goSearch}
          placeholder={t('searchPlaceholder') || t('search') || L.explore}
          isRTL={isRTL}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}>
        <View style={{ backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.line }}>
          <FlashSaleHeader
            title={L.flashSale}
            endsInLabel={L.endsIn}
            secondsLeft={flashLeft}
            isRTL={isRTL}
            onPress={goStore}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 6, paddingBottom: 10 }}
          >
            {flashProducts.map((p, i) => (
              <ProductChip key={`flash-${p.id}-${i}`} product={p} lang={lang} onAdd={() => onAdd(p)} showSave width={108} />
            ))}
          </ScrollView>
        </View>

        <BrandBannerCarousel items={BRANDS} onPress={goStore} />

        <ProductRow title={L.buyAgain} action={L.viewAll} onAction={goStore} products={BUY_AGAIN} lang={lang} onAdd={onAdd} />

        {/* Talabat Shop by category — 3×4 + sayfa göstergesi */}
        <View style={{ marginTop: 22 }}>
          <SectionTitle title={L.shopCat} />
          <CategoryPager pages={categoryPages} lang={lang} onPress={goStore} />
        </View>

        {/* Marka ↔ kategori arası çift promo */}
        <View style={{ marginTop: 16, paddingHorizontal: PAD, flexDirection: 'row', gap: GAP }}>
          <SoftPress onPress={goStore} style={{ flex: 1, height: 118, borderRadius: 14, overflow: 'hidden', backgroundColor: C.soft }}>
            <Image source={require('../../assets/mart-clone/promo_bakery.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </SoftPress>
          <SoftPress onPress={goStore} style={{ flex: 1, height: 118, borderRadius: 14, overflow: 'hidden', backgroundColor: '#0A6CBA' }}>
            <Image source={require('../../assets/mart-clone/promo_hs.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </SoftPress>
        </View>

        {/* Marka logoları — 2×4 */}
        <View style={{ marginTop: 18 }}>
          <SectionTitle title={L.shopBrand} action={L.viewAll} onAction={goStore} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: PAD, gap: GAP }}>
            {LOGO_BRANDS.map((b) => (
              <SoftPress
                key={b.id}
                onPress={goStore}
                style={{
                  width: logoTile,
                  height: logoTile * 0.85,
                  borderRadius: 14,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: C.line,
                  overflow: 'hidden',
                  padding: 8,
                }}
              >
                <Image source={b.image} style={{ width: '70%', height: '55%' }} resizeMode="contain" />
                <Text style={{ marginTop: 4, fontSize: 11, fontWeight: '700', color: C.ink }} numberOfLines={1}>
                  {b.name}
                </Text>
              </SoftPress>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 22 }}>
          <SectionTitle title={L.world} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD }}>
            {WORLD.map((w) => (
              <SoftPress key={w.id} onPress={goStore} style={{ alignItems: 'center', marginRight: 16, width: 80 }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: w.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: C.line,
                  }}
                >
                  <Text style={{ fontSize: 32 }}>{w.flag}</Text>
                </View>
                <Text style={{ marginTop: 6, fontSize: 12, fontWeight: '700', color: C.ink }}>{label(w, lang)}</Text>
              </SoftPress>
            ))}
          </ScrollView>
        </View>

        <ProductRow title={L.best} action={L.viewAll} onAction={goStore} products={BEST_SELLERS} lang={lang} onAdd={onAdd} />

        {/* NESCAFÉ — Talabat yapısı: full banner + ürün şeridi */}
        <View style={{ marginTop: 22 }}>
          <SoftPress
            onPress={goStore}
            style={{
              marginHorizontal: PAD,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: '#87CEEB',
            }}
          >
            <Image
              source={nescafeBannerImg}
              style={{
                width: W - PAD * 2,
                height: Math.round((W - PAD * 2) * (303 / 800)),
              }}
              resizeMode="cover"
            />
          </SoftPress>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 12 }}
          >
            {NESCAFE_ROW.map((p, i) => (
              <ProductChip key={`nescafe-${p.id}-${i}`} product={p} lang={lang} onAdd={() => onAdd(p)} width={118} />
            ))}
          </ScrollView>
        </View>

        <ProductRow title={L.savers} action={L.viewAll} onAction={goStore} products={TOP_SAVERS} lang={lang} onAdd={onAdd} showSave />

        <SoftPress onPress={goStore} style={{ marginHorizontal: PAD, marginTop: 22, height: 120, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0D47A1' }}>
          <Image source={PROMOS[1].image} style={{ position: 'absolute', right: 0, bottom: 0, width: 150, height: 120 }} resizeMode="contain" />
          <View style={{ flex: 1, justifyContent: 'center', padding: 16, maxWidth: '58%' }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{PROMOS[1].title}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 }}>{PROMOS[1].sub}</Text>
          </View>
        </SoftPress>

        <ProductRow title={L.dairy} action={L.viewAll} onAction={goStore} products={DAIRY} lang={lang} onAdd={onAdd} />
        <ProductRow title={L.snacks} action={L.viewAll} onAction={goStore} products={SNACKS} lang={lang} onAdd={onAdd} />

        <SoftPress
          onPress={goStore}
          style={{
            marginHorizontal: PAD,
            marginTop: 22,
            height: 120,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: C.orange,
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' }}>
            <Text style={{ color: C.ink, fontWeight: '900', fontSize: 12 }}>M10 mart</Text>
            <Text style={{ color: C.orange, fontWeight: '900', fontSize: 22, marginTop: 4 }}>HOT DEALS</Text>
            <Text style={{ color: C.ink, fontWeight: '800', fontSize: 13, marginTop: 2 }}>{PROMOS[2].sub}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={PROMOS[2].image} style={{ width: 110, height: 110 }} resizeMode="contain" />
          </View>
        </SoftPress>

        <ProductRow title={L.drinks} action={L.viewAll} onAction={goStore} products={BEVERAGES} lang={lang} onAdd={onAdd} />
        <ProductRow title={L.clean} action={L.viewAll} onAction={goStore} products={CLEANING} lang={lang} onAdd={onAdd} showSave />

        <View style={{ marginTop: 22, marginBottom: 20 }}>
          <SectionTitle title={L.explore} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: PAD, justifyContent: 'space-between' }}>
            {EXPLORE.map((p, i) => (
              <View key={`explore-${p.id}-${i}`} style={{ width: exploreW, marginBottom: 14 }}>
                <View style={{ width: exploreW, height: exploreW * 0.85, borderRadius: 16, backgroundColor: C.soft, overflow: 'hidden' }}>
                  <Image source={p.image} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    <AddBtn onPress={() => onAdd(p)} size={34} />
                  </View>
                </View>
                <Text numberOfLines={2} style={{ marginTop: 8, fontSize: 13, fontWeight: '700', color: C.ink }}>
                  {label(p, lang)}
                </Text>
                <Text style={{ marginTop: 2, fontSize: 14, fontWeight: '800', color: C.ink }}>{formatIQD(p.price, lang)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {cartCount > 0 ? (
        <View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: Math.max(insets.bottom, 8) + 4,
          }}
        >
          <SoftPress
            onPress={() => go('Cart')}
            style={{
              backgroundColor: C.red,
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 10,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.22,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{cartCount}</Text>
            </View>
            <Text style={{ flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 16 }}>
              {L.viewCart}
            </Text>
            <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', paddingHorizontal: 4, maxWidth: '38%' }}>
              <Text numberOfLines={1} style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
                {formatIQD(cartTotal, lang)}
              </Text>
              {remain > 0 ? (
                <Text numberOfLines={1} style={{ color: 'rgba(255,255,255,0.88)', fontWeight: '600', fontSize: 10, marginTop: 1 }}>
                  {t('addMore', { n: formatIQD(remain, lang) })}
                </Text>
              ) : null}
            </View>
          </SoftPress>
        </View>
      ) : null}
    </View>
  )
}
