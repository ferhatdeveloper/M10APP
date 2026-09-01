/**
 * Render M10 brand icons from SVG sources (logoPath vector, no bitmap crop).
 * Outputs: icon.png, adaptive-icon.png (transparent fg), splash.png, m10-logo.png
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const RED = '#E31E24'

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Install sharp first: npm install --save-dev sharp')
    process.exit(1)
  }

  const js = fs.readFileSync(path.join(ROOT, 'src/assets/logoPath.js'), 'utf8')
  const LOGO_PATH = js.match(/export const LOGO_PATH = '([^']+)'/)[1]
  const LOGO_W = Number(js.match(/export const LOGO_W = (\d+)/)[1])
  const LOGO_H = Number(js.match(/export const LOGO_H = (\d+)/)[1])

  const renderLogoSvg = (size, { redBg = true, padding = 0.12 } = {}) => {
    const inner = size * (1 - padding * 2)
    const scale = inner / LOGO_W
    const tw = LOGO_W * scale
    const th = LOGO_H * scale
    const tx = (size - tw) / 2
    const ty = (size - th) / 2
    const bg = redBg ? `<rect width="${size}" height="${size}" fill="${RED}"/>` : ''
    return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg}
  <g transform="translate(${tx},${ty}) scale(${scale})">
    <path fill="#FFFFFF" fill-rule="evenodd" d="${LOGO_PATH}"/>
  </g>
</svg>`)
  }

  const renderSplashSvg = (w, h) => {
    const logoW = Math.min(w * 0.72, 920)
    const scale = logoW / LOGO_W
    const th = LOGO_H * scale
    const tx = (w - logoW) / 2
    const ty = (h - th) / 2
    return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${RED}"/>
  <g transform="translate(${tx},${ty}) scale(${scale})">
    <path fill="#FFFFFF" fill-rule="evenodd" d="${LOGO_PATH}"/>
  </g>
</svg>`)
  }

  const writePng = async (svg, outPath, size) => {
    await sharp(svg).resize(size, size).png().toFile(outPath)
    console.log('wrote', path.relative(ROOT, outPath))
  }

  const iconSvg = renderLogoSvg(1024, { redBg: true, padding: 0.14 })
  const adaptiveSvg = renderLogoSvg(1024, { redBg: false, padding: 0.18 })
  const splashSvg = renderSplashSvg(1284, 2778)
  const logoSvg = renderLogoSvg(2040, { redBg: true, padding: 0.08 })

  const outputs = [
    ['assets/icon.png', iconSvg, 1024],
    ['assets/adaptive-icon.png', adaptiveSvg, 1024],
    ['public/favicon.png', iconSvg, 512],
    ['src/assets/icon.png', iconSvg, 1024],
    ['assets/m10-logo.png', logoSvg, 1024],
    ['public/m10-logo.png', logoSvg, 1024],
    ['src/assets/m10-logo.png', logoSvg, 1024],
  ]

  for (const [rel, svg, size] of outputs) {
    await writePng(svg, path.join(ROOT, rel), size)
  }

  await sharp(splashSvg).png().toFile(path.join(ROOT, 'assets/splash.png'))
  console.log('wrote assets/splash.png')

  // Keep SVG sources in sync
  fs.writeFileSync(path.join(ROOT, 'assets/icon.svg'), iconSvg)
  fs.writeFileSync(path.join(ROOT, 'assets/adaptive-icon-fg.svg'), adaptiveSvg)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
