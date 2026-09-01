import { useEffect } from 'react'
import { View } from 'react-native'
import { colors } from '../theme'
import { STOREFRONT_MAX, isWeb, useWebLayout } from '../layout/web'

export default function StorefrontFrame({ children }) {
  const { desktop } = useWebLayout()

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return undefined
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = desktop ? '#E4E4E6' : colors.bg
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [desktop])

  if (!isWeb) return children

  return (
    <View style={{ flex: 1, backgroundColor: desktop ? '#E4E4E6' : colors.bg, alignItems: 'center' }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          maxWidth: STOREFRONT_MAX,
          height: '100%',
          backgroundColor: colors.bg,
          ...(desktop
            ? {
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#D8D8DC',
              }
            : null),
        }}
      >
        {children}
      </View>
    </View>
  )
}
