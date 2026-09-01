import { Pressable } from 'react-native'

/** Light press feedback — touch-first (pressed), not hover-only. */
export default function SoftPress({ style, children, disabled, ...rest }) {
  return (
    <Pressable
      disabled={disabled}
      // Opacity-only feedback — transform/scale breaks hit-testing inside ScrollViews on Android.
      style={(state) => {
        const base = typeof style === 'function' ? style(state) : style
        const pressed = state.pressed && !disabled
        return [base, pressed ? { opacity: 0.88 } : null]
      }}
      {...rest}
    >
      {children}
    </Pressable>
  )
}
