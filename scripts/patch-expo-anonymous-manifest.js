#!/usr/bin/env node
/**
 * Expo Go sends expo-expect-signature keyid="expo-root". In CI, @expo/cli
 * prompts login and returns HTTP 500:
 *   CommandError: Input is required, but 'npx expo' is in non-interactive mode
 * Apply expo/expo#45809: tryGetUserAsync → anonymous (null).
 *
 * --offline is the primary EXFIN fix. This patch is best-effort and must
 * not fail the Docker build if @expo/cli is nested or the file moved.
 */
const fs = require('fs')
const path = require('path')

function log(msg) {
  console.log(`patch-expo-anonymous-manifest: ${msg}`)
}

function candidatePaths() {
  const cwd = process.cwd()
  const found = [
    path.join(cwd, 'node_modules/@expo/cli/build/src/api/user/actions.js'),
    path.join(cwd, 'node_modules/expo/node_modules/@expo/cli/build/src/api/user/actions.js'),
  ]
  try {
    const pkg = require.resolve('@expo/cli/package.json', { paths: [cwd] })
    found.push(path.join(path.dirname(pkg), 'build/src/api/user/actions.js'))
  } catch {
    // not resolvable
  }
  return [...new Set(found)]
}

const files = candidatePaths().filter((f) => fs.existsSync(f))
if (!files.length) {
  log(`MISSING @expo/cli actions.js (ok if EXPO_OFFLINE=1)`)
  process.exit(0)
}

let applied = 0
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8')
  if (src.includes('ANON_MANIFEST_PATCH')) {
    log(`already applied ${file}`)
    continue
  }
  const patched = src.replace(
    /async function tryGetUserAsync\(\) \{[\s\S]*?\n\}/,
    `async function tryGetUserAsync() {
    const user = await (0, _user.getUserAsync)().catch(()=>null);
    return user || null; // ANON_MANIFEST_PATCH
}`
  )
  if (patched === src) {
    log(`tryGetUserAsync not found in ${file}`)
    continue
  }
  fs.writeFileSync(file, patched)
  log(`applied ${file}`)
  applied += 1
}

if (!applied) {
  log('no new patch written')
}
process.exit(0)
