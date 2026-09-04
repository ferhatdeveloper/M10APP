#!/usr/bin/env node
/**
 * Expo Go sends expo-expect-signature keyid="expo-root". In CI, @expo/cli
 * prompts login and returns HTTP 500:
 *   CommandError: Input is required, but 'npx expo' is in non-interactive mode
 * Apply expo/expo#45809: tryGetUserAsync → anonymous (null).
 */
const fs = require('fs')
const path = require('path')

const file = path.join(
  process.cwd(),
  'node_modules/@expo/cli/build/src/api/user/actions.js'
)

function log(msg) {
  console.log(`patch-expo-anonymous-manifest: ${msg}`)
}

if (!fs.existsSync(file)) {
  log(`MISSING ${file}`)
  process.exit(1)
}

let src = fs.readFileSync(file, 'utf8')
if (src.includes('ANON_MANIFEST_PATCH')) {
  log('already applied')
  process.exit(0)
}

const patched = src.replace(
  /async function tryGetUserAsync\(\) \{[\s\S]*?\n\}/,
  `async function tryGetUserAsync() {
    const user = await (0, _user.getUserAsync)().catch(()=>null);
    return user || null; // ANON_MANIFEST_PATCH
}`
)

if (patched === src) {
  log('tryGetUserAsync not found — patch failed')
  process.exit(1)
}

fs.writeFileSync(file, patched)
log(`applied ${file}`)
