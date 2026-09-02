import { useState } from 'react'
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronDown, ChevronUp, Headphones, Mail, MessageCircle, Phone } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import { useI18n } from '../context/I18nContext'
import { supportFaqs } from '../data/mock'
import { colors, radius } from '../theme'

export default function SupportScreen({ navigation }) {
  const { t, isRTL } = useI18n()
  const [openId, setOpenId] = useState(supportFaqs[0]?.id || null)

  const call = () => Linking.openURL('tel:+9647700001010').catch(() => Alert.alert(t('support'), '+964 770 000 1010'))
  const mail = () => Linking.openURL('mailto:support@m10.iq').catch(() => Alert.alert(t('support'), 'support@m10.iq'))
  const chat = () => Alert.alert(t('liveChat'), t('liveChatHint'))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('support')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: radius,
            padding: 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: colors.red,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Headphones size={22} color="#fff" />
          </View>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{t('helpCenter')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t('supportIntro')}</Text>
          </View>
        </View>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
          <Pressable
            onPress={call}
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 }}
          >
            <Phone size={18} color={colors.red} />
            <Text style={{ fontWeight: '800', fontSize: 12 }}>{t('callUs')}</Text>
          </Pressable>
          <Pressable
            onPress={chat}
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 }}
          >
            <MessageCircle size={18} color={colors.red} />
            <Text style={{ fontWeight: '800', fontSize: 12 }}>{t('liveChat')}</Text>
          </Pressable>
          <Pressable
            onPress={mail}
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 }}
          >
            <Mail size={18} color={colors.red} />
            <Text style={{ fontWeight: '800', fontSize: 12 }}>{t('emailUs')}</Text>
          </Pressable>
        </View>

        <Text style={{ fontWeight: '900', fontSize: 16, marginTop: 4 }}>{t('faq')}</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: radius, overflow: 'hidden' }}>
          {supportFaqs.map((item, idx) => {
            const open = openId === item.id
            const Chevron = open ? ChevronUp : ChevronDown
            return (
              <Pressable
                key={item.id}
                onPress={() => setOpenId(open ? null : item.id)}
                style={{
                  padding: 14,
                  borderBottomWidth: idx === supportFaqs.length - 1 ? 0 : 1,
                  borderBottomColor: colors.line,
                }}
              >
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ flex: 1, fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t(item.qKey)}</Text>
                  <Chevron size={18} color={colors.muted} />
                </View>
                {open ? (
                  <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 20, textAlign: isRTL ? 'right' : 'left' }}>
                    {t(item.aKey)}
                  </Text>
                ) : null}
              </Pressable>
            )
          })}
        </View>

        <Pressable
          onPress={() => Alert.alert(t('terms'), t('termsBody'))}
          style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}
        >
          <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t('terms')}</Text>
        </Pressable>
        <Pressable
          onPress={() => Alert.alert(t('privacy'), t('privacyBody'))}
          style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}
        >
          <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>{t('privacy')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
