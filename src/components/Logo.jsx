import { Image } from 'react-native'

const LOGO = require('../../assets/kucoglu-logo.png')
/** Native asset size: 727×539 */
const ASPECT = 727 / 539

/**
 * Kuçoglu Restaurant mark (black ground + beige wordmark).
 * `size` = height in px; width follows brand aspect.
 * `onBrand` = no extra chrome — sits flush on black app bars.
 */
export default function Logo({ size = 44, rounded = true, onBrand = false }) {
  const height = size
  const width = Math.round(size * ASPECT)

  return (
    <Image
      source={LOGO}
      style={{
        width,
        height,
        borderRadius: rounded && !onBrand ? 10 : 0,
        backgroundColor: 'transparent',
      }}
      resizeMode="contain"
      accessibilityLabel="KUÇ OGLU RESTAURANT"
      accessibilityRole="image"
      pointerEvents="none"
    />
  )
}
