import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBar from '../components/TopBar'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, productName, storeName } from '../data/mock'
import { colors } from '../theme'

export default function CategoryScreen({ navigation, route }) {
  const { id } = route.params
  const { t, lang, isRTL } = useI18n()
  const { liveAisles, liveStores, getLiveProducts } = useApp()
  const aisle = liveAisles.find((a) => a.id === id)
  const aisleTitle =
    (lang === 'tr' && aisle?.nameTr) ||
    (lang === 'en' && aisle?.nameEn) ||
    aisle?.nameAr ||
    (aisle ? t(`cats.${aisle.id}`) : t('offersToday'))

  const offerProducts = liveStores.flatMap((s) =>
    getLiveProducts(s.id)
      .filter((p) => (id === 'offers' ? p.oldPrice : p.aisle === id))
      .map((p) => ({ ...p, storeId: s.id, storeLabel: storeName(s, lang) })),
  )
  const unique = []
  const seen = new Set()
  for (const p of offerProducts) {
    if (seen.has(p.id)) continue
    seen.add(p.id)
    unique.push(p)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={aisleTitle} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {unique.map((p) => (
          <Pressable
            key={`${p.storeId}-${p.id}`}
            onPress={() => navigation.navigate('Store', { id: p.storeId, aisle: id })}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 10,
              marginBottom: 10,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <ProductImage product={p} style={{ width: 64, height: 64, borderRadius: 12 }} />
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontWeight: '800' }}>{productName(p, lang)}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{p.storeLabel}</Text>
              <Text style={{ color: colors.red, fontWeight: '800', marginTop: 4 }}>{formatIQD(p.price, lang)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
