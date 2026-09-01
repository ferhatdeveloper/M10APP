import { useMemo } from 'react'
import { Text, View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { Bike } from 'lucide-react-native'
import { colors, shadow } from '../theme'

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
  const region = useMemo(() => {
    const lat = courier?.lat ?? destination?.lat ?? 36.2
    const lng = courier?.lng ?? destination?.lng ?? 44.01
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }
  }, [courier?.lat, courier?.lng, destination?.lat, destination?.lng])

  if (!destination) return null

  return (
    <View style={{ height, borderRadius: 20, overflow: 'hidden', ...shadow.card }}>
      <MapView style={{ flex: 1 }} initialRegion={region} region={region}>
        <Marker
          coordinate={{ latitude: destination.lat, longitude: destination.lng }}
          title={title || 'Destination'}
          pinColor={colors.red}
        />
        {showCourier && courier ? (
          <Marker
            coordinate={{ latitude: courier.lat, longitude: courier.lng }}
            title="Courier"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.yellow,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.ink,
              }}
            >
              <Bike size={18} color={colors.ink} />
            </View>
          </Marker>
        ) : null}
        {showCourier && courier ? (
          <Polyline
            coordinates={[
              { latitude: courier.lat, longitude: courier.lng },
              { latitude: destination.lat, longitude: destination.lng },
            ]}
            strokeColor={colors.red}
            strokeWidth={3}
          />
        ) : null}
      </MapView>
      {(title || etaLabel) && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            backgroundColor: 'rgba(22,22,22,0.78)',
            borderRadius: 12,
            padding: 10,
          }}
        >
          {etaLabel ? (
            <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>{etaLabel}</Text>
          ) : null}
          {title ? <Text style={{ color: '#fff', fontWeight: '800', marginTop: etaLabel ? 2 : 0 }}>{title}</Text> : null}
          {subtitle ? <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 2, fontSize: 12 }}>{subtitle}</Text> : null}
        </View>
      )}
    </View>
  )
}
