import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBar from '../components/TopBar'
import { DEMO_OTP, formatIqPhone, useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'

export default function VerifyScreen({ navigation, route }) {
  const phone = formatIqPhone(route.params?.phone || '')
  const { login, findAccount } = useApp()
  const { t, isRTL } = useI18n()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [needName, setNeedName] = useState(false)
  const [name, setName] = useState('')
  const [seconds, setSeconds] = useState(45)
  const [verifying, setVerifying] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!route.params?.phone) navigation.goBack()
  }, [route.params?.phone, navigation])

  useEffect(() => {
    if (seconds <= 0) return undefined
    const tmr = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(tmr)
  }, [seconds])

  const finish = (displayName) => {
    const next = login(phone, displayName)
    const courier = next?.role === 'courier'
    navigation.reset({
      index: 0,
      routes: [{ name: courier ? 'CourierHome' : 'Tabs' }],
    })
  }

  const submitCode = (value) => {
    if (value !== DEMO_OTP) {
      setError(t('otpError'))
      setVerifying(false)
      return
    }
    setError('')
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      const existing = findAccount(phone)
      if (existing?.name) {
        finish(existing.name)
        return
      }
      setNeedName(true)
    }, 500)
  }

  const onChangeCode = (v) => {
    const next = v.replace(/\D/g, '').slice(0, 5)
    setCode(next)
    setError('')
    if (next.length === 5) submitCode(next)
  }

  if (!phone) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]} />
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('verifyTitle')} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          {needName ? (
            <>
              <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
                {t('yourName')}
              </Text>
              <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>{t('nameHint')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('namePlaceholder')}
                placeholderTextColor={colors.muted}
                autoFocus
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.line,
                  padding: 14,
                  fontSize: 18,
                  fontWeight: '700',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              />
              <Pressable
                onPress={() => finish(name)}
                style={{ backgroundColor: colors.red, borderRadius: 14, padding: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{t('continue')}</Text>
              </Pressable>
              <Pressable onPress={() => finish()} style={{ padding: 12, alignItems: 'center' }}>
                <Text style={{ color: colors.red, fontWeight: '800' }}>{t('skip')}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
                {t('verifyTitle')}
              </Text>
              <Text style={{ color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>{t('verifySent', { phone })}</Text>

              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'center', gap: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const ch = code[i] || ''
                  const active = code.length === i
                  return (
                    <Pressable
                      key={i}
                      onPress={() => inputRef.current?.focus()}
                      style={{
                        width: 48,
                        height: 56,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: error ? colors.red : active ? colors.red : colors.line,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 22, fontWeight: '800' }}>{ch}</Text>
                    </Pressable>
                  )
                })}
              </View>
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={onChangeCode}
                keyboardType="number-pad"
                autoFocus
                maxLength={5}
                style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
              />

              {error ? <Text style={{ color: colors.red, fontWeight: '700', textAlign: 'center' }}>{error}</Text> : null}
              {verifying ? (
                <Text style={{ color: colors.open, fontWeight: '800', textAlign: 'center' }}>{t('verifying')}</Text>
              ) : null}

              <Pressable
                onPress={() => submitCode(code)}
                disabled={code.length !== 5 || verifying}
                style={{
                  backgroundColor: code.length === 5 ? colors.red : '#D0D0D0',
                  borderRadius: 14,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{t('continue')}</Text>
              </Pressable>

              <Pressable
                disabled={seconds > 0}
                onPress={() => {
                  setSeconds(45)
                  setCode('')
                  setError('')
                }}
                style={{ padding: 8, alignItems: 'center' }}
              >
                <Text style={{ color: seconds > 0 ? colors.muted : colors.red, fontWeight: '800' }}>
                  {seconds > 0 ? t('resendIn', { n: seconds }) : t('resendCode')}
                </Text>
              </Pressable>

              <Text style={{ color: colors.muted, textAlign: 'center' }}>{t('otpDemo')}</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
