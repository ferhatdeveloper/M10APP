/**
 * AR Try-in-Room — maps product ids to real .glb 3D model asset references.
 * The actual require()'d module ids are resolved by Metro at bundle time;
 * we wrap them in a getter so the bundler doesn't try to inline the binary.
 */

/** Base on-screen height (px) so cups stay small and trees feel tall */
export const AR_OVERLAY_HEIGHT = {
  'mm-lamp': 250,
  'mm-vase': 210,
  'mm-cushion': 160,
  'mm-frame': 200,
  'mm-plant-pot': 230,
  'mm-wall-clock': 175,
  'mm-tea-cup': 115,
  'mm-coffee-cup': 125,
  'mm-artificial-tree': 360,
  'mm-artificial-flower': 220,
  'mm-bottle': 220,
  'mm-olive-oil': 200,
  'mm-rice': 180,
  'mm-bread': 150,
}

export const arOverlayHeight = (productId) => AR_OVERLAY_HEIGHT[productId] ?? 200

/** Scale factor for 3D models relative to overlay height */
export const AR_MODEL_SCALE = {
  'mm-lamp': 0.85,
  'mm-vase': 0.75,
  'mm-cushion': 0.65,
  'mm-frame': 0.7,
  'mm-plant-pot': 0.7,
  'mm-wall-clock': 0.55,
  'mm-tea-cup': 0.55,
  'mm-coffee-cup': 0.58,
  'mm-artificial-tree': 0.95,
  'mm-artificial-flower': 0.7,
  'mm-bottle': 0.65,
  'mm-olive-oil': 0.6,
  'mm-rice': 0.55,
  'mm-bread': 0.5,
}

export const arModelScale = (productId) => AR_MODEL_SCALE[productId] ?? 0.6

/**
 * Map product id → which sample GLB to use. We share three Khronos
 * sample assets for now (duck/avocado/boombox). Replace these as
 * product-specific GLBs land.
 */
const MODEL_FOR_PRODUCT = {
  'mm-tea-cup': 'avocado',
  'mm-coffee-cup': 'avocado',
  'mm-bottle': 'duck',
  'mm-olive-oil': 'duck',
  'mm-rice': 'avocado',
  'mm-bread': 'avocado',
  'mm-lamp': 'boombox',
  'mm-vase': 'duck',
  'mm-cushion': 'duck',
  'mm-frame': 'boombox',
  'mm-plant-pot': 'duck',
  'mm-wall-clock': 'boombox',
  'mm-artificial-tree': 'duck',
  'mm-artificial-flower': 'avocado',
}

/**
 * Returns a require()-able asset reference for the given product id.
 * Defers the require so Metro doesn't try to inline every GLB at startup.
 */
export function arModelSource(productId) {
  const key = MODEL_FOR_PRODUCT[productId] || 'duck'
  switch (key) {
    case 'avocado':
      return require('../../assets/ar-models/avocado.glb')
    case 'boombox':
      return require('../../assets/ar-models/boombox.glb')
    case 'duck':
    default:
      return require('../../assets/ar-models/duck.glb')
  }
}
