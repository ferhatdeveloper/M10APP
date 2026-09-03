import { useMemo } from 'react'
import { Platform, Text, View } from 'react-native'
import { Bike } from 'lucide-react-native'
import { colors, shadow } from '../theme'

// react-native-maps requires a Google Maps API key for full features on Android.
// We work around it by drawing OpenStreetMap tiles on top via UrlTile, which
// gives us a real Baghdad street map without needing any API key. iOS uses the
// native provider directly.
let MapView = null
let Marker = null
let Polyline = null
let UrlTile = null
try {
  const maps = require('react-native-maps')
  MapView = maps.MapView
  Marker = maps.Marker
  Polyline = maps.Polyline
  UrlTile = maps.UrlTile
} catch {
  /* keep null — fallback will render */
}

// OpenStreetMap tile URL template (no API key required). Use a real OSM subdomain
// to balance load across OSM's tile servers.
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_SUBDOMAINS = ['a', 'b', 'c']

// Default Baghdadi area when we don't have coordinates yet.
const DEFAULT_FALLBACK = {
  latitude: 33.3152,
  longitude: 44.3661,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
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
  const region = useMemo(() => {
    if (courier) {
      return {
        latitude: courier.lat,
        longitude: courier.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    }
    if (destination) {
      return {
        latitude: destination.lat,
        longitude: destination.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    }
    return DEFAULT_FALLBACK
  }, [courier?.lat, courier?.lng, destination?.lat, destination?.lng])

  if (!destination) return null

  // No MapView available (e.g. unsupported env). Render a clean placeholder.
  if (!MapView) {
    return (
      <View
        style={{
          height,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#0F1B2D',
          ...shadow.card,
          padding: 16,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 11 }}>Live tracking</Text>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 2 }}>{title || 'On the way'}</Text>
          {subtitle ? (
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4, fontSize: 12 }}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
          {showCourier && courier ? (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.yellow,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#fff',
              }}
            >
              <Bike size={20} color={colors.ink} />
            </View>
          ) : null}
          {etaLabel ? (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>{etaLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>
    )
  }

  // We have MapView — render a real map with OSM tiles and animated markers.
  // We intentionally use the default Google provider because it works without
  // any billing-enabled API key for basic display. UrlTile overlays OSM on top
  // so users see a real Baghdad street map.
  return (
    <View style={{ height, borderRadius: 20, overflow: 'hidden', ...shadow.card }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        region={region}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'}
        rotateEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
      >
        {Platform.OS === 'android' && UrlTile ? (
          <UrlTile
            urlTemplate={OSM_TILE_URL}
            maximumZ={19}
            zIndex={-1}
            tileSize={256}
            subdomains={OSM_SUBDOMAINS}
          />
        ) : null}

        <Marker
          coordinate={{ latitude: destination.lat, longitude: destination.lng }}
          title={title || 'Destination'}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.red,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#fff',
                }}
              />
            </View>
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 8,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: colors.red,
                marginTop: -2,
              }}
            />
          </View>
        </Marker>

        {showCourier && courier ? (
          <>
            <Marker
              coordinate={{ latitude: courier.lat, longitude: courier.lng }}
              title="Courier"
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.yellow,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 5,
                }}
              >
                <Bike size={22} color={colors.ink} />
              </View>
            </Marker>
            <Polyline
              coordinates={[
                { latitude: courier.lat, longitude: courier.lng },
                { latitude: destination.lat, longitude: destination.lng },
              ]}
              strokeColor={colors.red}
              strokeWidth={3}
              lineDashPattern={[6, 4]}
            />
          </>
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
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {etaLabel ? (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 12 }}>{etaLabel}</Text>
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            {title ? <Text style={{ color: '#fff', fontWeight: '800' }}>{title}</Text> : null}
            {subtitle ? (
              <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 2, fontSize: 12 }}>{subtitle}</Text>
            ) : null}
          </View>
        </View>
      )}
    </View>
  )
}
