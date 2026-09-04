// M10 is Expo SDK 57 — iPhone App Store Expo Go is 57-only.
// Metro must not follow EAS production (u.expo.dev runtime 1.0.0 / SDK 54).
// EXPO_TOKEN: sign with @ferhatnas/m10-metro57 (ferhatnas cannot read the old EAS id).
// No token: strip EAS id and serve anonymous unsigned (iOS 57 App Store still asks login).
const METRO_SIGN_OWNER = 'ferhatnas'
const METRO_SIGN_PROJECT_ID = '4f79600d-f438-4bcc-9c99-4ec6fedf6b86'

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
    next.owner = METRO_SIGN_OWNER
    next.extra = {
      ...(config.extra || {}),
      eas: { projectId: METRO_SIGN_PROJECT_ID },
    }
    return next
  }

  next.owner = undefined
  next.extra = { ...(config.extra || {}) }
  delete next.extra.eas
  delete next.owner
  return next
}
