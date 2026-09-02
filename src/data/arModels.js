/**
 * AR Try-in-Room uses 2.5D product cutouts (arImage) on the camera feed.
 * GLB URLs are optional / legacy — prefer clean PNG-style product photos.
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
}

export const arOverlayHeight = (productId) => AR_OVERLAY_HEIGHT[productId] ?? 200

/** @deprecated kept for any leftover 3D callers */
export const AR_MODEL_SCALE = {
  'mm-lamp': 0.45,
  'mm-vase': 0.55,
  'mm-cushion': 0.35,
  'mm-frame': 0.5,
  'mm-plant-pot': 0.6,
  'mm-wall-clock': 0.4,
  'mm-tea-cup': 0.35,
  'mm-coffee-cup': 0.38,
  'mm-artificial-tree': 0.85,
  'mm-artificial-flower': 0.55,
}

export const arModelScale = (productId) => AR_MODEL_SCALE[productId] ?? 0.55

/** Legacy GLB map — not used by TryInRoom cutout mode */
export const AR_MODELS = {
  lamp: null,
  vase: null,
  cushion: null,
  frame: null,
  plantPot: null,
  wallClock: null,
  teaCup: null,
  coffeeCup: null,
  artificialTree: null,
  artificialFlower: null,
}
