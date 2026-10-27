#!/usr/bin/env node
/**
 * Prefetch Expo development (expo-root) code-signing cert before Metro starts.
 * iOS Expo Go 58 expects a signed multipart manifest; without a cached cert and
 * with a failed online fetch, Metro serves unsigned → "npx expo login" on device.
 */
const path = require('path')
const fs = require('fs')

async function main() {
  if (!process.env.EXPO_TOKEN) {
    console.log('prefetch-expo-codesigning: no EXPO_TOKEN — skip')
    return
  }
  delete process.env.EXPO_OFFLINE
  process.env.EXPO_OFFLINE = ''
  process.env.CI = process.env.CI || '1'
  process.env.EXPO_NO_INTERACTIVE = '1'

  const cwd = process.cwd()
  const cliSrc = path.join(cwd, 'node_modules/expo/node_modules/@expo/cli/build/src')
  const alt = path.join(cwd, 'node_modules/@expo/cli/build/src')
  const root = fs.existsSync(cliSrc) ? cliSrc : alt

  const { getUserAsync } = require(path.join(root, 'api/user/user.js'))
  const user = await getUserAsync()
  const username = user?.username || user?.user?.username || '?'
  console.log('prefetch-expo-codesigning: whoami', username)

  const { getConfig } = require('@expo/config')
  const { exp } = getConfig(cwd, { skipSDKVersionRequirement: true })
  const projectId = exp?.extra?.eas?.projectId
  console.log(
    'prefetch-expo-codesigning: owner=%s slug=%s projectId=%s',
    exp?.owner,
    exp?.slug,
    projectId
  )
  if (!projectId) {
    throw new Error('missing extra.eas.projectId — cannot mint expo-root development cert')
  }

  const { getCodeSigningInfoAsync } = require(path.join(root, 'utils/codesigning.js'))
  const info = await getCodeSigningInfoAsync(exp, 'keyid="expo-root"', undefined)
  if (!info) {
    throw new Error('getCodeSigningInfoAsync returned null (unsigned)')
  }
  console.log(
    'prefetch-expo-codesigning: OK keyId=%s scopeKey=%s chain=%d',
    info.keyId,
    info.scopeKey,
    (info.certificateChainForResponse || []).length
  )
}

main().catch((e) => {
  console.error('prefetch-expo-codesigning: FAILED', e && e.message ? e.message : e)
  process.exit(1)
})
