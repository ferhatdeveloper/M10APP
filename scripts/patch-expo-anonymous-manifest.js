#!/usr/bin/env node
/**
 * Expo Go requests a signed manifest (keyid=expo-root). In CI/non-TTY,
 * @expo/cli prompts "Log in / Proceed anonymously" and then throws:
 *   HTTP 500 CommandError: Input is required, but 'npx expo' is in non-interactive mode
 * Official fix: expo/expo#45809 (tryGetUserAsync returns null when not interactive).
 * SDK 54.0.27 does not have that yet — apply the same short-circuit.
 */
const fs = require('fs')
const path = require('path')

const file = path.join(
  process.cwd(),
  'node_modules/@expo/cli/build/src/api/user/actions.js'
)

if (!fs.existsSync(file)) {
  console.warn('patch-expo-anonymous-manifest: actions.js not found, skip')
  process.exit(0)
}

let src = fs.readFileSync(file, 'utf8')
if (src.includes('ANON_MANIFEST_PATCH')) {
  console.log('patch-expo-anonymous-manifest: already applied')
  process.exit(0)
}

const needle = `async function tryGetUserAsync() {
    const user = await (0, _user.getUserAsync)().catch(()=>null);
    if (user) {
        return user;
    }`

const insert = `${needle}
    return null; // ANON_MANIFEST_PATCH`

if (!src.includes(needle)) {
  console.warn('patch-expo-anonymous-manifest: tryGetUserAsync shape changed, skip')
  process.exit(0)
}

fs.writeFileSync(file, src.replace(needle, insert))
console.log('patch-expo-anonymous-manifest: applied (anonymous unsigned manifest)')
