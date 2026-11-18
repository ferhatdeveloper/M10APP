/**
 * Web M10 mark — crisp PNG (not the jagged traced SVG).
 * `size` = height/width in px (square badge).
 * `onBrand` = no extra shadow (for red bars).
 */
export default function Logo({ size = 44, className = '', rounded = true, onBrand = false }) {
  const px = size

  return (
    <img
      src="/m10-logo.png"
      alt="M10"
      width={px}
      height={px}
      className={[
        'm10-logo',
        rounded ? 'rounded' : '',
        onBrand ? 'on-brand' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: px, height: px, display: 'block', objectFit: 'cover' }}
      draggable={false}
    />
  )
}
