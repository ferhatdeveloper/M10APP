import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import Logo from '../components/Logo'
import { colors } from '../theme'

export default function LanguageScreen({ navigation }) {
  const { t, lang, setLang, langs, isRTL } = useI18n()
  const { isCourier } = useApp()

  const pick = async (id) => {
    await setLang(id)
    navigation.replace(isCourier ? 'CourierHome' : 'PermissionsIntro')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.red }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <Logo size={88} onBrand />
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 14, fontStyle: 'italic' }}>M10</Text>
          <Text style={{ color: colors.yellow, fontWeight: '800', marginTop: 6 }}>{t('tagline')}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 18, fontSize: 18, fontWeight: '800' }}>
            {t('chooseLanguage')}
          </Text>
        </View>
        {langs.map((l) => {
          const on = lang === l.id
          return (
            <Pressable
              key={l.id}
              onPress={() => pick(l.id)}
              style={{
                backgroundColor: on ? colors.yellow : '#fff',
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>{l.native}</Text>
              <Text style={{ fontWeight: '700', color: colors.muted }}>{l.id.toUpperCase()}</Text>
            </Pressable>
          )
        })}
      </View>
    </SafeAreaView>
  )
}
