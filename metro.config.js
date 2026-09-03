const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.resolver.sourceExts.push('cjs')

// Treat .glb (and other binary model formats) as assets so they can be
// `require()`d and resolved via expo-asset's Asset.fromModule at runtime.
if (!config.resolver.assetExts.includes('glb')) {
  config.resolver.assetExts = [...config.resolver.assetExts, 'glb']
}
if (!config.resolver.assetExts.includes('gltf')) {
  config.resolver.assetExts = [...config.resolver.assetExts, 'gltf']
}

// The default asset registry in Metro serves binary files as Asset modules.
// Ensure three's GLTFLoader is not resolved through npm imports — Expo handles it.

module.exports = config
