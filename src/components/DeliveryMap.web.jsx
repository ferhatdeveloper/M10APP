import { Text, View } from 'react-native'
import { Bike, MapPin } from 'lucide-react-native'
import { colors, shadow } from '../theme'

function PlaceholderMap({ destination, courier, height, title, subtitle, isRTL, showCourier }) {
  const progress =
    courier && destination
      ? Math.min(
          1,
          Math.max(
            0,
            1 -
              (Math.abs(courier.lat - destination.lat) + Math.abs(courier.lng - destination.lng)) /
                0.08,
          ),
        )
      : 0.35
  const bikeLeft = `${10 + progress * 70}%`

  return (
    <View
      style={{
        height,
        borderRadius: 20,
        backgroundColor: colors.red,
        overflow: 'hidden',
        padding: 16,
        ...shadow.card,
      }}
    >
      <View style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundColor: '#000' }} />
      <View
        style={{
          position: 'absolute',
          left: 28,
          right: 28,
          top: '48%',
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.28)',
          transform: [{ rotate: isRTL ? '8deg' : '-8deg' }],
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 4,
            width: `${Math.max(12, progress * 100)}%`,
            backgroundColor: colors.yellow,
            borderRadius: 2,
            alignSelf: isRTL ? 'flex-end' : 'flex-start',
          }}
        />
      </View>

      {showCourier ? (
        <View
          style={{
            position: 'absolute',
            left: bikeLeft,
            top: '36%',
            marginLeft: -18,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.yellow,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bike size={18} color={colors.ink} />
        </View>
      ) : null}

      <View
        style={{
          position: 'absolute',
          right: isRTL ? undefined : 22,
          left: isRTL ? 22 : undefined,
          top: '42%',
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MapPin size={18} color={colors.red} />
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {title ? <Text style={{ fontWeight: '900', color: '#fff', fontSize: 18 }}>{title}</Text> : null}
        {subtitle ? (
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: '600' }}>{subtitle}</Text>
        ) : null}
        {destination ? (
          <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6, fontSize: 11, fontWeight: '600' }}>
            {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

export default function DeliveryMap({
  destination,
  courier,
  height = 236,
  title,
  subtitle,
  isRTL,
  showCourier = true,
  etaLabel,
}) {
  return (
    <View>
      <PlaceholderMap
        destination={destination}
        courier={courier}
        height={height}
        title={title}
        subtitle={subtitle}
        isRTL={isRTL}
        showCourier={showCourier && !!courier}
      />
      {etaLabel ? (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: isRTL ? undefined : 12,
            left: isRTL ? 12 : undefined,
            backgroundColor: colors.yellow,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontWeight: '900', fontSize: 12, color: colors.ink }}>{etaLabel}</Text>
        </View>
      ) : null}
    </View>
  )
}
