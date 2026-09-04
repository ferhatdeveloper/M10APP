// M10 is Expo SDK 57 — iPhone App Store Expo Go is 57-only.
// Metro must not follow EAS production (u.expo.dev runtime 1.0.0 / SDK 54).
// EXPO_TOKEN: keep projectId so CLI can mint an expo-root development cert.
// No token: strip EAS id and serve anonymous unsigned (iOS 57 App Store still asks login).
module.exports = ({ config }) => {
  const hasToken = Boolean(process.env.EXPO_TOKEN)
  const next = {
    ...config,
    name: 'M10 SDK57',
    slug: 'm10-metro57',
    sdkVersion: '57.0.0',
    runtimeVersion: '57.0.0',
    ios: {
      ...(config.ios || {}),
      deploymentTarget: '15.1',
    },
    updates: { enabled: false },
  }

  if (hasToken) {
    return next
  }

  next.owner = undefined
  next.extra = { ...(config.extra || {}) }
  delete next.extra.eas
  delete next.owner
  return next
}
