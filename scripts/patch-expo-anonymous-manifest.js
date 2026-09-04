#!/usr/bin/env node
/**
 * Expo Go sends expo-expect-signature keyid="expo-root". In CI, @expo/cli
 * prompts login and can return HTTP 500:
 *   CommandError: Input is required, but 'npx expo' is in non-interactive mode
 *
 * Always short-circuit login prompts so Metro serves an anonymous UNSIGNED
 * manifest (expo/expo#45809) unless EXPO_TOKEN is set (then CLI signs).
 *
 * Must not fail the Docker build if @expo/cli is nested or the file moved.
 */
const fs = require('fs')
const path = require('path')

function log(msg) {
  console.log(`patch-expo-anonymous-manifest: ${msg}`)
}

function walkJs(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    let st
    try {
      st = fs.statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      if (name === 'node_modules' && !p.endsWith(path.join('@expo', 'cli', 'node_modules'))) {
        continue
      }
      walkJs(p, acc)
    } else if (name.endsWith('.js')) {
      acc.push(p)
    }
  }
  return acc
}

function candidateFiles() {
  const cwd = process.cwd()
  const roots = [
    path.join(cwd, 'node_modules/@expo/cli/build/src'),
    path.join(cwd, 'node_modules/expo/node_modules/@expo/cli/build/src'),
  ]
  try {
    const pkg = require.resolve('@expo/cli/package.json', { paths: [cwd] })
    roots.push(path.join(path.dirname(pkg), 'build/src'))
  } catch {
    // not resolvable
  }
  const files = new Set()
  for (const root of [...new Set(roots)]) {
    for (const f of walkJs(root)) {
      if (
        f.endsWith(`${path.sep}user${path.sep}actions.js`) ||
        f.endsWith(`${path.sep}utils${path.sep}codesigning.js`)
      ) {
        files.add(f)
      }
    }
  }
  return [...files]
}

function patchTryGetUserAsync(src) {
  if (src.includes('ANON_MANIFEST_PATCH')) return src
  const next = src.replace(
    /async function tryGetUserAsync\(\) \{[\s\S]*?\n\}/,
    `async function tryGetUserAsync() {
    const user = await (0, _user.getUserAsync)().catch(()=>null);
    return user || null; // ANON_MANIFEST_PATCH
}`
  )
  return next
}

function patchShowLoginPrompt(src) {
  if (src.includes('ANON_LOGIN_PATCH')) return src
  if (!src.includes('async function showLoginPromptAsync')) return src
  return src.replace(
    'async function showLoginPromptAsync',
    `async function showLoginPromptAsync() { return null; } // ANON_LOGIN_PATCH
async function showLoginPromptAsync_disabled`
  )
}

function patchGetCodeSigningInfo(src) {
  if (src.includes('ANON_CODESIGN_PATCH')) return src
  if (!src.includes('async function getCodeSigningInfoAsync')) return src
  return src.replace(
    'async function getCodeSigningInfoAsync(',
    `async function getCodeSigningInfoAsync(exp, expectSignatureHeader, privateKeyPath) {
    try {
      return await getCodeSigningInfoAsync_orig(exp, expectSignatureHeader, privateKeyPath);
    } catch (e) {
      console.warn('patch-expo-anonymous-manifest: unsigned fallback:', e && e.message);
      return null; // ANON_CODESIGN_PATCH
    }
}
async function getCodeSigningInfoAsync_orig(`
  )
}

const files = candidateFiles()
if (!files.length) {
  log('MISSING @expo/cli sources (ok if EXPO_OFFLINE=1)')
  process.exit(0)
}

let applied = 0
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8')
  const before = src
  if (file.endsWith(`${path.sep}actions.js`)) {
    src = patchTryGetUserAsync(src)
    src = patchShowLoginPrompt(src)
  } else if (file.endsWith(`${path.sep}codesigning.js`)) {
    src = patchGetCodeSigningInfo(src)
  }
  if (src === before) {
    if (
      src.includes('ANON_MANIFEST_PATCH') ||
      src.includes('ANON_LOGIN_PATCH') ||
      src.includes('ANON_CODESIGN_PATCH')
    ) {
      log(`already applied ${file}`)
    } else {
      log(`no match ${file}`)
    }
    continue
  }
  fs.writeFileSync(file, src)
  log(`applied ${file}`)
  applied += 1
}

if (!applied) {
  log('no new patch written')
}
process.exit(0)
