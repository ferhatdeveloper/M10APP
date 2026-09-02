import { Pressable, Text, View } from 'react-native'
import { WifiOff } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'

export default function OfflineBanner() {
  const { isOffline, setOfflineSim, simulateOffline } = useApp()
  const { t, isRTL } = useI18n()
  if (!isOffline) return null

  return (
    <View
      style={{
        backgroundColor: colors.ink,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <WifiOff size={16} color={colors.yellow} />
      <Text style={{ flex: 1, color: '#fff', fontWeight: '700', fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
        {t('offlineBanner')}
      </Text>
      {simulateOffline ? (
        <Pressable onPress={() => setOfflineSim(false)} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 12 }}>{t('goOnline')}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
