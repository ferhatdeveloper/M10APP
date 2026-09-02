import { Alert, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChefHat, Clock, Play, ShoppingCart } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  formatIQD,
  listTitle,
  productName,
  recipeSteps,
  resolveListItems,
  youtubeThumbUrl,
} from '../data/mock'
import { src } from '../utils/images'
import { colors } from '../theme'

export default function RecipeDetailScreen({ navigation, route }) {
  const { listId } = route.params || {}
  const { lists, addListToCart } = useApp()
  const { t, lang, isRTL } = useI18n()
  const list = lists.find((l) => l.id === listId)

  if (!list || list.kind !== 'recipe') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('recipe')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 24 }}>
          <Text style={{ color: colors.muted, fontWeight: '700' }}>{t('recipeMissing')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const rows = resolveListItems(list)
  const steps = recipeSteps(list, lang)
  const subtotal = rows.reduce((n, r) => n + (r.product?.price || 0) * r.qty, 0)
  const thumb = youtubeThumbUrl(list.youtube) || list.image
  const align = isRTL ? 'right' : 'left'

  const openVideo = () => {
    if (!list.youtube) {
      Alert.alert(t('recipe'), t('videoUnavailable'))
      return
    }
    Linking.openURL(list.youtube).catch(() => Alert.alert(t('recipe'), t('videoUnavailable')))
  }

  const addAll = () => {
    const res = addListToCart(list)
    if (!res.ok) {
      Alert.alert(t('listsTitle'), t('listAddFail'))
      return
    }
    Alert.alert(t('listsTitle'), t('listAdded', { n: res.added }), [
      { text: t('continue'), style: 'cancel' },
      { text: t('goToCart'), onPress: () => navigation.navigate('Cart') },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={listTitle(list, lang)} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ height: 220, backgroundColor: '#111' }}>
          <Image source={src(list.image)} style={{ width: '100%', height: '100%' }} />
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          <Text style={{ fontWeight: '900', fontSize: 22, textAlign: align }}>
            {list.emoji ? `${list.emoji} ` : ''}
            {listTitle(list, lang)}
          </Text>

          <SoftPress
            onPress={() => navigation.navigate('RecipeChef')}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: colors.redSoft,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 12,
              alignSelf: 'flex-start',
            }}
          >
            <ChefHat size={16} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '800' }}>
              {t('recipesFromFridge')}
            </Text>
          </SoftPress>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 14, flexWrap: 'wrap' }}>
            {list.durationMin ? (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                <Clock size={16} color={colors.muted} />
                <Text style={{ color: colors.muted, fontWeight: '700' }}>
                  {t('recipeDuration', { n: list.durationMin })}
                </Text>
              </View>
            ) : null}
            <Text style={{ color: colors.muted, fontWeight: '700' }}>
              {t('itemsCount', { n: rows.length })}
            </Text>
          </View>

          {list.youtube ? (
            <Pressable
              onPress={openVideo}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#000',
                height: 160,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {thumb ? (
                <Image source={src(thumb)} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.75 }} />
              ) : null}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={26} color="#fff" fill="#fff" />
              </View>
              <Text style={{ color: '#fff', fontWeight: '800', marginTop: 10 }}>{t('watchVideo')}</Text>
            </Pressable>
          ) : null}

          <Text style={{ fontWeight: '800', fontSize: 16, textAlign: align }}>{t('ingredients')}</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 12, gap: 8 }}>
            {rows.map((r) => (
              <View
                key={r.productId}
                style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}
              >
                <Text style={{ flex: 1, textAlign: align }}>
                  {r.qty}× {productName(r.product, lang)}
                </Text>
                <Text style={{ fontWeight: '700', color: colors.muted }}>
                  {formatIQD((r.product?.price || 0) * r.qty, lang)}
                </Text>
              </View>
            ))}
            <Text style={{ fontWeight: '900', color: colors.red, marginTop: 4, textAlign: align }}>
              {formatIQD(subtotal, lang)}
            </Text>
          </View>

          {steps.length ? (
            <>
              <Text style={{ fontWeight: '800', fontSize: 16, textAlign: align }}>{t('recipeSteps')}</Text>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 12, gap: 10 }}>
                {steps.map((step, i) => (
                  <View
                    key={`${list.id}-step-${i}`}
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: colors.redSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: colors.red, fontWeight: '900', fontSize: 12 }}>{i + 1}</Text>
                    </View>
                    <Text style={{ flex: 1, lineHeight: 20, textAlign: align, color: colors.ink }}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: colors.line,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: 10,
        }}
      >
        {list.youtube ? (
          <Pressable
            onPress={openVideo}
            style={{
              flex: 1,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.red,
              paddingVertical: 14,
              alignItems: 'center',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Play size={16} color={colors.red} />
            <Text style={{ color: colors.red, fontWeight: '800' }}>{t('watchVideo')}</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={addAll}
          style={{
            flex: 1.4,
            backgroundColor: colors.red,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ShoppingCart size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '800' }}>{t('addIngredientsToCart')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
