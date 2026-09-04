// M10 is Expo SDK 54 (App Store / Play Store Expo Go).
// SDK 57 Expo Go (eas go / TestFlight) cannot open this project.
const app = require('./app.json')

const offline = process.env.EXPO_OFFLINE === '1' || process.env.CI === '1'

module.exports = {
  expo: {
    ...app.expo,
    sdkVersion: '54.0.0',
    runtimeVersion: app.expo.runtimeVersion,
    ios: {
      ...app.expo.ios,
      deploymentTarget: '15.1',
    },
    // Metro/Dokploy: do not let iOS Expo Go follow EAS Update.
    updates: offline
      ? { enabled: false }
      : app.expo.updates,
  },
}
