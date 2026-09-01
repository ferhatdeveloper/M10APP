import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, Sparkles, Truck, Headphones, Star } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, M10_PLUS } from '../data/mock'
import { colors, radius } from '../theme'

const BENEFITS = [
  { key: 'plusBenefitDelivery', Icon: Truck },
  { key: 'plusBenefitSupport', Icon: Headphones },
  { key: 'plusBenefitPoints', Icon: Star },
]

export default function PlusScreen({ navigation }) {
  const { user, isLoggedIn, subscribePlus, cancelPlus } = useApp()
  const { t, lang, isRTL } = useI18n()
  const active = !!user?.m10Plus?.active
  const expires = user?.m10Plus?.expiresAt
    ? new Date(user.m10Plus.expiresAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'tr' ? 'tr-TR' : 'ar-IQ')
    : null

  const onSubscribe = () => {
    if (!isLoggedIn) {
      Alert.alert(t('plusTitle'), t('loginRequired'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('loginSignup'), onPress: () => navigation.navigate('Login') },
      ])
      return
    }
    subscribePlus()
    Alert.alert(t('plusTitle'), t('plusActivated'))
  }

  const onCancel = () => {
    Alert.alert(t('plusCancel'), t('plusCancelConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('plusCancel'),
        style: 'destructive',
        onPress: () => {
          cancelPlus()
          Alert.alert(t('plusTitle'), t('plusCancelled'))
        },
      },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('plusTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: radius,
            padding: 18,
            overflow: 'hidden',
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.yellow,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={22} color={colors.ink} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 22 }}>{t('plusTitle')}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{t('plusSubtitle')}</Text>
            </View>
          </View>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 28, marginTop: 16 }}>
            {formatIQD(M10_PLUS.monthlyPrice, lang)}
            <Text style={{ fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}> / {t('perMonth')}</Text>
          </Text>
          {active ? (
            <View
              style={{
                marginTop: 12,
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                backgroundColor: colors.openBg,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Check size={14} color={colors.open} />
              <Text style={{ color: colors.open, fontWeight: '800', fontSize: 12 }}>
                {t('plusActiveUntil', { date: expires || '—' })}
              </Text>
            </View>
          ) : null}
          <View style={{ height: 4, backgroundColor: colors.red, marginTop: 16, borderRadius: 2 }} />
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: radius, padding: 14, gap: 12 }}>
          <Text style={{ fontWeight: '900', textAlign: isRTL ? 'right' : 'left' }}>{t('plusBenefits')}</Text>
          {BENEFITS.map(({ key, Icon }) => (
            <View key={key} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, alignItems: 'center' }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: colors.redSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={colors.red} />
              </View>
              <Text style={{ flex: 1, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>{t(key)}</Text>
            </View>
          ))}
        </View>

        {active ? (
          <Pressable
            onPress={onCancel}
            style={{
              borderWidth: 1.5,
              borderColor: colors.line,
              borderRadius: 14,
              padding: 14,
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontWeight: '800', color: colors.red }}>{t('plusCancel')}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onSubscribe}
            style={{ backgroundColor: colors.red, borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{t('plusSubscribe')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4, fontSize: 12 }}>{t('plusDemoHint')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
