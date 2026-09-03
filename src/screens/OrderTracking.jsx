import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike, MapPin, MessageCircle, Phone } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import DeliveryMap from '../components/DeliveryMap'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  canCancelOrder,
  coordsForAddress,
  coordsForStore,
  etaMax,
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
  const [courierStage, setCourierStage] = useState('searching') // searching | assigned | enroute | arriving | delivered
  const [searchPulse, setSearchPulse] = useState(0)
  const surveyedRef = useRef(false)

  useEffect(() => {
    const tmr = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tmr)
  }, [])

  // Pulse the "searching for courier" indicator
  useEffect(() => {
    if (courierStage !== 'searching') return undefined
    const tmr = setInterval(() => setSearchPulse((p) => (p + 1) % 4), 500)
    return () => clearInterval(tmr)
  }, [courierStage])

  const step = order ? orderStep(order.createdAt, now, order.status) : 0
  const store = order ? getStore(order.storeId) : null
  const etaMin = Math.max(0, etaMax(store) - Math.floor((now - (order?.createdAt || now)) / 60000))
  const cancelled = order?.status === 'cancelled'
  const delivered = !cancelled && step >= 3

  const destination = useMemo(
    () => (order ? coordsForAddress(order.address) : null),
    [order?.address?.lat, order?.address?.lng, order?.address?.area, order?.address?.city],
  )
  const storeCoords = useMemo(() => (store ? coordsForStore(store) : null), [store?.id])

  // Stage machine: searching -> assigned (after 6s) -> enroute (after 10s) -> arriving (after etaMin) -> delivered
  useEffect(() => {
    if (!order || cancelled || delivered) {
      if (delivered) setCourierStage('delivered')
      return undefined
    }
    if (courierStage === 'searching') {
      const tmr = setTimeout(() => setCourierStage('assigned'), 6000)
      return () => clearTimeout(tmr)
    }
    if (courierStage === 'assigned') {
      const tmr = setTimeout(() => setCourierStage('enroute'), 4500)
      return () => clearTimeout(tmr)
    }
    return undefined
  }, [order?.id, cancelled, delivered, courierStage])

  // Simulate courier moving toward destination once enroute
  useEffect(() => {
    if (!order || cancelled || delivered) {
      if (delivered) setSimProgress(1)
      return undefined
    }
    if (courierStage === 'searching' || courierStage === 'assigned') {
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
  }, [order?.id, cancelled, delivered, step, courierStage])

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
    // Searching phase: don't show courier yet
    if (courierStage === 'searching' || courierStage === 'assigned') {
      return null
    }
    return lerpCoords(storeCoords, destination, simProgress)
  }, [destination, storeCoords, simProgress, delivered, courierStage])

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
        ) : courierStage === 'searching' || courierStage === 'assigned' ? (
          <CourierSearching
            stage={courierStage}
            pulse={searchPulse}
            destination={destination}
            storeCoords={storeCoords}
            isRTL={isRTL}
            t={t}
            lang={lang}
          />
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
                flexShrink: 0,
              }}
            >
              <Bike size={22} />
            </View>
            <View
              style={{
                flex: 1,
                minWidth: 0,
                alignItems: isRTL ? 'flex-end' : 'flex-start',
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: '800',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {captain}
              </Text>
              <Text
                style={{
                  color: colors.muted,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {t('captain')}
              </Text>
              {!delivered && courierPos ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.muted,
                    fontSize: 11,
                    marginTop: 2,
                    textAlign: isRTL ? 'right' : 'left',
                  }}
                >
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
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <Phone size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('call')}</Text>
            </View>
            <SoftPress
              onPress={() =>
                navigation.navigate('CourierChat', { orderId: order.id, courierName: captain })
              }
              style={{ marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0, flexShrink: 0 }}
            >
              <View
                style={{
                  backgroundColor: colors.ink,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <MessageCircle size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800' }}>{t('courierChat')}</Text>
              </View>
            </SoftPress>
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

// Lightweight "courier searching" view: renders a stylized mini-map preview
// of the Baghdad pickup/drop-off points plus an animated status. We don't
// load MapView here to keep the initial paint fast and side-step any
// Google Maps key requirements.
function CourierSearching({ stage, pulse, destination, storeCoords, isRTL, t }) {
  const isSearching = stage === 'searching'
  const dots = '●'.repeat((pulse % 4) + 1) + '○'.repeat(3 - (pulse % 4))
  // Compute a deterministic SVG-friendly projection onto a 320x180 canvas.
  const points = []
  if (storeCoords) points.push({ ...storeCoords, label: 'store' })
  if (destination) points.push({ ...destination, label: 'home' })
  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const padLat = Math.max(0.005, (maxLat - minLat) * 0.4)
  const padLng = Math.max(0.005, (maxLng - minLng) * 0.4)
  const project = (p) => {
    const x = ((p.lng - (minLng - padLng)) / ((maxLng + padLng) - (minLng - padLng))) * 320
    const y = (1 - (p.lat - (minLat - padLat)) / ((maxLat + padLat) - (minLat - padLat))) * 180
    return { x: Math.max(20, Math.min(300, x)), y: Math.max(20, Math.min(160, y)) }
  }
  const storeXY = storeCoords ? project(storeCoords) : null
  const homeXY = destination ? project(destination) : null

  return (
    <View
      style={{
        height: 248,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#0F1B2D',
        position: 'relative',
      }}
    >
      {/* Mini-map preview drawn with absolute-positioned dots and a connecting line */}
      <View style={{ position: 'absolute', inset: 0, padding: 16 }}>
        {/* Soft grid background */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: '#142540',
          }}
        />
        {/* Baghdad label */}
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontWeight: '900', fontSize: 11, letterSpacing: 2 }}>
          BAGHDAD
        </Text>

        {/* Connecting dashed line between store and home */}
        {storeXY && homeXY ? (
          <View
            style={{
              position: 'absolute',
              left: storeXY.x,
              top: storeXY.y,
              width: Math.abs(homeXY.x - storeXY.x),
              height: Math.abs(homeXY.y - storeXY.y),
              transform: [
                { translateX: homeXY.x > storeXY.x ? 0 : -(homeXY.x - storeXY.x) },
                { translateY: homeXY.y > storeXY.y ? 0 : -(homeXY.y - storeXY.y) },
                { rotateZ: `${Math.atan2(homeXY.y - storeXY.y, homeXY.x - storeXY.x)}rad` },
                { translateY: -1 },
              ],
              borderTopWidth: 2,
              borderTopColor: 'rgba(227,30,36,0.6)',
              borderStyle: 'dashed',
            }}
          />
        ) : null}

        {/* Store point */}
        {storeXY ? (
          <View
            style={{
              position: 'absolute',
              left: storeXY.x - 14,
              top: storeXY.y - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#E31E24',
            }}
          >
            <Text style={{ fontSize: 12 }}>🏪</Text>
          </View>
        ) : null}

        {/* Destination point */}
        {homeXY ? (
          <View
            style={{
              position: 'absolute',
              left: homeXY.x - 14,
              top: homeXY.y - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#E31E24',
            }}
          >
            <Text style={{ fontSize: 12 }}>📍</Text>
          </View>
        ) : null}
      </View>

      {/* Searching overlay */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 16,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 14,
          padding: 14,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isSearching ? '#FFF200' : '#E31E24',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22 }}>{isSearching ? '🛵' : '✅'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '900', color: '#0F1B2D', fontSize: 14 }}>
            {isSearching ? t('searchingCourier') : t('courierAssigned')}
          </Text>
          <Text style={{ color: '#444', marginTop: 2, fontSize: 12, fontFamily: 'Courier' }}>
            {dots}
          </Text>
        </View>
      </View>

      {/* Distance / eta caption */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: 'rgba(15,27,45,0.85)',
          borderRadius: 12,
          padding: 10,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 11 }}>
          {storeCoords && destination
            ? `${distanceKm(storeCoords, destination).toFixed(1)} km`
            : '—'}
        </Text>
        <Text style={{ color: '#FFF200', fontWeight: '900', fontSize: 11 }}>
          {isSearching ? t('findingCourier') : t('onTheWay')}
        </Text>
      </View>
    </View>
  )
}

function distanceKm(a, b) {
  if (!a || !b) return 0
  const R = 6371
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}
