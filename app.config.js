// M10 is Expo SDK 57 — iPhone App Store Expo Go is 57-only.
module.exports = ({ config }) => {
  const offline = process.env.EXPO_OFFLINE === '1' || process.env.CI === '1'
  return {
    ...config,
    sdkVersion: '57.0.0',
    runtimeVersion: config.runtimeVersion || '57.0.0',
    ios: {
      ...(config.ios || {}),
      deploymentTarget: '15.1',
    },
    updates: offline
      ? { enabled: false }
      : config.updates,
  }
}
