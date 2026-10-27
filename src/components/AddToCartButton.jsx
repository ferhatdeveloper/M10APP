import { useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import SoftPress from './SoftPress'
import { colors } from '../theme'

/**
 * Sepete ekle (+) — basınca scale + renk flash + kısa ✓ feedback.
 * Transform animasyonu SoftPress dışında tutulur (ScrollView hit-test).
 */
export default function AddToCartButton({ onPress, size = 32, color = colors.orange }) {
  const scale = useRef(new Animated.Value(1)).current
  const flash = useRef(new Animated.Value(0)).current
  const check = useRef(new Animated.Value(0)).current
  const busy = useRef(false)

  const play = () => {
    if (busy.current) return
    busy.current = true
    scale.setValue(1)
    flash.setValue(0)
    check.setValue(0)
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.35, friction: 3, tension: 220, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 1, duration: 90, useNativeDriver: false }),
        Animated.timing(check, { toValue: 1, duration: 80, useNativeDriver: false }),
      ]),
      Animated.spring(scale, { toValue: 0.92, friction: 5, tension: 200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
      Animated.delay(280),
      Animated.parallel([
        Animated.timing(flash, { toValue: 0, duration: 180, useNativeDriver: false }),
        Animated.timing(check, { toValue: 0, duration: 180, useNativeDriver: false }),
      ]),
    ]).start(() => {
      busy.current = false
    })
  }

  const bg = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', colors.yellow],
  })
  const ring = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0.06)', colors.ink],
  })

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <SoftPress
        onPress={() => {
          play()
          onPress?.()
        }}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Add to cart"
      >
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: ring,
            shadowColor: '#000',
            shadowOpacity: 0.16,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Text
              style={{
                position: 'absolute',
                color,
                fontWeight: '900',
                fontSize: size * 0.55,
                marginTop: -1,
                opacity: check.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              }}
            >
              +
            </Animated.Text>
            <Animated.Text
              style={{
                color: colors.ink,
                fontWeight: '900',
                fontSize: size * 0.48,
                opacity: check,
              }}
            >
              ✓
            </Animated.Text>
          </View>
        </Animated.View>
      </SoftPress>
    </Animated.View>
  )
}
