/**
 * Trace original M10 logo bitmap → clean SVG paths (no font substitution).
 */
const fs = require('fs')
const path = require('path')
const { PNG } = require('pngjs')

const SRC =
  process.argv[2] ||
  'C:/Users/FERHATNAS/.cursor/projects/c-Users-FERHATNAS-M10/assets/c__Users_FERHATNAS_AppData_Roaming_Cursor_User_workspaceStorage_679b682b6afe1162d52a1e15641d2e5b_images_image-eb6c716e-325b-42b8-94e5-d2f9605612b8.png'
const ROOT = 'C:/Users/FERHATNAS/M10'
const RED = { r: 227, g: 30, b: 36 } // #E31E24 brand red (source ~225,30,38)

function loadPng(file) {
  const buf = fs.readFileSync(file)
  return PNG.sync.read(buf)
}

function isWhite(r, g, b, a) {
  if (a < 128) return false
  // white-ish vs red bg; luminance + not-red
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum > 160 && r > 140 && g > 140 && b > 140
}

function toMask(png) {
  const { width: w, height: h, data } = png
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    mask[i] = isWhite(data[o], data[o + 1], data[o + 2], data[o + 3]) ? 1 : 0
  }
  return { mask, w, h }
}

/** Nearest-neighbor upscale of binary mask */
function upscale(mask, w, h, scale) {
  const W = w * scale
  const H = h * scale
  const out = new Uint8Array(W * H)
  for (let y = 0; y < H; y++) {
    const sy = Math.floor(y / scale)
    for (let x = 0; x < W; x++) {
      const sx = Math.floor(x / scale)
      out[y * W + x] = mask[sy * w + sx]
    }
  }
  return { mask: out, w: W, h: H }
}

/** 3x3 majority filter to clean jaggy edges a bit without changing letterforms */
function majority(mask, w, h) {
  const out = new Uint8Array(mask.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
          sum += mask[yy * w + xx]
        }
      }
      out[y * w + x] = sum >= 5 ? 1 : 0
    }
  }
  return out
}

// Moore neighborhood contour (clockwise), start from leftmost top pixel of component
const DIRS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
]

function get(mask, w, h, x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0
  return mask[y * w + x]
}

function traceContour(mask, w, h, startX, startY, visitedEdge) {
  // Boundary follow: keep FG on left (clockwise for outer when starting from top-left)
  const pts = []
  let x = startX
  let y = startY
  // find initial direction: coming from left into start
  let dir = 0 // right
  const key = (x, y, d) => `${x},${y},${d}`
  let guard = 0
  do {
    pts.push([x + 0.5, y + 0.5])
    // try turn left relative to dir, then forward, etc.
    let found = false
    for (let i = 0; i < 8; i++) {
      const nd = (dir + 6 + i) % 8 // start from sharp left
      const [dx, dy] = DIRS[nd]
      const nx = x + dx
      const ny = y + dy
      if (get(mask, w, h, nx, ny)) {
        // mark edge
        visitedEdge.add(key(x, y, nd))
        x = nx
        y = ny
        dir = nd
        found = true
        break
      }
    }
    if (!found) break
    guard++
  } while ((x !== startX || y !== startY) && guard < w * h * 4)
  return pts
}

function floodFill(mask, w, h, sx, sy, from, to, outIds, id) {
  const stack = [[sx, sy]]
  const cells = []
  while (stack.length) {
    const [x, y] = stack.pop()
    const i = y * w + x
    if (x < 0 || y < 0 || x >= w || y >= h) continue
    if (mask[i] !== from) continue
    if (outIds[i]) continue
    mask[i] = to
    outIds[i] = id
    cells.push([x, y])
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  return cells
}

function findComponents(mask, w, h, value) {
  const m = Uint8Array.from(mask)
  const ids = new Uint32Array(w * h)
  const comps = []
  let id = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (m[y * w + x] === value && !ids[y * w + x]) {
        id++
        const cells = floodFill(m, w, h, x, y, value, 2, ids, id)
        comps.push({ id, cells, value })
      }
    }
  }
  return { comps, ids }
}

function startPixel(cells) {
  // topmost, then leftmost
  let best = cells[0]
  for (const c of cells) {
    if (c[1] < best[1] || (c[1] === best[1] && c[0] < best[0])) best = c
  }
  return best
}

function rdp(points, epsilon) {
  if (points.length < 3) return points
  const [sx, sy] = points[0]
  const [ex, ey] = points[points.length - 1]
  let maxD = 0
  let idx = 0
  const dx = ex - sx
  const dy = ey - sy
  const len2 = dx * dx + dy * dy || 1
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i]
    const t = ((px - sx) * dx + (py - sy) * dy) / len2
    const qx = sx + t * dx
    const qy = sy + t * dy
    const d = Math.hypot(px - qx, py - qy)
    if (d > maxD) {
      maxD = d
      idx = i
    }
  }
  if (maxD > epsilon) {
    const left = rdp(points.slice(0, idx + 1), epsilon)
    const right = rdp(points.slice(idx), epsilon)
    return left.slice(0, -1).concat(right)
  }
  return [points[0], points[points.length - 1]]
}

function pathFromPts(pts) {
  if (pts.length < 3) return ''
  const f = (n) => (Math.round(n * 100) / 100).toFixed(2)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 1; i < pts.length; i++) d += `L${f(pts[i][0])} ${f(pts[i][1])}`
  return d + 'Z'
}

function area(pts) {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

function main() {
  const png = loadPng(SRC)
  let { mask, w, h } = toMask(png)
  // light clean at native res
  mask = majority(mask, w, h)
  // upscale for smoother vectors
  const scale = 4
  ;({ mask, w, h } = upscale(mask, png.width, png.height, scale))
  mask = majority(mask, w, h)

  // Foreground components (letters)
  const fg = findComponents(mask, w, h, 1)
  const visited = new Set()
  const paths = []

  for (const comp of fg.comps) {
    if (comp.cells.length < 20) continue
    const [sx, sy] = startPixel(comp.cells)
    // Build local mask for this component only
    const local = new Uint8Array(w * h)
    for (const [x, y] of comp.cells) local[y * w + x] = 1
    let pts = traceContour(local, w, h, sx, sy, visited)
    if (pts.length < 8) continue
    pts = rdp(pts, 1.2)
    // outer should be clockwise positive area in screen coords (y down) → negative area
    if (area(pts) > 0) pts.reverse()
    paths.push({ d: pathFromPts(pts), kind: 'outer', n: comp.cells.length })
  }

  // Holes: background components not touching border
  const bg = findComponents(mask, w, h, 0)
  for (const comp of bg.comps) {
    const touches =
      comp.cells.some(([x, y]) => x === 0 || y === 0 || x === w - 1 || y === h - 1)
    if (touches) continue
    if (comp.cells.length < 30) continue
    const local = new Uint8Array(w * h)
    // hole: treat hole interior as "fg" for tracing then reverse winding
    for (const [x, y] of comp.cells) local[y * w + x] = 1
    const [sx, sy] = startPixel(comp.cells)
    let pts = traceContour(local, w, h, sx, sy, visited)
    if (pts.length < 8) continue
    pts = rdp(pts, 1.0)
    // hole winding opposite of outer
    if (area(pts) < 0) pts.reverse()
    paths.push({ d: pathFromPts(pts), kind: 'hole', n: comp.cells.length })
  }

  // Sort outers by x position (M, 1, 0)
  paths.sort((a, b) => {
    const ax = parseFloat(a.d.match(/M([\d.]+)/)[1])
    const bx = parseFloat(b.d.match(/M([\d.]+)/)[1])
    return ax - bx
  })

  const combined = paths.map((p) => p.d).join('')
  const vbW = w
  const vbH = h

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" role="img" aria-label="M10">
  <rect width="${vbW}" height="${vbH}" fill="#E31E24"/>
  <path fill="#FFFFFF" fill-rule="evenodd" d="${combined}"/>
</svg>
`

  const js = `/** Traced from original M10 bitmap — do not replace with a system font */
export const LOGO_VB = '0 0 ${vbW} ${vbH}'
export const LOGO_W = ${vbW}
export const LOGO_H = ${vbH}
export const LOGO_PATH = '${combined}'
`

  fs.writeFileSync(path.join(ROOT, 'src/assets/logo.svg'), svg)
  fs.writeFileSync(path.join(ROOT, 'assets/logo.svg'), svg)
  fs.writeFileSync(path.join(ROOT, 'public/logo.svg'), svg)
  fs.writeFileSync(path.join(ROOT, 'src/assets/logoPath.js'), js)

  // Also write cleaned high-res PNG (exact same glyphs)
  const outPng = new PNG({ width: w, height: h })
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    if (mask[i]) {
      outPng.data[o] = 255
      outPng.data[o + 1] = 255
      outPng.data[o + 2] = 255
      outPng.data[o + 3] = 255
    } else {
      outPng.data[o] = RED.r
      outPng.data[o + 1] = RED.g
      outPng.data[o + 2] = RED.b
      outPng.data[o + 3] = 255
    }
  }
  const pngBuf = PNG.sync.write(outPng)
  for (const p of [
    'assets/m10-logo.png',
    'public/m10-logo.png',
    'src/assets/m10-logo.png',
    'assets/m10-mark.png',
  ]) {
    fs.writeFileSync(path.join(ROOT, p), pngBuf)
  }

  // Square icon: letterbox original aspect onto square red
  const side = Math.max(w, h)
  const icon = new PNG({ width: side, height: side })
  for (let i = 0; i < side * side; i++) {
    const o = i * 4
    icon.data[o] = RED.r
    icon.data[o + 1] = RED.g
    icon.data[o + 2] = RED.b
    icon.data[o + 3] = 255
  }
  const ox = Math.floor((side - w) / 2)
  const oy = Math.floor((side - h) / 2)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4
      const dst = ((y + oy) * side + (x + ox)) * 4
      icon.data[dst] = outPng.data[src]
      icon.data[dst + 1] = outPng.data[src + 1]
      icon.data[dst + 2] = outPng.data[src + 2]
      icon.data[dst + 3] = 255
    }
  }
  const iconBuf = PNG.sync.write(icon)
  for (const p of [
    'assets/icon.png',
    'assets/adaptive-icon.png',
    'public/favicon.png',
    'src/assets/icon.png',
  ]) {
    fs.writeFileSync(path.join(ROOT, p), iconBuf)
  }

  // Splash
  const sw = 1284
  const sh = 2778
  const splash = new PNG({ width: sw, height: sh })
  for (let i = 0; i < sw * sh; i++) {
    const o = i * 4
    splash.data[o] = RED.r
    splash.data[o + 1] = RED.g
    splash.data[o + 2] = RED.b
    splash.data[o + 3] = 255
  }
  const tw = Math.min(920, w)
  const th = Math.round((h * tw) / w)
  const sx0 = Math.floor((sw - tw) / 2)
  const sy0 = Math.floor((sh - th) / 2)
  for (let y = 0; y < th; y++) {
    const srcY = Math.min(h - 1, Math.floor((y * h) / th))
    for (let x = 0; x < tw; x++) {
      const srcX = Math.min(w - 1, Math.floor((x * w) / tw))
      const src = (srcY * w + srcX) * 4
      const dst = ((sy0 + y) * sw + (sx0 + x)) * 4
      splash.data[dst] = outPng.data[src]
      splash.data[dst + 1] = outPng.data[src + 1]
      splash.data[dst + 2] = outPng.data[src + 2]
      splash.data[dst + 3] = 255
    }
  }
  fs.writeFileSync(path.join(ROOT, 'assets/splash.png'), PNG.sync.write(splash))

  console.log(
    JSON.stringify(
      {
        size: `${w}x${h}`,
        paths: paths.length,
        kinds: paths.map((p) => p.kind),
        pathLen: combined.length,
      },
      null,
      2
    )
  )
}

main()
