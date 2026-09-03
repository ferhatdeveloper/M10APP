import { useMemo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tag, ChevronLeft, ChevronRight } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  aisles,
  flyerKicker,
  flyerSub,
  flyerTitle,
  flyers as ALL_FLYERS,
  formatIQD,
  productName,
} from '../data/mock'
import { colors, radius, shadow } from '../theme'

/**
 * Returns a localized name for an aisle id. Most aisles use a generic
 * "Campaigns" label, but a few have richer names baked into mock.js.
 */
function aisleLabel(aisleId, lang) {
  const a = aisles.find((x) => x.id === aisleId)
  if (!a) return aisleId
  if (lang === 'tr') return a.nameTr || aisleFallback(aisleId, lang)
  if (lang === 'en') return a.nameEn || aisleFallback(aisleId, lang)
  if (lang === 'ar') return a.nameAr || aisleFallback(aisleId, lang)
  return aisleFallback(aisleId, lang)
}

function aisleFallback(id, lang) {
  const dict = {
    dairy: { tr: 'Süt Ürünleri', en: 'Dairy', ar: 'منتجات الألبان' },
    coldcuts: { tr: 'Şarküteri', en: 'Cold Cuts', ar: 'لحوم باردة' },
    meat: { tr: 'Et ve Şarküteri', en: 'Meats & Deli', ar: 'لحوم ومقبلات' },
    bakery: { tr: 'Fırın', en: 'Bakery', ar: 'مخبوزات' },
    drinks: { tr: 'İçecekler', en: 'Drinks', ar: 'مشروبات' },
    pantry: { tr: 'Kiler', en: 'Pantry', ar: 'مؤن' },
    produce: { tr: 'Meyve & Sebze', en: 'Produce', ar: 'خضروات وفواكه' },
    snacks: { tr: 'Atıştırmalık', en: 'Snacks', ar: 'وجبات خفيفة' },
    frozen: { tr: 'Dondurulmuş', en: 'Frozen', ar: 'مجمدات' },
    household: { tr: 'Ev Temizlik', en: 'Household', ar: 'لوازم منزلية' },
    home: { tr: 'Ev & Yaşam', en: 'Home & Living', ar: 'منزل ومعيشة' },
    personal: { tr: 'Kişisel Bakım', en: 'Personal Care', ar: 'العناية الشخصية' },
    ready: { tr: 'Hazır Yemek', en: 'Ready Meals', ar: 'وجبات جاهزة' },
    offers: { tr: 'Kampanyalar', en: 'Offers', ar: 'عروض' },
  }
  return dict[id]?.[lang] || dict[id]?.en || id
}

export default function CampaignsScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { getLiveProducts, storeOverrides } = useApp()
  const [activeAisle, setActiveAisle] = useState('all') // 'all' | aisleId

  // Filtered set of flyers based on selected aisle.
  const filteredFlyers = useMemo(() => {
    if (activeAisle === 'all') return ALL_FLYERS
    return ALL_FLYERS.filter((f) => (f.categories || []).includes(activeAisle))
  }, [activeAisle])

  // Aisles that actually have at least one flyer — keeps the chip row short.
  const availableAisles = useMemo(() => {
    const set = new Set()
    ALL_FLYERS.forEach((f) => (f.categories || []).forEach((c) => set.add(c)))
    return [...set]
  }, [])

  // Compute discounted products for a flyer across all stores.
  const flyerProducts = useMemo(() => {
    const map = {}
    ALL_FLYERS.forEach((f) => {
      const ids = new Set(f.skus || [])
      // If the flyer also targets categories, surface any in-flyer SKU
      // within that category across the catalog. We scan the first store
      // since products are store-agnostic in the mock layer.
      const candidates = []
      // Use the user's selected store if available; otherwise Dora.
      const storeIds = ['m10-dora', 'm10-baghdad-central', 'm10-karrada']
      storeIds.forEach((sid) => {
        const live = getLiveProducts(sid) || []
        live.forEach((p) => {
          if (ids.size > 0 && !ids.has(p.id)) return
          const ovKey = `${sid}:${p.id}`
          const ov = storeOverrides?.[ovKey]
          const hasDiscount = (p.oldPrice && p.oldPrice > p.price) || (ov?.oldPrice && ov.oldPrice > (ov?.price ?? p.price))
          if (hasDiscount) candidates.push({ ...p, storeId: sid })
        })
      })
      // De-dupe by product id, keep first.
      const seen = new Set()
      map[f.id] = candidates.filter((p) => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })
    })
    return map
  }, [getLiveProducts, storeOverrides])

  const allChip = { id: 'all', label: t('campaignsAll') || 'All' }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('campaignsTitle') || 'Campaigns'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          {[allChip, ...availableAisles.map((id) => ({ id, label: aisleLabel(id, lang) }))].map((chip) => {
            const on = activeAisle === chip.id
            return (
              <SoftPress
                key={chip.id}
                onPress={() => setActiveAisle(chip.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: on ? colors.red : colors.card,
                  borderWidth: 1,
                  borderColor: on ? colors.red : colors.line,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Tag size={12} color={on ? '#fff' : colors.red} strokeWidth={2.5} />
                <Text
                  style={{
                    fontWeight: '800',
                    fontSize: 12,
                    color: on ? '#fff' : colors.ink,
                  }}
                >
                  {chip.label}
                </Text>
              </SoftPress>
            )
          })}
        </ScrollView>

        {filteredFlyers.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: colors.muted, fontWeight: '700' }}>
              {t('campaignsEmpty') || 'No campaigns in this category yet.'}
            </Text>
          </View>
        ) : null}

        {filteredFlyers.map((f) => {
          const products = flyerProducts[f.id] || []
          const cats = (f.categories || []).map((id) => aisleLabel(id, lang))
          return (
            <View key={f.id} style={{ marginTop: 14 }}>
              {/* Flyer header */}
              <SoftPress
                onPress={() => navigation.navigate('Flyer', { id: f.id })}
                style={{
                  marginHorizontal: 16,
                  backgroundColor: colors.card,
                  borderRadius: radius,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.line,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.red,
                  ...shadow.soft,
                }}
              >
                <Text style={{ color: colors.red, fontWeight: '900', fontSize: 11, letterSpacing: 1 }}>
                  {flyerKicker(f, lang)}
                </Text>
                <Text style={{ color: colors.ink, fontWeight: '900', fontSize: 17, marginTop: 4 }}>
                  {flyerTitle(f, lang)}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
                  {flyerSub(f, lang)}
                </Text>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}
                >
                  {cats.map((c) => (
                    <View
                      key={c}
                      style={{
                        backgroundColor: colors.bg,
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderColor: colors.line,
                      }}
                    >
                      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>{c}</Text>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>
                    {(f.skus || []).length || products.length} {t('campaignsItems') || 'items'}
                  </Text>
                  {isRTL ? (
                    <ChevronLeft size={18} color={colors.red} />
                  ) : (
                    <ChevronRight size={18} color={colors.red} />
                  )}
                </View>
              </SoftPress>

              {/* Horizontal product strip */}
              {products.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    gap: 10,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  }}
                >
                  {products.slice(0, 8).map((p) => (
                    <FlyerProductCard
                      key={p.id}
                      p={p}
                      lang={lang}
                      isRTL={isRTL}
                      onPress={() => navigation.navigate('Product', { storeId: p.storeId, productId: p.id })}
                    />
                  ))}
                </ScrollView>
              ) : null}
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

function FlyerProductCard({ p, lang, isRTL, onPress }) {
  const oldP = p.oldPrice
  const curP = p.price
  const off = oldP && oldP > curP ? Math.round(((oldP - curP) / oldP) * 100) : null
  return (
    <SoftPress
      onPress={onPress}
      style={{
        width: 140,
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.line,
        ...shadow.soft,
      }}
    >
      <View style={{ position: 'relative' }}>
        <ProductImage uri={p.image} aisle={p.aisle} style={{ width: 120, height: 100, borderRadius: 10 }} />
        {off ? (
          <View
            style={{
              position: 'absolute',
              top: 6,
              left: isRTL ? undefined : 6,
              right: isRTL ? 6 : undefined,
              backgroundColor: colors.red,
              borderRadius: 999,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 10 }}>−{off}%</Text>
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={2}
        style={{ fontWeight: '800', fontSize: 12, marginTop: 6, minHeight: 32, color: colors.ink }}
      >
        {productName(p, lang)}
      </Text>
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'baseline',
          gap: 6,
          marginTop: 4,
        }}
      >
        <Text style={{ color: colors.red, fontWeight: '900', fontSize: 13 }}>{formatIQD(curP, lang)}</Text>
        {oldP && oldP > curP ? (
          <Text style={{ color: colors.muted, fontSize: 11, textDecorationLine: 'line-through' }}>
            {formatIQD(oldP, lang)}
          </Text>
        ) : null}
      </View>
    </SoftPress>
  )
}
