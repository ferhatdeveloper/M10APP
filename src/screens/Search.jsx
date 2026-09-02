import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Barcode, Camera as CameraIcon, Mic, Plus, SlidersHorizontal, X } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SearchField from '../components/SearchField'
import StoreCard from '../components/StoreCard'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { collections, formatIQD, getNearestStore, productName, searchCatalog, storeName } from '../data/mock'
import { colors, radius, shadow } from '../theme'

const PRICE_BUCKETS = [
  { id: 'all', max: null },
  { id: 'p1', max: 1000 },
  { id: 'p2', max: 5000 },
  { id: 'p3', max: 15000 },
  { id: 'p4', max: 50000 },
]

function matchesFilters(p, f, storeOverrides) {
  if (p.disabled) return false
  if (f.onlyOffers) {
    const oldP = Number(p.oldPrice)
    if (!(oldP > 0 && oldP > Number(p.price))) return false
  }
  if (f.onlyInStock) {
    const oKey = `${p.storeId}:${p.id}`
    const ovStock = storeOverrides?.[oKey]?.stock
    const effectiveStock = ovStock != null ? ovStock : p.stock
    if ((effectiveStock ?? 0) <= 0) return false
  }
  if (f.maxPrice != null && f.maxPrice !== undefined && Number(p.price) > Number(f.maxPrice)) {
    return false
  }
  if (f.aisles && f.aisles.length && !f.aisles.includes(p.aisle)) return false
  if (f.minRating && Number(f.minRating) > 0 && Number(p.rating || 0) < Number(f.minRating)) {
    return false
  }
  return true
}

export default function SearchScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { user, liveCatalog, liveStores, getLiveProducts, addToCart, cartCount, storeOverrides } = useApp()
  const [addedHint, setAddedHint] = useState(null)
  const [voiceListening, setVoiceListening] = useState(false)

  const VOICE_SAMPLES = ['milk', 'bread', 'cheese', 'olive oil', 'eggs', 'rice', 'tomato', 'chicken']
  const handleVoice = () => {
    if (voiceListening) return
    setVoiceListening(true)
    setTimeout(() => {
      const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)]
      setQ(sample)
      setVoiceListening(false)
    }, 1500)
  }

  useEffect(() => {
    if (!addedHint) return
    const tm = setTimeout(() => setAddedHint(null), 2200)
    return () => clearTimeout(tm)
  }, [addedHint])
  const nearestId = getNearestStore(user?.address)?.id
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({
    onlyOffers: false,
    onlyInStock: false,
    maxPrice: null,
    aisles: [],
    minRating: 0,
  })
  const [showFilters, setShowFilters] = useState(false)
  const query = q.trim().toLowerCase()

  const { matchedStores, matchedProducts } = useMemo(() => {
    if (!query) return { matchedStores: [], matchedProducts: [] }
    // searchCatalog itself already does multi-locale product/store matching
    const base = searchCatalog(query, lang)
    const filteredProducts = base.matchedProducts.filter((p) =>
      matchesFilters(p, filters, storeOverrides),
    )
    // Re-rank stores that actually contain a matched product first
    const productStoreIds = new Set(filteredProducts.map((p) => p.storeId))
    const matchedStores = base.matchedStores.filter((s) => !s.comingSoon).map((s) => ({
      ...s,
      hasMatch: productStoreIds.has(s.id),
    }))
    return { matchedStores, matchedProducts: filteredProducts }
  }, [query, lang, liveCatalog, liveStores, filters, storeOverrides])

  const activeFilterCount =
    (filters.onlyOffers ? 1 : 0) +
    (filters.onlyInStock ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    filters.aisles.length +
    (filters.minRating > 0 ? 1 : 0)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('search')} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <SearchField
              mode="input"
              value={q}
              onChangeText={setQ}
              placeholder={voiceListening ? t('voiceListening') : t('searchPlaceholder')}
              isRTL={isRTL}
              autoFocus
              onScan={() => navigation.navigate('Scan')}
              onVoice={handleVoice}
              voiceListening={voiceListening}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: activeFilterCount > 0 ? colors.redSoft : '#fff',
              borderWidth: 1,
              borderColor: activeFilterCount > 0 ? colors.red : colors.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SlidersHorizontal
              size={18}
              color={activeFilterCount > 0 ? colors.red : colors.ink}
            />
            {activeFilterCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>
                  {activeFilterCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 8,
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={() => navigation.navigate('Scan')}
            style={{
              flex: 1,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.ink,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Barcode size={18} color={colors.yellow} />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
              {t('searchByBarcode')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('VisualSearch')}
            style={{
              flex: 1,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.redSoft,
              borderWidth: 1,
              borderColor: colors.red,
            }}
          >
            <CameraIcon size={18} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>
              {t('searchByImage')}
            </Text>
          </Pressable>
        </View>

        {!query ? (
          <>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 17,
                marginTop: 18,
                marginBottom: 10,
              }}
            >
              {t('collections')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {collections.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => navigation.navigate('Store', { id: nearestId, aisle: c.aisle })}
                  style={{ width: '48%', marginBottom: 12 }}
                >
                  <ProductImage
                    uri={c.image}
                    aisle={c.aisle}
                    style={{ width: '100%', height: 110, borderRadius: 14 }}
                  />
                  <Text style={{ fontWeight: '800', marginTop: 6 }}>{t(`col.${c.id}`)}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {t(`cats.${c.aisle}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            {liveStores.filter((s) => s.status !== 'closed').map((s) => (
              <StoreCard
                key={s.id}
                store={s}
                onPress={() => navigation.navigate('Store', { id: s.id })}
              />
            ))}
          </>
        ) : null}

        {query ? (
          <Text
            style={{
              color: colors.muted,
              marginTop: 12,
              fontSize: 12,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('resultsCount', {
              n: matchedProducts.length + matchedStores.length,
            })}
          </Text>
        ) : null}

        {/* Ürünler üstte */}
        {query &&
          matchedProducts.map((p) => {
            const store = liveStores.find((s) => s.id === p.storeId)
            const oKey = `${p.storeId}:${p.id}`
            const overrideStock = storeOverrides?.[oKey]?.stock
            const effectiveStock = overrideStock != null ? overrideStock : p.stock
            const oos = (effectiveStock ?? 0) <= 0 || p.disabled
            const handleAdd = () => {
              const ok = addToCart(p.storeId, p.id)
              if (!ok) {
                if (cartCount > 0) {
                  Alert.alert(t('search'), t('searchReplaceCart'))
                } else {
                  Alert.alert(t('search'), t('searchOutOfStock'))
                }
                return
              }
              setAddedHint({ id: p.id, name: productName(p, lang), storeId: p.storeId })
            }
            return (
              <View
                key={`${p.storeId}-${p.id}`}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 10,
                  marginTop: 10,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  gap: 10,
                  ...shadow.soft,
                }}
              >
                <Pressable
                  onPress={() => navigation.navigate('Store', { id: p.storeId })}
                  style={{
                    flex: 1,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    gap: 10,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800' }} numberOfLines={2}>
                      {productName(p, lang)}
                    </Text>
                    <Text style={{ color: colors.muted }} numberOfLines={1}>
                      {store ? storeName(store, lang) : ''}
                    </Text>
                    <Text style={{ color: colors.red, fontWeight: '800', marginTop: 6 }}>
                      {formatIQD(p.price, lang)}
                    </Text>
                  </View>
                  <ProductImage
                    uri={p.image}
                    aisle={p.aisle}
                    style={{ width: 86, height: 86, borderRadius: 12 }}
                  />
                </Pressable>
                <Pressable
                  onPress={handleAdd}
                  disabled={oos}
                  style={{
                    alignSelf: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: oos ? colors.line : colors.red,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: oos ? 0.5 : 1,
                  }}
                >
                  <Plus size={20} color={oos ? colors.muted : '#fff'} />
                </Pressable>
              </View>
            )
          })}

        {/* Mağazalar altta */}
        {query && matchedStores.length > 0 ? (
          <Text
            style={{
              fontWeight: '800',
              fontSize: 16,
              marginTop: 24,
              marginBottom: 6,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('storesLabel')}
          </Text>
        ) : null}
        {query &&
          matchedStores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              onPress={() => navigation.navigate('Store', { id: s.id })}
            />
          ))}

        {query && !matchedStores.length && !matchedProducts.length ? (
          <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 40 }}>
            {t('noResults')}
          </Text>
        ) : null}
      </ScrollView>

      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        isRTL={isRTL}
        t={t}
      />

      {addedHint ? (
        <Pressable
          onPress={() => {
            const h = addedHint
            setAddedHint(null)
            navigation.navigate('Cart')
          }}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 24,
            backgroundColor: colors.ink,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            ...shadow.card,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.red,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13 }} numberOfLines={1}>
              {t('searchAdded', { name: addedHint.name })}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }} numberOfLines={1}>
              {t('searchTapToCart')}
            </Text>
          </View>
          <Pressable
            onPress={() => setAddedHint(null)}
            style={{ paddingHorizontal: 6, paddingVertical: 4 }}
          >
            <X size={16} color="#fff" />
          </Pressable>
        </Pressable>
      ) : null}
    </SafeAreaView>
  )
}

function FilterSheet({ visible, onClose, filters, setFilters, isRTL, t }) {
  const [local, setLocal] = useState(filters)

  // Reset local state every time the sheet is re-opened so that the user sees
  // the current committed filters and the Apply/Reset buttons behave correctly.
  useEffect(() => {
    if (visible) setLocal(filters)
  }, [visible, filters])

  const useLocal = useCallback((next) => setLocal(next), [])

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 16,
            paddingBottom: 30,
            maxHeight: '85%',
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '900' }}>{t('searchFilters')}</Text>
            <Pressable onPress={onClose} hitSlop={10} style={{ padding: 4 }}>
              <X size={22} color={colors.ink} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <FilterSection title={t('cats.offers')} isRTL={isRTL}>
              <Toggle
                label={t('onlyOffers')}
                value={local.onlyOffers}
                onChange={(v) => useLocal({ ...local, onlyOffers: v })}
              />
              <Toggle
                label={t('inStock')}
                value={local.onlyInStock}
                onChange={(v) => useLocal({ ...local, onlyInStock: v })}
              />
            </FilterSection>

            <FilterSection title={t('price')} isRTL={isRTL}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
                {PRICE_BUCKETS.map((b) => {
                  const on =
                    (b.max == null && local.maxPrice == null) || local.maxPrice === b.max
                  return (
                    <Pressable
                      key={b.id}
                      onPress={() => useLocal({ ...local, maxPrice: b.max })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: on ? colors.red : colors.line,
                        backgroundColor: on ? colors.redSoft : '#fff',
                      }}
                    >
                      <Text style={{ fontWeight: '700', color: on ? colors.red : colors.ink }}>
                        {b.max == null ? t('anyPrice') : `< ${formatIQD(b.max, 'ar')}`}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </FilterSection>

            <FilterSection title={t('cats.all')} isRTL={isRTL}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  'produce',
                  'dairy',
                  'meat',
                  'bakery',
                  'drinks',
                  'pantry',
                  'snacks',
                  'frozen',
                  'household',
                  'personal',
                ].map((a) => {
                  const on = local.aisles.includes(a)
                  return (
                    <Pressable
                      key={a}
                      onPress={() =>
                        useLocal({
                          ...local,
                          aisles: on
                            ? local.aisles.filter((x) => x !== a)
                            : [...local.aisles, a],
                        })
                      }
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: on ? colors.red : colors.line,
                        backgroundColor: on ? colors.redSoft : '#fff',
                      }}
                    >
                      <Text style={{ fontWeight: '700', color: on ? colors.red : colors.ink }}>
                        {t(`cats.${a}`)}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </FilterSection>

            <FilterSection title={t('topRated')} isRTL={isRTL}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
                {[0, 3.5, 4, 4.5].map((r) => {
                  const on = local.minRating === r
                  return (
                    <Pressable
                      key={r}
                      onPress={() => useLocal({ ...local, minRating: r })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: on ? colors.red : colors.line,
                        backgroundColor: on ? colors.redSoft : '#fff',
                      }}
                    >
                      <Text style={{ fontWeight: '700', color: on ? colors.red : colors.ink }}>
                        {r === 0 ? t('any') : `${r}+`}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </FilterSection>
          </ScrollView>

          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: 10,
              marginTop: 16,
            }}
          >
            <Pressable
              onPress={() =>
                useLocal({
                  onlyOffers: false,
                  onlyInStock: false,
                  maxPrice: null,
                  aisles: [],
                  minRating: 0,
                })
              }
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: radius,
                borderWidth: 1,
                borderColor: colors.line,
                backgroundColor: '#fff',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '800' }}>{t('filterReset')}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFilters(local)
                onClose()
              }}
              style={{
                flex: 2,
                paddingVertical: 14,
                borderRadius: radius,
                backgroundColor: colors.red,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '900' }}>{t('filterApply')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function FilterSection({ title, isRTL, children }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontWeight: '800',
          fontSize: 14,
          marginBottom: 8,
          textAlign: isRTL ? 'right' : 'left',
          color: colors.ink,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
      }}
    >
      <Text style={{ fontWeight: '700' }}>{label}</Text>
      <View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: value ? colors.red : '#ccc',
          padding: 2,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#fff',
            transform: [{ translateX: value ? 18 : 0 }],
          }}
        />
      </View>
    </Pressable>
  )
}