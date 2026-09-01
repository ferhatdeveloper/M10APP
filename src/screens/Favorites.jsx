import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Heart } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import StoreCard from '../components/StoreCard'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { colors } from '../theme'

export default function FavoritesScreen({ navigation }) {
  const { favorites, getLiveStore } = useApp()
  const { t } = useI18n()
  const list = favorites.map((id) => getLiveStore(id)).filter(Boolean)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('favorites')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {list.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Heart size={36} color={colors.red} />
            <Text style={{ fontWeight: '800', marginTop: 12 }}>{t('noFavs')}</Text>
            <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center' }}>{t('starHint')}</Text>
          </View>
        ) : (
          list.map((s) => <StoreCard key={s.id} store={s} onPress={() => navigation.navigate('Store', { id: s.id })} />)
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
