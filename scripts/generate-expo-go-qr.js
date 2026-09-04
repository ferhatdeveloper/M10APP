#!/usr/bin/env node
const { execFileSync } = require('child_process')
const path = require('path')

const domainUrl = process.env.EXPO_GO_URL || 'exp://metro.retailex.app'
const ipUrl = process.env.EXPO_GO_IP_URL || 'exp://72.60.182.107:8081'
const root = path.join(__dirname, '..')

const files = [
  ['apk-retailex-expo-go-qr.png', domainUrl],
  ['expo-go-qr.png', domainUrl],
  ['apk-retailex-eas-update-qr.png', domainUrl],
  ['apk-retailex-expo-go-android-intent-qr.png', ipUrl],
]

for (const [file, url] of files) {
  execFileSync('npx', ['--yes', 'qrcode@1.5.4', '-w', '512', url, '-o', file], {
    cwd: root,
    stdio: 'inherit',
  })
  console.log(`${file}: ${url}`)
}
