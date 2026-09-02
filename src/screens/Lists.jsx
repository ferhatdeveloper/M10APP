import { Alert, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookOpen, Clock, ListChecks, Play, ShoppingCart } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, listTitle, productName, resolveListItems, youtubeThumbUrl } from '../data/mock'
import { src } from '../utils/images'
import { colors } from '../theme'

export default function ListsScreen({ navigation }) {
  const { lists, addListToCart } = useApp()
  const { t, lang, isRTL } = useI18n()
  const recipes = lists.filter((l) => l.kind === 'recipe')
  const shopping = lists.filter((l) => l.kind !== 'recipe')
  const align = isRTL ? 'right' : 'left'

  const addAll = (list) => {
    const res = addListToCart(list)
    if (!res.ok) {
      const msg = res.reason === 'otherStore' ? t('listAddOtherStore') : t('listAddFail')
      Alert.alert(t('listsTitle'), msg)
      return
    }
    Alert.alert(t('listsTitle'), t('listAdded', { n: res.added }), [
      { text: t('continue'), style: 'cancel' },
      { text: t('goToCart'), onPress: () => navigation.navigate('Cart') },
    ])
  }

  const openVideo = (list) => {
    if (!list?.youtube) {
      Alert.alert(t('recipe'), t('videoUnavailable'))
      return
    }
    Linking.openURL(list.youtube).catch(() => Alert.alert(t('recipe'), t('videoUnavailable')))
  }

  const renderShoppingCard = (list) => {
    const rows = resolveListItems(list)
    const subtotal = rows.reduce((n, r) => n + (r.product?.price || 0) * r.qty, 0)
    return (
      <View
        key={list.id}
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 14,
          borderLeftWidth: 3,
          borderLeftColor: colors.red,
        }}
      >
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListChecks size={20} color={colors.red} />
          </View>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontWeight: '800', fontSize: 16 }}>
              {list.emoji ? `${list.emoji} ` : ''}
              {listTitle(list, lang)}
            </Text>
            <Text style={{ color: colors.muted, marginTop: 2, fontSize: 12 }}>
              {t('shoppingList')} · {t('itemsCount', { n: rows.length })}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 12, gap: 6 }}>
          {rows.slice(0, 5).map((r) => (
            <View
              key={r.productId}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ color: colors.ink, flex: 1, textAlign: align }}>
                {r.qty}× {productName(r.product, lang)}
              </Text>
              <Text style={{ fontWeight: '700', color: colors.muted }}>
                {formatIQD((r.product?.price || 0) * r.qty, lang)}
              </Text>
            </View>
          ))}
          {rows.length > 5 ? (
            <Text style={{ color: colors.muted, fontSize: 12, textAlign: align }}>
              +{rows.length - 5}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '800', color: colors.red }}>{formatIQD(subtotal, lang)}</Text>
          <Pressable
            onPress={() => addAll(list)}
            style={{
              backgroundColor: colors.red,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShoppingCart size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('addAllToCart')}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const renderRecipeCard = (list) => {
    const rows = resolveListItems(list)
    const cover = list.image || youtubeThumbUrl(list.youtube)
    return (
      <View
        key={list.id}
        style={{
          backgroundColor: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        <View style={{ height: 148, backgroundColor: '#111' }}>
          {cover ? <Image source={src(cover)} style={{ width: '100%', height: '100%' }} /> : null}
          {list.youtube ? (
            <Pressable
              onPress={() => openVideo(list)}
              style={{
                position: 'absolute',
                right: isRTL ? undefined : 12,
                left: isRTL ? 12 : undefined,
                bottom: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.65)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={18} color="#fff" fill="#fff" />
            </Pressable>
          ) : null}
        </View>
        <View style={{ padding: 14, gap: 10 }}>
          <Text style={{ fontWeight: '900', fontSize: 17, textAlign: align }}>
            {list.emoji ? `${list.emoji} ` : ''}
            {listTitle(list, lang)}
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
              <BookOpen size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>{t('recipe')}</Text>
            </View>
            {list.durationMin ? (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={14} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>
                  {t('recipeDuration', { n: list.durationMin })}
                </Text>
              </View>
            ) : null}
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>
              {t('itemsCount', { n: rows.length })}
            </Text>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
            <Pressable
              onPress={() => navigation.navigate('RecipeDetail', { listId: list.id })}
              style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: colors.red,
                paddingVertical: 11,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.red, fontWeight: '800' }}>{t('goToRecipe')}</Text>
            </Pressable>
            <Pressable
              onPress={() => addAll(list)}
              style={{
                flex: 1.2,
                backgroundColor: colors.red,
                borderRadius: 12,
                paddingVertical: 11,
                alignItems: 'center',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'center',
                gap: 6,
                paddingHorizontal: 8,
              }}
            >
              <ShoppingCart size={15} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{t('addIngredientsToCart')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('listsTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}>
        <Text style={{ color: colors.muted, textAlign: align }}>{t('listsHint')}</Text>

        <Text style={{ fontWeight: '900', fontSize: 16, textAlign: align }}>{t('recipesSection')}</Text>
        {recipes.map(renderRecipeCard)}

        <Text style={{ fontWeight: '900', fontSize: 16, marginTop: 4, textAlign: align }}>
          {t('shoppingListsSection')}
        </Text>
        {shopping.map(renderShoppingCard)}
      </ScrollView>
    </SafeAreaView>
  )
}
