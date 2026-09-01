import { Text, View } from 'react-native'
import { Star } from 'lucide-react-native'
import { colors } from '../../theme'

function Stars({ n, color = colors.yellow }) {
  const v = Math.max(0, Math.min(5, Math.round(Number(n) || 0)))
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} color={i <= v ? color : colors.line} fill={i <= v ? color : 'transparent'} />
      ))}
    </View>
  )
}

export default function AdminFeedback({ t, lang, isRTL, surveys, orders }) {
  const fromOrders = (orders || [])
    .filter((o) => o.rating)
    .map((o) => ({
      orderId: o.id,
      storeStars: o.rating.store,
      courierStars: o.rating.courier,
      comment: o.rating.comment || '',
      answers: o.rating.answers || {},
      at: o.rating.at || o.createdAt,
    }))

  const merged = [...(surveys || []), ...fromOrders]
  const seen = new Set()
  const list = merged
    .filter((s) => {
      const key = `${s.orderId}-${s.at}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => (b.at || 0) - (a.at || 0))
    .slice(0, 40)

  if (!list.length) {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.line,
          padding: 24,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: colors.muted, fontWeight: '700', textAlign: 'center' }}>{t('adminNoFeedback')}</Text>
      </View>
    )
  }

  return (
    <>
      <Text style={{ fontWeight: '900', fontSize: 16, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
        {t('adminFeedbackTitle')}
      </Text>
      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
        {t('adminFeedbackHint')}
      </Text>
      {list.map((s, idx) => (
        <View
          key={`${s.orderId}-${s.at}-${idx}`}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.line,
            padding: 14,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: '800' }}>{s.orderId || '—'}</Text>
            <Text style={{ color: colors.muted, fontSize: 11 }}>
              {s.at
                ? new Date(s.at).toLocaleString(lang === 'ar' ? 'ar' : lang === 'tr' ? 'tr-TR' : 'en')
                : '—'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: 16,
              marginTop: 10,
              flexWrap: 'wrap',
            }}
          >
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 4 }}>
              <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '700' }}>{t('adminStoreRating')}</Text>
              <Stars n={s.storeStars} />
            </View>
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 4 }}>
              <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '700' }}>{t('adminCourierRating')}</Text>
              <Stars n={s.courierStars} />
            </View>
          </View>
          {s.comment ? (
            <Text style={{ marginTop: 10, textAlign: isRTL ? 'right' : 'left', color: colors.ink }}>
              “{s.comment}”
            </Text>
          ) : null}
          {s.answers && Object.keys(s.answers).length ? (
            <Text style={{ marginTop: 6, fontSize: 11, color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>
              {Object.entries(s.answers)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ')}
            </Text>
          ) : null}
        </View>
      ))}
    </>
  )
}
