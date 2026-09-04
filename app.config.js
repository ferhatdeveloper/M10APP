// M10 is Expo SDK 57 — iPhone App Store Expo Go is 57-only.
// Metro (EXPO_OFFLINE/CI) must not look like the EAS production project:
// u.expo.dev still serves SDK 54 / runtime 1.0.0 for slug "m10".
module.exports = ({ config }) => {
  const offline = process.env.EXPO_OFFLINE === '1' || process.env.CI === '1'
  const next = {
    ...config,
    sdkVersion: '57.0.0',
    runtimeVersion: '57.0.0',
    ios: {
      ...(config.ios || {}),
      deploymentTarget: '15.1',
    },
  }

  if (!offline) {
    next.updates = config.updates
    return next
  }

  // Distinct from cached Expo Go "M10" / EAS project (SDK 54).
  next.name = 'M10 SDK57'
  next.slug = 'm10-metro57'
  next.owner = undefined
  next.updates = { enabled: false }
  next.extra = { ...(config.extra || {}) }
  delete next.extra.eas
  delete next.owner
  return next
}
