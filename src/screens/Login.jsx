import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Apple, BookOpen, Chrome } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import Logo from '../components/Logo'
import SoftPress from '../components/SoftPress'
import { formatIqPhone, isValidIqPhone, useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { DEMO_ACCOUNTS } from '../data/mock'
import { colors } from '../theme'

export default function LoginScreen({ navigation }) {
  const { t, isRTL } = useI18n()
  const { loginWithProvider } = useApp()
  const handleSocial = (provider) => {
    Alert.alert(provider === 'google' ? 'Google' : 'Apple', t('signInMockNotice'))
    setTimeout(() => {
      loginWithProvider(provider)
      navigation.replace('Tabs')
    }, 700)
  }
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const onChangePhone = (v) => {
    setError('')
    setPhone(formatIqPhone(v))
  }

  const submit = () => {
    if (!isValidIqPhone(phone)) {
      setError(t('phoneInvalid'))
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      navigation.navigate('Verify', { phone: formatIqPhone(phone) })
    }, 650)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('loginSignup')} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <Logo size={64} />
            <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800', marginTop: 14, textAlign: 'center' }}>
              {t('phoneTitle')}
            </Text>
            <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center' }}>{t('phoneHint')}</Text>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: error ? colors.red : colors.line,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderRightWidth: isRTL ? 0 : 1,
                borderLeftWidth: isRTL ? 1 : 0,
                borderColor: colors.line,
              }}
            >
              <Text style={{ fontWeight: '800', color: colors.ink }}>🇮🇶 +964</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{t('iraq')}</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={onChangePhone}
              placeholder={t('phonePlaceholder')}
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              autoFocus
              maxLength={13}
              style={{
                flex: 1,
                paddingHorizontal: 14,
                paddingVertical: 14,
                fontSize: 18,
                fontWeight: '700',
                color: colors.ink,
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
          </View>
          {error ? <Text style={{ color: colors.red, fontWeight: '700' }}>{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={sending}
            style={{
              backgroundColor: colors.red,
              borderRadius: 14,
              padding: 16,
              alignItems: 'center',
              opacity: sending ? 0.7 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
              {sending ? t('sendingCode') : t('sendCode')}
            </Text>
          </Pressable>

          <View style={{ backgroundColor: '#FFF8D6', borderRadius: 12, padding: 12 }}>
            <Text style={{ fontWeight: '800', color: colors.ink, textAlign: 'center' }}>{t('otpDemo')}</Text>
            <Text style={{ color: colors.muted, marginTop: 4, textAlign: 'center', fontSize: 12 }}>{t('loginDemoHint')}</Text>
          </View>

          {/* Social login row */}
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: 10,
              marginTop: 8,
            }}
          >
            <SoftPress
              onPress={() => handleSocial('google')}
              style={{
                flex: 1,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: colors.line,
              }}
            >
              <Chrome size={18} color="#4285F4" />
              <Text style={{ fontWeight: '800' }}>{t('signInGoogle')}</Text>
            </SoftPress>
            <SoftPress
              onPress={() => handleSocial('apple')}
              style={{
                flex: 1,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: '#000',
              }}
            >
              <Apple size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{t('signInApple')}</Text>
            </SoftPress>
          </View>

          <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left', marginTop: 18 }}>{t('demoAccounts')}</Text>

          <SoftPress
            onPress={() => navigation.navigate('Presentation')}
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.line,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 12,
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
              <BookOpen size={18} color={colors.red} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontWeight: '800', color: colors.ink }}>{t('documentation')}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{t('documentationHint')}</Text>
            </View>
          </SoftPress>
          {DEMO_ACCOUNTS.map((acc) => (
            <Pressable
              key={acc.phone}
              onPress={() => {
                setError('')
                setPhone(formatIqPhone(acc.phone))
              }}
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.line,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontWeight: '800' }}>{acc.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{acc.phone}</Text>
              </View>
              <View
                style={{
                  backgroundColor: acc.role === 'courier' ? colors.yellow : colors.redSoft,
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                  <Text style={{ fontWeight: '800', fontSize: 11, color: colors.ink }}>
                  {t(`demoMode.${acc.role === 'courier' ? 'courier' : acc.role === 'admin' ? 'admin' : 'customer'}`)}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
