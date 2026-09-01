import { Platform } from 'react-native'

/**
 * iOS Safari / Add to Home Screen meta tags for Expo web (apk.retailex.app).
 * Ensures viewport-fit=cover so SafeAreaInsets match the notch / home indicator.
 */
export function ensureIosWebMeta() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return

  const setMeta = (name, content) => {
    let el = document.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  setMeta(
    'viewport',
    'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no',
  )
  setMeta('apple-mobile-web-app-capable', 'yes')
  setMeta('mobile-web-app-capable', 'yes')
  setMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')
  setMeta('apple-mobile-web-app-title', 'M10')
  setMeta('theme-color', '#E31E24')
  setMeta('format-detection', 'telephone=no')

  const ensureLink = (rel, href, sizes) => {
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
    if (sizes) el.setAttribute('sizes', sizes)
  }

  ensureLink('apple-touch-icon', '/apple-touch-icon.png', '180x180')
  ensureLink('manifest', '/manifest.json')
}
