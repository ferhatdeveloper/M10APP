import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike, MapPin, Phone } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import DeliveryMap from '../components/DeliveryMap'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  canCancelOrder,
  coordsForAddress,
  coordsForStore,
  formatIQD,
  getProduct,
  getStore,
  lerpCoords,
  productName,
} from '../data/mock'
import { orderStep } from './Orders'
import { colors } from '../theme'

const STEP_KEYS = ['confirmed', 'preparing', 'onway', 'delivered']

function captainName(lang) {
  if (lang === 'en') return 'Hussein Al-Mousawi'
  if (lang === 'tr') return 'Hüseyin El-Musavi'
  return 'حسين الموسوي'
}

export default function OrderTrackingScreen({ navigation, route }) {
  const { id } = route.params
  const { orders, cancelOrder, reorder } = useApp()
  const { t, lang, isRTL } = useI18n()
  const order = orders.find((o) => o.id === id)
  const [now, setNow] = useState(Date.now())
  const [simProgress, setSimProgress] = useState(0.12)
  const surveyedRef = useRef(false)

  useEffect(() => {
    const tmr = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tmr)
  }, [])

  const step = order ? orderStep(order.createdAt, now, order.status) : 0
  const store = order ? getStore(order.storeId) : null
  const etaMin = Math.max(0, 12 - Math.floor((now - (order?.createdAt || now)) / 60000))
  const cancelled = order?.status === 'cancelled'
  const delivered = !cancelled && step >= 3

  const destination = useMemo(
    () => (order ? coordsForAddress(order.address) : null),
    [order?.address?.lat, order?.address?.lng, order?.address?.area, order?.address?.city],
  )
  const storeCoords = useMemo(() => (store ? coordsForStore(store) : null), [store?.id])

  // Simulate courier moving toward destination until delivered
  useEffect(() => {
    if (!order || cancelled || delivered) {
      if (delivered) setSimProgress(1)
      return undefined
    }
    const base = step <= 0 ? 0.08 : step === 1 ? 0.28 : 0.55
    setSimProgress((p) => Math.max(p, base))
    const tmr = setInterval(() => {
      setSimProgress((p) => {
        const cap = step >= 2 ? 0.92 : step === 1 ? 0.5 : 0.25
        if (p >= cap) return p
        return Math.min(cap, p + 0.018)
      })
    }, 1200)
    return () => clearInterval(tmr)
  }, [order?.id, cancelled, delivered, step])

  // Auto-open survey once delivered
  useEffect(() => {
    if (!order || cancelled || !delivered || order.rating || surveyedRef.current) return undefined
    surveyedRef.current = true
    const tmr = setTimeout(() => {
      navigation.navigate('RateOrder', { id: order.id, auto: true })
    }, 700)
    return () => clearTimeout(tmr)
  }, [delivered, order?.id, order?.rating, cancelled, navigation])

  const courierPos = useMemo(() => {
    if (!destination || !storeCoords) return null
    if (delivered) return destination
    return lerpCoords(storeCoords, destination, simProgress)
  }, [destination, storeCoords, simProgress, delivered])

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('track')} onBack={() => navigation.goBack()} />
        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.muted }}>{t('notFound')}</Text>
      </SafeAreaView>
    )
  }

  const captain = captainName(lang)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('track')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {cancelled ? (
          <View
            style={{
              height: 160,
              borderRadius: 20,
              backgroundColor: '#3A3A3A',
              padding: 16,
              justifyContent: 'flex-end',
            }}
          >
            <Text style={{ fontWeight: '900', color: '#fff', fontSize: 20 }}>{t('cancelled')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{t('mapPlaceholder')}</Text>
          </View>
        ) : (
          <DeliveryMap
            destination={destination}
            courier={courierPos}
            showCourier={!delivered || simProgress < 1}
            height={248}
            isRTL={isRTL}
            title={t(STEP_KEYS[Math.max(0, step)])}
            subtitle={order.slot ? `${t('schedule')}: ${order.slot}` : null}
            etaLabel={!delivered ? t('etaRemaining', { n: etaMin || store?.eta || '10-20' }) : null}
          />
        )}

        {!cancelled ? (
          <SoftPress
            onPress={() => Alert.alert(t('call'), t('calling', { name: captain }))}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 14,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.yellow,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bike size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800' }}>{captain}</Text>
              <Text style={{ color: colors.muted }}>{t('captain')}</Text>
              {!delivered && courierPos ? (
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                  {t('liveCourierHint')} · {courierPos.lat.toFixed(4)}, {courierPos.lng.toFixed(4)}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                backgroundColor: colors.red,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Phone size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('call')}</Text>
            </View>
          </SoftPress>
        ) : (
          <View
            style={{
              backgroundColor: '#F1F1F1',
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Text style={{ fontWeight: '800', color: '#666' }}>{t('cancelled')}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{t('cancelOrderDone')}</Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: cancelled ? '#FAFAFA' : '#fff',
            borderRadius: 16,
            padding: 14,
            opacity: cancelled ? 0.85 : 1,
          }}
        >
          {STEP_KEYS.map((k, i) => {
            const done = !cancelled && i <= step
            const active = !cancelled && i === step
            const isLast = i === STEP_KEYS.length - 1
            return (
              <View key={k} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12 }}>
                <View style={{ alignItems: 'center', width: 16 }}>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: done ? colors.red : '#DDD',
                      borderWidth: active ? 3 : 0,
                      borderColor: colors.yellow,
                    }}
                  />
                  {!isLast ? (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 22,
                        backgroundColor: !cancelled && i < step ? colors.red : '#E8E8E8',
                        marginVertical: 2,
                      }}
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
                  <Text
                    style={{
                      fontWeight: done ? '800' : '600',
                      color: cancelled ? colors.muted : done ? colors.ink : colors.muted,
                    }}
                  >
                    {t(k)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
            <MapPin size={18} color={colors.red} />
            <Text>
              {order.address?.area} — {order.address?.details}
            </Text>
          </View>
          {(order.items || []).map((item) => {
            const p = getProduct(item.storeId || order.storeId, item.productId)
            return (
              <View
                key={item.productId}
                style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 8 }}
              >
                <Text>
                  {productName(p, lang) || p?.name || item.productId} × {item.qty}
                </Text>
                <Text>{formatIQD((p?.price || 0) * item.qty, lang)}</Text>
              </View>
            )
          })}
          <Text style={{ color: colors.red, fontWeight: '800', marginTop: 10 }}>
            {t('total')} {formatIQD(order.total, lang)}
          </Text>
        </View>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, flexWrap: 'wrap' }}>
          <SoftPress
            onPress={() => {
              const ok = reorder(order)
              if (ok) navigation.navigate('Cart')
              else Alert.alert(t('reorder'), t('reorderFail'))
            }}
            style={{ flex: 1, minWidth: '40%', backgroundColor: colors.red, borderRadius: 14, padding: 14, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('reorder')}</Text>
          </SoftPress>
          {step >= 3 && !cancelled ? (
            <SoftPress
              onPress={() => navigation.navigate('RateOrder', { id: order.id })}
              style={{
                flex: 1,
                minWidth: '40%',
                backgroundColor: order.rating ? colors.bg : '#FFF8D6',
                borderWidth: 1.5,
                borderColor: order.rating ? colors.line : colors.yellowDark,
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '800' }}>{order.rating ? t('viewRating') : t('rateOrder')}</Text>
            </SoftPress>
          ) : null}
          {canCancelOrder(order) ? (
            <SoftPress
              onPress={() =>
                Alert.alert(t('cancelOrder'), t('cancelOrderConfirm'), [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('confirmCancel'),
                    style: 'destructive',
                    onPress: () => {
                      cancelOrder(order.id)
                      Alert.alert(t('cancelled'), t('cancelOrderDone'))
                    },
                  },
                ])
              }
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
                backgroundColor: '#fff',
              }}
            >
              <Text style={{ fontWeight: '800' }}>{t('cancelOrder')}</Text>
            </SoftPress>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
