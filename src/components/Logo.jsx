import Svg, { Path, Rect } from 'react-native-svg'
import { colors } from '../theme'
import { LOGO_H, LOGO_PATH, LOGO_VB, LOGO_W } from '../assets/logoPath'

const ASPECT = LOGO_W / LOGO_H

/**
 * M10 wordmark traced from the original logo bitmap (same letterforms, no font swap).
 * `size` = height in px; width follows brand aspect.
 * `onBrand` = transparent bg for red app bars (white mark only).
 */
export default function Logo({ size = 44, rounded = true, onBrand = false }) {
  const height = size
  const width = Math.round(size * ASPECT)
  const bg = onBrand ? 'transparent' : colors.red

  return (
    <Svg
      width={width}
      height={height}
      viewBox={LOGO_VB}
      accessibilityLabel="M10"
      accessibilityRole="image"
      pointerEvents="none"
    >
      <Rect width={LOGO_W} height={LOGO_H} rx={rounded && !onBrand ? 28 : 0} fill={bg} />
      <Path d={LOGO_PATH} fill="#FFFFFF" fillRule="evenodd" />
    </Svg>
  )
}
