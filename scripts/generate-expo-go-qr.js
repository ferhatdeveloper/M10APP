#!/usr/bin/env node
const { execFileSync } = require('child_process')
const path = require('path')

const url = process.env.EXPO_GO_URL || 'exp://metro.retailex.app:8081'
const root = path.join(__dirname, '..')
const files = ['apk-retailex-expo-go-qr.png', 'expo-go-qr.png']

for (const file of files) {
  execFileSync('npx', ['--yes', 'qrcode@1.5.4', '-w', '512', url, '-o', file], {
    cwd: root,
    stdio: 'inherit',
  })
}
console.log(`Expo Go QR: ${url}`)
