import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SlidersHorizontal } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SearchField from '../components/SearchField'
import StoreCard from '../components/StoreCard'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { collections, formatIQD, getNearestStore, productName, searchCatalog } from '../data/mock'
import { colors } from '../theme'
import { productCardWidth, useWebLayout } from '../layout/web'

export default function SearchScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { user, liveCatalog, liveStores, getLiveProducts } = useApp()
  const { isWeb, storefrontW, productCols } = useWebLayout()
  const colW = isWeb ? productCardWidth({ cols: Math.min(productCols, 4), storefrontW }) : '48%'
  const nearestId = getNearestStore(user?.address)?.id
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const { matchedStores, matchedProducts } = useMemo(() => {
    const base = searchCatalog(query, lang)
    if (!query) return base
    const liveMatched = liveStores
      .filter((s) => !s.comingSoon)
      .flatMap((store) =>
        getLiveProducts(store.id)
          .filter((p) => {
            const n = productName(p, lang).toLowerCase()
            return n.includes(query) || String(p.id).toLowerCase().includes(query) || String(p.brand || '').toLowerCase().includes(query)
          })
          .map((p) => ({ ...p, storeId: store.id })),
      )
    const byId = new Map()
    for (const p of [...base.matchedProducts, ...liveMatched]) {
      byId.set(`${p.storeId}:${p.id}`, p)
    }
    const storeHits = liveStores.filter(
      (s) =>
        !s.comingSoon &&
        (String(s.name || '').toLowerCase().includes(query) ||
          String(s.nameEn || '').toLowerCase().includes(query) ||
          String(s.nameTr || '').toLowerCase().includes(query)),
    )
    return {
      matchedStores: storeHits.length ? storeHits : base.matchedStores,
      matchedProducts: [...byId.values()],
    }
  }, [query, lang, liveCatalog, liveStores, getLiveProducts])

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
              placeholder={t('searchPlaceholder')}
              isRTL={isRTL}
              autoFocus
              onScan={() => navigation.navigate('Scan')}
            />
          </View>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: colors.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SlidersHorizontal size={18} color={colors.ink} />
          </View>
        </View>

        {!query ? (
          <>
            <Text style={{ fontWeight: '800', fontSize: 17, marginTop: 18, marginBottom: 10 }}>{t('collections')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isWeb ? 'flex-start' : 'space-between', gap: isWeb ? 12 : 0 }}>
              {collections.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => navigation.navigate('Store', { id: nearestId, aisle: c.aisle })}
                  style={{ width: colW, marginBottom: 12 }}
                >
                  <ProductImage
                    uri={c.image}
                    aisle={c.aisle}
                    style={{ width: '100%', height: 110, borderRadius: 14 }}
                  />
                  <Text style={{ fontWeight: '800', marginTop: 6 }}>{t(`col.${c.id}`)}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{t(`cats.${c.aisle}`)}</Text>
                </Pressable>
              ))}
            </View>
            {liveStores
              .filter((s) => s.status !== 'closed')
              .map((s) => (
                <StoreCard key={s.id} store={s} onPress={() => navigation.navigate('Store', { id: s.id })} />
              ))}
          </>
        ) : null}

        {query && matchedStores.map((s) => (
          <StoreCard key={s.id} store={s} onPress={() => navigation.navigate('Store', { id: s.id })} />
        ))}
        {query &&
          matchedProducts.map((p) => (
            <Pressable
              key={`${p.storeId}-${p.id}`}
              onPress={() => navigation.navigate('Store', { id: p.storeId })}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 10,
                marginBottom: 10,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800' }}>{productName(p, lang)}</Text>
                <Text style={{ color: colors.muted }}>{p.storeName}</Text>
                <Text style={{ color: colors.red, fontWeight: '800', marginTop: 6 }}>{formatIQD(p.price, lang)}</Text>
              </View>
              <ProductImage uri={p.image} aisle={p.aisle} style={{ width: 86, height: 86, borderRadius: 12 }} />
            </Pressable>
          ))}
        {query && !matchedStores.length && !matchedProducts.length ? (
          <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 40 }}>{t('noResults')}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}
