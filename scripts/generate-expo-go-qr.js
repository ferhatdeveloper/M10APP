#!/usr/bin/env node
const { execFileSync } = require('child_process')
const path = require('path')

const url = process.env.EXPO_GO_URL || 'exp://72.60.182.107:8081'
const root = path.join(__dirname, '..')
// EAS QR (u.expo.dev SDK 54) iPhone Expo Go 57'de açılmaz — Metro URL'sine çek.
const files = [
  'apk-retailex-expo-go-qr.png',
  'expo-go-qr.png',
  'apk-retailex-eas-update-qr.png',
]

for (const file of files) {
  execFileSync('npx', ['--yes', 'qrcode@1.5.4', '-w', '512', url, '-o', file], {
    cwd: root,
    stdio: 'inherit',
  })
}
console.log(`Expo Go QR: ${url}`)
