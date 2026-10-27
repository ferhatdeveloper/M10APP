// M10 is Expo SDK 58 — iPhone App Store Expo Go is 58-only.
// Metro must not follow EAS production (u.expo.dev runtime 1.0.0 / SDK 54).
// EXPO_TOKEN: keep projectId so CLI can mint an expo-root development cert.
// No token: strip EAS id and serve anonymous unsigned (iOS may still ask login).
module.exports = ({ config }) => {
  const hasToken = Boolean(process.env.EXPO_TOKEN)
  const next = {
    ...config,
    name: 'M10 Market',
    slug: 'm10-metro58',
    sdkVersion: '58.0.0',
    runtimeVersion: '58.0.0',
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
