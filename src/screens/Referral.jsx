import { useState } from 'react'
import { Alert, Pressable, Share, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gift, Share2 } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { REFERRAL_BONUS, REFERRAL_REDEEM_BONUS } from '../data/mock'
import { colors } from '../theme'

export default function ReferralScreen({ navigation }) {
  const { user, isLoggedIn, redeemReferral, shareReferralCredit } = useApp()
  const { t, isRTL } = useI18n()
  const [code, setCode] = useState('')
  const myCode = user?.referralCode || 'M10-1000'

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
        <TopBar title={t('referralTitle')} onBack={() => navigation.goBack()} />
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800', fontSize: 18 }}>{t('loginRequired')}</Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: 16, backgroundColor: colors.red, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>{t('loginSignup')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const onShare = async () => {
    try {
      await Share.share({ message: t('referralShareMsg', { code: myCode }) })
      shareReferralCredit()
      Alert.alert(t('referralTitle'), t('referralShareBonus', { n: REFERRAL_BONUS }))
    } catch {
      shareReferralCredit()
    }
  }

  const onRedeem = () => {
    const res = redeemReferral(code)
    if (!res.ok) {
      const map = {
        auth: t('loginRequired'),
        already: t('referralAlready'),
        self: t('referralSelf'),
        invalid: t('referralInvalid'),
      }
      Alert.alert(t('referralTitle'), map[res.reason] || t('referralInvalid'))
      return
    }
    Alert.alert(t('referralTitle'), t('referralOk', { n: res.points }))
    setCode('')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('referralTitle')} onBack={() => navigation.goBack()} />
      <View style={{ padding: 16, gap: 14 }}>
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: 18,
            padding: 18,
            borderLeftWidth: 4,
            borderLeftColor: colors.yellow,
          }}
        >
          <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>M10 INVITE</Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22, marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
            {t('referralHero')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
            {t('referralHint', { invite: REFERRAL_BONUS, redeem: REFERRAL_REDEEM_BONUS })}
          </Text>
          <View
            style={{
              marginTop: 16,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 28, letterSpacing: 2 }}>{myCode}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4, fontSize: 12 }}>
              {t('referralCount', { n: user.referralCount || 0 })}
            </Text>
          </View>
          <Pressable
            onPress={onShare}
            style={{
              marginTop: 14,
              backgroundColor: colors.yellow,
              borderRadius: 12,
              padding: 14,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Share2 size={18} color={colors.ink} />
            <Text style={{ fontWeight: '800', color: colors.ink }}>{t('shareCode')}</Text>
          </Pressable>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 10 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
            <Gift size={18} color={colors.red} />
            <Text style={{ fontWeight: '800' }}>{t('enterReferral')}</Text>
          </View>
          {user.referredBy ? (
            <Text style={{ color: colors.open, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
              {t('referralUsed', { code: user.referredBy })}
            </Text>
          ) : (
            <>
              <TextInput
                value={code}
                onChangeText={(v) => setCode(v.toUpperCase())}
                placeholder="M10-1234"
                autoCapitalize="characters"
                style={{
                  borderWidth: 1,
                  borderColor: colors.line,
                  borderRadius: 12,
                  padding: 14,
                  fontWeight: '800',
                  letterSpacing: 1,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              />
              <Pressable
                onPress={onRedeem}
                style={{ backgroundColor: colors.red, borderRadius: 12, padding: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>{t('applyReferral')}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
