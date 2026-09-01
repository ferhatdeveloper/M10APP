import { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Star } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { getProduct, getStore, productName, storeName } from '../data/mock'
import { colors, radius } from '../theme'

const SURVEY_KEYS = ['surveyQPackaging', 'surveyQSpeed', 'surveyQRecommend']

function StarRow({ value, onChange, isRTL }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value
        return (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
            <Star size={32} color={on ? colors.yellowDark : '#D0D0D0'} fill={on ? colors.yellow : 'none'} />
          </Pressable>
        )
      })}
    </View>
  )
}

function ChoiceRow({ value, onChange, options, isRTL, disabled }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {options.map((opt) => {
        const on = value === opt.id
        return (
          <Pressable
            key={opt.id}
            disabled={disabled}
            onPress={() => onChange(opt.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: on ? colors.red : colors.bg,
              borderWidth: 1,
              borderColor: on ? colors.red : colors.line,
            }}
          >
            <Text style={{ fontWeight: '800', color: on ? '#fff' : colors.ink, fontSize: 13 }}>{opt.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default function RateOrderScreen({ navigation, route }) {
  const orderId = route.params?.id
  const { orders, rateOrder } = useApp()
  const { t, lang, isRTL } = useI18n()
  const order = orders.find((o) => o.id === orderId)
  const store = getStore(order?.storeId)
  const [storeStars, setStoreStars] = useState(order?.rating?.store || 0)
  const [courierStars, setCourierStars] = useState(order?.rating?.courier || 0)
  const [comment, setComment] = useState(order?.rating?.comment || '')
  const [answers, setAnswers] = useState(order?.rating?.answers || {})

  const yesNoMaybe = useMemo(
    () => [
      { id: 'yes', label: t('surveyYes') },
      { id: 'mostly', label: t('surveyMostly') },
      { id: 'no', label: t('surveyNo') },
    ],
    [t, lang],
  )

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('rateOrder')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 24 }}>
          <Text style={{ color: colors.muted }}>{t('noOrders')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const done = !!order.rating
  const itemsPreview = (order.items || [])
    .slice(0, 3)
    .map((item) => {
      const p = getProduct(item.storeId || order.storeId, item.productId)
      return productName(p, lang) || item.productId
    })
    .filter(Boolean)

  const submit = () => {
    if (done) {
      navigation.goBack()
      return
    }
    if (!storeStars || !courierStars) {
      Alert.alert(t('rateOrder'), t('rateRequired'))
      return
    }
    const missing = SURVEY_KEYS.some((k) => !answers[k])
    if (missing) {
      Alert.alert(t('surveyTitle'), t('surveyRequired'))
      return
    }
    const ok = rateOrder(order.id, { storeStars, courierStars, comment, answers })
    if (ok) Alert.alert(t('thanksRating'), t('ratingPoints'))
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('surveyTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: radius, padding: 16, borderLeftWidth: 3, borderLeftColor: colors.red }}>
          <Text style={{ fontWeight: '800', fontSize: 18 }}>{storeName(store, lang) || t('butlerTitle')}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{order.id}</Text>
          {itemsPreview.length ? (
            <Text style={{ color: colors.muted, marginTop: 6, textAlign: isRTL ? 'right' : 'left' }}>
              {itemsPreview.join(' · ')}
            </Text>
          ) : null}
          {route.params?.auto ? (
            <Text style={{ color: colors.open, fontWeight: '800', marginTop: 8 }}>{t('surveyAutoHint')}</Text>
          ) : null}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: radius, padding: 16 }}>
          <Text style={{ fontWeight: '800' }}>{t('rateStore')}</Text>
          <StarRow value={storeStars} onChange={done ? () => {} : setStoreStars} isRTL={isRTL} />
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: radius, padding: 16 }}>
          <Text style={{ fontWeight: '800' }}>{t('rateCourier')}</Text>
          <StarRow value={courierStars} onChange={done ? () => {} : setCourierStars} isRTL={isRTL} />
        </View>

        {SURVEY_KEYS.map((key) => (
          <View key={key} style={{ backgroundColor: '#fff', borderRadius: radius, padding: 16 }}>
            <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t(key)}</Text>
            <ChoiceRow
              value={answers[key]}
              disabled={done}
              isRTL={isRTL}
              options={yesNoMaybe}
              onChange={(id) => setAnswers((prev) => ({ ...prev, [key]: id }))}
            />
          </View>
        ))}

        <View style={{ backgroundColor: '#fff', borderRadius: radius, padding: 16 }}>
          <Text style={{ fontWeight: '800', marginBottom: 8 }}>{t('rateComment')}</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            editable={!done}
            placeholder={t('rateCommentHint')}
            multiline
            style={{
              minHeight: 90,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 12,
              padding: 12,
              textAlign: isRTL ? 'right' : 'left',
              textAlignVertical: 'top',
            }}
          />
        </View>

        <Pressable
          onPress={submit}
          style={{
            backgroundColor: colors.red,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>{done ? t('close') : t('submitRating')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
