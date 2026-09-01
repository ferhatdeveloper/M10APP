import { Image, Text, View } from 'react-native'
import { Clock3, Star, Truck } from 'lucide-react-native'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, storeName } from '../data/mock'
import { logoImg, src } from '../utils/images'
import SoftPress from './SoftPress'
import { colors, shadow } from '../theme'
import Logo from './Logo'

export default function StoreCard({ store, onPress, compact }) {
  const { favorites, toggleFavorite } = useApp()
  const { t, lang, isRTL } = useI18n()
  const on = favorites.includes(store.id)
  const soon = !!store.comingSoon
  const statusLabel = t(store.status)
  const statusBg = soon
    ? '#FFF8D6'
    : store.status === 'open'
      ? colors.openBg
      : store.status === 'busy'
        ? colors.busyBg
        : '#F1F1F1'
  const statusFg = soon ? colors.ink : store.status === 'open' ? colors.open : store.status === 'busy' ? colors.busy : '#666'
  const cover = soon ? logoImg : src(store.cover)

  if (compact) {
    return (
      <SoftPress
        onPress={onPress}
        style={{
          width: 156,
          backgroundColor: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.line,
          marginRight: 10,
          ...shadow.soft,
        }}
      >
        <View style={{ height: 96, backgroundColor: soon ? '#fff' : '#eee', alignItems: 'center', justifyContent: 'center' }}>
          {soon ? (
            <Logo size={52} />
          ) : (
            <Image source={cover} style={{ width: '100%', height: '100%' }} />
          )}
          {soon ? (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(22,22,22,0.72)',
                paddingVertical: 5,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 11 }}>{t('comingSoon')}</Text>
            </View>
          ) : store.fee === 0 ? (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: isRTL ? undefined : 8,
                right: isRTL ? 8 : undefined,
                backgroundColor: colors.yellow,
                borderRadius: 8,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ color: colors.ink, fontWeight: '900', fontSize: 9 }}>{t('filters.freeDelivery')}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ padding: 10 }}>
          <Text numberOfLines={1} style={{ fontWeight: '800', fontSize: 13, color: colors.ink }}>
            {storeName(store, lang)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, fontWeight: '600' }}>
            {soon ? t('comingSoon') : `★ ${store.rating} · ${store.eta} ${t('min')}`}
          </Text>
        </View>
      </SoftPress>
    )
  }

  return (
    <SoftPress
      onPress={onPress}
      style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 12, ...shadow.card }}
    >
      <View style={{ height: 140, backgroundColor: soon ? '#fff' : '#eee', alignItems: 'center', justifyContent: 'center' }}>
        {soon ? (
          <Logo size={72} />
        ) : (
          <Image source={cover} style={{ width: '100%', height: '100%' }} />
        )}
        {soon ? (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'rgba(22,22,22,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{t('comingSoon')}</Text>
          </View>
        ) : (
          <SoftPress
            onPress={() => toggleFavorite(store.id)}
            style={{
              position: 'absolute',
              top: 10,
              left: isRTL ? undefined : 10,
              right: isRTL ? 10 : undefined,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              ...shadow.soft,
            }}
          >
            <Star size={18} color={on ? colors.yellow : '#C9C9C9'} fill={on ? colors.yellow : 'none'} />
          </SoftPress>
        )}
      </View>
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
            {storeName(store, lang)}
          </Text>
          <View style={{ backgroundColor: statusBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: statusFg, fontSize: 11, fontWeight: '800' }}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={{ color: colors.muted, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
          {soon ? t('comingSoonHint') : store.tags.join(' · ')}
        </Text>
        {soon ? null : (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, marginTop: 10 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>★ {store.rating}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock3 size={12} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
                {store.eta} {t('min')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Truck size={12} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>{formatIQD(store.fee, lang)}</Text>
            </View>
          </View>
        )}
      </View>
    </SoftPress>
  )
}
