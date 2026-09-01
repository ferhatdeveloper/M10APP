import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CreditCard, Smartphone, Wallet as WalletIcon } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, WALLET_TOPUPS } from '../data/mock'
import { colors } from '../theme'

export default function WalletScreen({ navigation }) {
  const { walletBalance, topUpWallet, isLoggedIn } = useApp()
  const { t, lang, isRTL } = useI18n()

  const topUp = (amount) => {
    topUpWallet(amount)
    Alert.alert(t('walletTitle'), t('walletTopped', { n: formatIQD(amount, lang) }))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('walletTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View
          style={{
            backgroundColor: colors.red,
            borderRadius: 20,
            padding: 20,
            minHeight: 140,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
            <WalletIcon size={20} color={colors.yellow} />
            <Text style={{ color: '#fff', fontWeight: '800' }}>M10 {t('walletTitle')}</Text>
          </View>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{t('balance')}</Text>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 32, marginTop: 4 }}>
              {formatIQD(walletBalance, lang)}
            </Text>
          </View>
        </View>

        <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t('topUp')}</Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          {WALLET_TOPUPS.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => (isLoggedIn ? topUp(amt) : navigation.navigate('Login'))}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: colors.line,
                minWidth: '30%',
                flexGrow: 1,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '800', color: colors.red }}>+{formatIQD(amt, lang)}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 12 }}>
          <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t('payMethodsDemo')}</Text>
          <PayRow icon={Smartphone} title="Apple Pay" hint={t('applePayHint')} isRTL={isRTL} />
          <PayRow icon={Smartphone} title="Google Pay" hint={t('googlePayHint')} isRTL={isRTL} />
          <PayRow icon={CreditCard} title={t('card')} hint={t('cardDemoHint')} isRTL={isRTL} last />
        </View>

        <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center' }}>{t('walletDemoHint')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function PayRow({ icon: Icon, title, hint, isRTL, last }) {
  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        gap: 10,
        alignItems: 'center',
        paddingBottom: last ? 0 : 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
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
        <Icon size={18} color={colors.red} />
      </View>
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontWeight: '800' }}>{title}</Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{hint}</Text>
      </View>
    </View>
  )
}
