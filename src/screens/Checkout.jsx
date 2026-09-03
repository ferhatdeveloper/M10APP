import { useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Banknote, Check, CreditCard, MapPin, Smartphone, Wallet } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { DELIVERY_SLOTS, formatIQD, generateDeliverySlots, linePrice, productName } from '../data/mock'
import { colors, radius, shadow } from '../theme'

export default function CheckoutScreen({ navigation }) {
  const {
    cart,
    cartStore,
    cartTotal,
    cartFee,
    cartDiscount,
    cartPayable,
    coupon,
    user,
    placeOrder,
    plusActive,
    walletBalance,
    isOffline,
    getLiveProduct,
  } = useApp()
  const { t, lang, isRTL } = useI18n()
  const [payment, setPayment] = useState('cash')
  const [when, setWhen] = useState('now')
  const [fulfillment, setFulfillment] = useState('delivery') // delivery | pickup
  const allSlots = useMemo(() => generateDeliverySlots(4), [])
  const availableDays = useMemo(() => {
    const map = new Map()
    for (const s of allSlots) {
      if (!s.available) continue
      if (!map.has(s.dayKey)) {
        map.set(s.dayKey, { dayKey: s.dayKey, dayLabel: s.dayLabel, slots: [] })
      }
      map.get(s.dayKey).slots.push(s)
    }
    return [...map.values()]
  }, [allSlots])
  const [dayKey, setDayKey] = useState(() => availableDays[0]?.dayKey || null)
  const [slotId, setSlotId] = useState(null)
  const daySlots = availableDays.find((d) => d.dayKey === dayKey)?.slots || []
  const chosenSlot = daySlots.find((s) => s.id === slotId) || daySlots[0] || null
  const [note, setNote] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [payState, setPayState] = useState('idle') // idle | confirming | success | fail

  const cardOk = useMemo(() => {
    const digits = cardNumber.replace(/\D/g, '')
    return digits.length >= 12 && cardExpiry.length >= 4 && cardCvv.length >= 3
  }, [cardNumber, cardExpiry, cardCvv])

  const effectiveFee = fulfillment === 'pickup' ? 0 : cartFee
  const effectivePayable = Math.max(0, cartTotal + effectiveFee - cartDiscount)
  const walletOk = walletBalance >= effectivePayable
  const digitalPay = payment === 'apple' || payment === 'google' || payment === 'card' || payment === 'wallet'

  if (!cart.length || !cartStore) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('checkout')} onBack={() => navigation.goBack()} />
        <View style={{ alignItems: 'center', padding: 40 }}>
          <Text style={{ textAlign: 'center', color: colors.muted, fontWeight: '700' }}>{t('noOrder')}</Text>
          <SoftPress
            onPress={() => navigation.navigate('Tabs')}
            style={{ marginTop: 16, backgroundColor: colors.red, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('browseStores')}</Text>
          </SoftPress>
        </View>
      </SafeAreaView>
    )
  }

  const belowMin = cartTotal < cartStore.minOrder
  const address = user?.address
  const couponTitle =
    lang === 'en' ? coupon?.titleEn || coupon?.title : lang === 'tr' ? coupon?.titleTr || coupon?.title : coupon?.title

  const paymentLabel = () => {
    if (payment === 'card') return t('card')
    if (payment === 'wallet') return t('payWallet')
    if (payment === 'apple') return 'Apple Pay'
    if (payment === 'google') return 'Google Pay'
    return t('cash')
  }

  const canSubmit = () => {
    if (isOffline || belowMin) return false
    if (payState === 'confirming' || payState === 'success') return false
    if (payment === 'card' && !cardOk) return false
    if (payment === 'wallet' && !walletOk) return false
    return true
  }

  const retry = () => setPayState('idle')

  const submit = () => {
    if (!canSubmit()) return
    let order
    try {
      const payload = {
        payment: paymentLabel(),
        paymentMethod: payment,
        schedule: when === 'now' ? t('now') : t('schedule'),
        slot: when === 'later' && chosenSlot ? { dayKey: chosenSlot.dayKey, dayLabel: chosenSlot.dayLabel, window: chosenSlot.window, startTs: chosenSlot.startTs, endTs: chosenSlot.endTs } : null,
        cardLast4: payment === 'card' ? cardNumber.replace(/\D/g, '').slice(-4) : null,
        note,
        fulfillment,
      }
      if (digitalPay) {
        setPayState('confirming')
        setTimeout(() => {
          try {
            order = placeOrder(payload)
          } catch (e) {
            console.warn('[M10] placeOrder crashed', e?.message, e?.stack)
            setPayState('fail')
            return
          }
          if (!order) {
            setPayState('fail')
            return
          }
          setPayState('success')
          setTimeout(() => {
            try {
              navigation.replace('Track', { id: order.id })
            } catch (e) {
              console.warn('[M10] nav to Track failed', e?.message)
            }
          }, 700)
        }, 900)
        return
      }
      order = placeOrder(payload)
    } catch (e) {
      console.warn('[M10] placeOrder crashed', e?.message, e?.stack)
      return
    }
    if (order) {
      try {
        navigation.replace('Track', { id: order.id })
      } catch (e) {
        console.warn('[M10] nav to Track failed', e?.message)
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('checkout')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}>
        {isOffline ? (
          <View style={{ backgroundColor: colors.ink, borderRadius: radius, padding: 12 }}>
            <Text style={{ color: colors.yellow, fontWeight: '800' }}>{t('offlineCheckout')}</Text>
          </View>
        ) : null}
        {!plusActive && cartFee > 0 ? (
          <SoftPress
            onPress={() => navigation.navigate('Plus')}
            style={{
              backgroundColor: colors.ink,
              borderRadius: radius,
              padding: 12,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View style={{ backgroundColor: colors.yellow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontWeight: '900', color: colors.ink, fontSize: 12 }}>M10+</Text>
            </View>
            <Text style={{ color: '#fff', fontWeight: '700', flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('plusHomeCta')}
            </Text>
            <Text style={{ color: colors.yellow, fontWeight: '800' }}>{t('plusSubscribe')}</Text>
          </SoftPress>
        ) : null}
        {plusActive ? (
          <View
            style={{
              backgroundColor: colors.openBg,
              borderRadius: radius,
              padding: 12,
              borderWidth: 1,
              borderColor: '#C8EBD5',
            }}
          >
            <Text style={{ fontWeight: '800', color: colors.open, textAlign: isRTL ? 'right' : 'left' }}>{t('plusCartFree')}</Text>
          </View>
        ) : null}
        <SoftPress
          onPress={() => navigation.navigate('Addresses')}
          style={{
            backgroundColor: colors.card,
            borderRadius: radius,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.line,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>{t('deliveryAddress')}</Text>
            <Text style={{ color: colors.red, fontWeight: '800', fontSize: 13 }}>{t('change')}</Text>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginTop: 12 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.redSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={18} color={colors.red} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontWeight: '800' }}>{address?.label}</Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>
                {address?.area}، {address?.city}
              </Text>
              {address?.details ? <Text style={{ color: colors.muted, marginTop: 2 }}>{address.details}</Text> : null}
            </View>
          </View>
        </SoftPress>

        <SectionTitle isRTL={isRTL}>{t('payment')}</SectionTitle>
        <Option
          on={payment === 'cash'}
          onPress={() => setPayment('cash')}
          isRTL={isRTL}
          icon={<Banknote size={18} color={colors.red} />}
          title={t('cash')}
          hint={t('cashHint')}
        />
        <Option
          on={payment === 'card'}
          onPress={() => setPayment('card')}
          isRTL={isRTL}
          icon={<CreditCard size={18} color={colors.red} />}
          title={t('card')}
          hint="Visa / Mastercard"
        />
        <Option
          on={payment === 'wallet'}
          onPress={() => setPayment('wallet')}
          isRTL={isRTL}
          icon={<Wallet size={18} color={colors.red} />}
          title={t('payWallet')}
          hint={`${t('balance')}: ${formatIQD(walletBalance, lang)}${walletOk ? '' : ` · ${t('walletLow')}`}`}
        />
        <Option
          on={payment === 'apple'}
          onPress={() => setPayment('apple')}
          isRTL={isRTL}
          icon={<Smartphone size={18} color={colors.red} />}
          title="Apple Pay"
          hint={t('applePayHint')}
        />
        <Option
          on={payment === 'google'}
          onPress={() => setPayment('google')}
          isRTL={isRTL}
          icon={<Smartphone size={18} color={colors.red} />}
          title="Google Pay"
          hint={t('googlePayHint')}
        />

        {payment === 'card' ? (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: radius,
              padding: 14,
              gap: 10,
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Text style={{ fontWeight: '800' }}>{t('cardDetails')}</Text>
            <LabeledField label={t('cardNumber')} isRTL={isRTL}>
              <TextInput
                value={cardNumber}
                onChangeText={(v) => setCardNumber(v.replace(/[^\d ]/g, '').slice(0, 19))}
                placeholder="4111 1111 1111 1111"
                keyboardType="number-pad"
                style={inputStyle(isRTL)}
              />
            </LabeledField>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <LabeledField label={t('cardExpiry')} isRTL={isRTL}>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    placeholder="MM/YY"
                    style={inputStyle(isRTL)}
                  />
                </LabeledField>
              </View>
              <View style={{ flex: 1 }}>
                <LabeledField label={t('cardCvv')} isRTL={isRTL}>
                  <TextInput
                    value={cardCvv}
                    onChangeText={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))}
                    placeholder="CVV"
                    keyboardType="number-pad"
                    secureTextEntry
                    style={inputStyle(isRTL)}
                  />
                </LabeledField>
              </View>
            </View>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{t('cardDemoHint')}</Text>
          </View>
        ) : null}

        {payment === 'wallet' && !walletOk ? (
          <SoftPress
            onPress={() => navigation.navigate('Wallet')}
            style={{ backgroundColor: colors.busyBg, borderRadius: 12, padding: 12 }}
          >
            <Text style={{ fontWeight: '800', color: colors.busy }}>{t('topUpToPay')}</Text>
          </SoftPress>
        ) : null}

        {(payState === 'confirming' || payState === 'success' || payState === 'fail') && digitalPay ? (
          <View
            style={{
              backgroundColor: payState === 'fail' ? colors.redSoft : colors.openBg,
              borderRadius: 14,
              padding: 14,
              alignItems: 'center',
              gap: 8,
            }}
          >
            {payState === 'confirming' ? <ActivityIndicator color={colors.red} /> : null}
            <Text style={{ fontWeight: '800', color: payState === 'fail' ? colors.red : colors.open }}>
              {payState === 'confirming'
                ? t('paymentConfirming')
                : payState === 'success'
                  ? t('paymentSuccess')
                  : t('paymentFail')}
            </Text>
            {payState === 'fail' ? (
              <SoftPress
                onPress={retry}
                style={{ backgroundColor: colors.red, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>{t('tryAgain')}</Text>
              </SoftPress>
            ) : null}
          </View>
        ) : null}

        <SectionTitle isRTL={isRTL}>{t('fulfillment')}</SectionTitle>
        <Option
          on={fulfillment === 'delivery'}
          onPress={() => setFulfillment('delivery')}
          isRTL={isRTL}
          title={t('delivery')}
          hint={`${cartStore.fee ? formatIQD(cartStore.fee, lang) : t('freeDelivery')}`}
        />
        <Option
          on={fulfillment === 'pickup'}
          onPress={() => setFulfillment('pickup')}
          isRTL={isRTL}
          title={t('pickup')}
          hint={t('pickupHint')}
        />

        <SectionTitle isRTL={isRTL}>{t('deliveryTime')}</SectionTitle>
        <Option
          on={when === 'now'}
          onPress={() => setWhen('now')}
          isRTL={isRTL}
          title={t('now')}
          hint={`${cartStore.eta} ${t('min')}`}
        />
        <Option
          on={when === 'later'}
          onPress={() => setWhen('later')}
          isRTL={isRTL}
          title={t('schedule')}
          hint={
            chosenSlot
              ? `${t(`day_${chosenSlot.dayLabel}`) || chosenSlot.dayLabel} · ${chosenSlot.window}`
              : t('pickSlot')
          }
        />
        {when === 'later' ? (
          <View style={{ gap: 10 }}>
            {/* Day chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {availableDays.map((d) => {
                const active = dayKey === d.dayKey
                return (
                  <SoftPress
                    key={d.dayKey}
                    onPress={() => {
                      setDayKey(d.dayKey)
                      setSlotId(d.slots[0]?.id || null)
                    }}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: active ? colors.ink : colors.card,
                      borderWidth: 1,
                      borderColor: active ? colors.ink : colors.line,
                      minWidth: 80,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '800',
                        color: active ? '#fff' : colors.ink,
                        fontSize: 13,
                      }}
                    >
                      {t(`day_${d.dayLabel}`) || d.dayLabel}
                    </Text>
                  </SoftPress>
                )
              })}
            </ScrollView>

            {/* Slot chips for the chosen day */}
            {daySlots.length === 0 ? (
              <Text style={{ color: colors.muted, textAlign: 'center', paddingVertical: 8 }}>
                {t('noSlots')}
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {daySlots.map((s) => {
                  const active = (slotId || daySlots[0]?.id) === s.id
                  return (
                    <SoftPress
                      key={s.id}
                      onPress={() => setSlotId(s.id)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: active ? colors.red : colors.card,
                        borderWidth: 1,
                        borderColor: active ? colors.red : colors.line,
                        minWidth: 96,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '700',
                          color: active ? '#fff' : colors.ink,
                          fontSize: 13,
                        }}
                      >
                        {s.window}
                      </Text>
                    </SoftPress>
                  )
                })}
              </View>
            )}
          </View>
        ) : null}

        <LabeledField label={t('orderNote')} isRTL={isRTL}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('notePlaceholder')}
            multiline
            style={{
              ...inputStyle(isRTL),
              backgroundColor: colors.card,
              minHeight: 88,
              textAlignVertical: 'top',
            }}
          />
        </LabeledField>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.line,
            borderLeftWidth: 3,
            borderLeftColor: colors.red,
          }}
        >
          <Text style={{ fontWeight: '800', marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>{t('orderSummary')}</Text>
          {cart.map((line) => {
            const p = getLiveProduct(line.storeId, line.productId)
            if (!p) return null
            return (
              <View
                key={`${line.productId}-${line.variantId || 'base'}`}
                style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 8 }}
              >
                <Text style={{ color: colors.muted, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {line.qty}× {productName(p, lang)}
                </Text>
                <Text style={{ fontWeight: '700' }}>{formatIQD(linePrice(line) * line.qty, lang)}</Text>
              </View>
            )
          })}
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 6 }} />
          {cartDiscount > 0 ? (
            <SummaryRow label={t('discount')} value={`−${formatIQD(cartDiscount, lang)}`} isRTL={isRTL} valueColor={colors.open} />
          ) : null}
          <SummaryRow
            label={fulfillment === 'pickup' ? t('pickup') : t('deliveryFee')}
            value={
              fulfillment === 'pickup' || effectiveFee === 0
                ? t('free')
                : formatIQD(effectiveFee, lang)
            }
            isRTL={isRTL}
            valueColor={fulfillment === 'pickup' || effectiveFee === 0 ? colors.open : colors.ink}
          />
          {coupon ? (
            <View
              style={{
                marginTop: 8,
                backgroundColor: colors.redSoft,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: colors.red, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                {t('couponApplied')}: {couponTitle}
              </Text>
            </View>
          ) : null}
          <View style={{ height: 1, backgroundColor: colors.line, marginTop: 10, marginBottom: 4 }} />
          <SummaryRow label={t('total')} value={formatIQD(effectivePayable, lang)} isRTL={isRTL} bold />
        </View>

        <SoftPress
          disabled={!canSubmit()}
          onPress={submit}
          style={{
            backgroundColor: colors.red,
            opacity: canSubmit() ? 1 : 0.5,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            ...shadow.soft,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
            {payState === 'confirming'
              ? t('paymentConfirming')
              : `${t('confirmOrder')} · ${formatIQD(effectivePayable, lang)}`}
          </Text>
        </SoftPress>
      </ScrollView>
    </SafeAreaView>
  )
}

function SectionTitle({ children, isRTL }) {
  return (
    <Text style={{ fontWeight: '800', fontSize: 15, marginTop: 4, textAlign: isRTL ? 'right' : 'left', color: colors.ink }}>
      {children}
    </Text>
  )
}

function LabeledField({ label, children, isRTL }) {
  return (
    <View>
      <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      {children}
    </View>
  )
}

function inputStyle(isRTL) {
  return {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.bg,
    textAlign: isRTL ? 'right' : 'left',
    color: colors.ink,
  }
}

function SummaryRow({ label, value, isRTL, bold, valueColor }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 6 }}>
      <Text style={{ fontWeight: bold ? '800' : '600', color: bold ? colors.ink : colors.muted }}>{label}</Text>
      <Text style={{ fontWeight: bold ? '800' : '700', color: valueColor || (bold ? colors.red : colors.ink) }}>{value}</Text>
    </View>
  )
}

function Option({ on, onPress, title, hint, icon, isRTL }) {
  return (
    <SoftPress
      onPress={onPress}
      style={{
        backgroundColor: on ? colors.redSoft : colors.card,
        borderWidth: 1.5,
        borderColor: on ? colors.red : colors.line,
        borderRadius: 16,
        padding: 14,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...(on ? shadow.soft : null),
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
        {icon ? (
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: on ? '#fff' : colors.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </View>
        ) : null}
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontWeight: '800', color: colors.ink }}>{title}</Text>
          {hint ? <Text style={{ color: colors.muted, marginTop: 2, fontSize: 12 }}>{hint}</Text> : null}
        </View>
      </View>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: on ? colors.red : colors.line,
          backgroundColor: on ? colors.red : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
      </View>
    </SoftPress>
  )
}
