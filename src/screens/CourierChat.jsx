import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Send } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors, radius, shadow } from '../theme'

export default function CourierChatScreen({ navigation, route }) {
  const { orderId, courierName = 'Hasan' } = route.params || {}
  const { t, isRTL } = useI18n()
  const { getCourierChat, sendCourierMessage } = useApp()
  const messages = getCourierChat(orderId)
  const [text, setText] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60)
  }, [messages.length])

  const send = () => {
    if (!text.trim()) return
    sendCourierMessage(orderId, text)
    setText('')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar
        title={`${t('courierChat')} · ${courierName}`}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 14, gap: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.length === 0 ? (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 16,
                alignItems: 'center',
                ...shadow.soft,
              }}
            >
              <Text style={{ fontSize: 28 }}>👋</Text>
              <Text style={{ fontWeight: '800', marginTop: 6 }}>
                {t('courierChatHint')}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {courierName}
              </Text>
            </View>
          ) : null}
          {messages.map((m, i) => {
            const mine = m.from === 'me'
            return (
              <View
                key={i}
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '78%',
                  backgroundColor: mine ? colors.red : '#fff',
                  borderRadius: 14,
                  borderTopRightRadius: mine ? 4 : 14,
                  borderTopLeftRadius: mine ? 14 : 4,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  ...shadow.soft,
                }}
              >
                {!mine ? (
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 10,
                      fontWeight: '800',
                      marginBottom: 2,
                    }}
                  >
                    {t('courierChatCourier')}
                  </Text>
                ) : null}
                <Text style={{ color: mine ? '#fff' : colors.ink, fontSize: 14 }}>
                  {m.text}
                </Text>
              </View>
            )
          })}
        </ScrollView>

        {/* Composer */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderTopWidth: 1,
            borderColor: colors.line,
            backgroundColor: '#fff',
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('courierChatHint')}
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.bg,
              borderRadius: 22,
              paddingHorizontal: 14,
              paddingVertical: 10,
              color: colors.ink,
              textAlign: isRTL ? 'right' : 'left',
            }}
            onSubmitEditing={send}
          />
          <SoftPress
            onPress={send}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.red,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={18} color="#fff" />
          </SoftPress>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}