/**
 * AR Try-in-Room — maps product ids to real .glb 3D models.
 *
 * Each furniture/home-accessory entry points at a real GLB asset hosted on
 * furnimesh-3d (Google Cloud Storage, public). The first time a model is
 * shown we download the GLB into the app's cache directory and load it from
 * disk on subsequent runs — so the APK stays small but the user always sees
 * a real high-fidelity 3D model.
 *
 * Food/beverage items fall back to the small Khronos sample meshes
 * (duck/avocado/boombox) since FurniMesh doesn't ship grocery 3D models.
 */

import { Asset } from 'expo-asset'

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
 * Map product id → which GLB to use.
 * `key: 'remote'` entries resolve via AR_MODEL_URLS at runtime so we don't
 * ship the 200MB+ of binary meshes inside the APK.
 */
const MODEL_FOR_PRODUCT = {
  // Real FurniMesh models (downloaded lazily from GCS).
  'mm-lamp': 'remote:furnimesh_lamp',
  'mm-vase': 'remote:furnimesh_vase',
  'mm-cushion': 'remote:furnimesh_cushion',
  'mm-frame': 'remote:furnimesh_frame',
  'mm-plant-pot': 'remote:furnimesh_plant-pot',
  'mm-wall-clock': 'remote:furnimesh_wall-clock',
  'mm-artificial-tree': 'remote:furnimesh_artificial-tree',
  'mm-artificial-flower': 'remote:furnimesh_artificial-flower',

  // Khronos samples (small, bundled with the APK).
  'mm-tea-cup': 'avocado',
  'mm-coffee-cup': 'avocado',
  'mm-bottle': 'duck',
  'mm-olive-oil': 'duck',
  'mm-rice': 'avocado',
  'mm-bread': 'avocado',
}

/**
 * Direct download URLs for every FurniMesh GLB used in the catalog.
 * These live on Google's public storage bucket and are served with
 * permissive CORS, so they can be pulled on-demand.
 */
export const AR_MODEL_URLS = {
  furnimesh_lamp:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/Cyka15Yff3rsvsJ4H1PUE.glb',
  furnimesh_vase:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/vVDGnLyvElhkQLueaodCr.glb',
  furnimesh_cushion:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/fkEFmOvZAUXNYgqQ9v-Nq.glb',
  furnimesh_frame:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/ajXdn-4ZU7hjqHufVeEjh.glb',
  furnimesh_plant_pot:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/RdWtoFdGvU8EJM8_motAS.glb',
  furnimesh_wall_clock:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/4mHf6ZciIWsZ7QJd-aSqY.glb',
  furnimesh_artificial_tree:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/qxelEam6xtAdkwnCLD09N.glb',
  furnimesh_artificial_flower:
    'https://storage.googleapis.com/furnimesh-3d/gbl-files/55tgSewufPJCxnoJ4QS6G.glb',
}

/**
 * Returns a require()-able asset reference for the given product id.
 * Bundled sample meshes resolve immediately; remote FurniMesh GLBs are
 * pulled at runtime by `resolveRemoteModel` below.
 */
export function arModelSource(productId) {
  const key = MODEL_FOR_PRODUCT[productId] || 'duck'
  if (key.startsWith('remote:')) {
    return null // resolved by ARModelScene via arModelRemoteUrl()
  }
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

/** Returns the remote URL string for a product id, or null if it ships bundled. */
export function arModelRemoteUrl(productId) {
  const key = MODEL_FOR_PRODUCT[productId]
  if (!key || !key.startsWith('remote:')) return null
  const slug = key.slice('remote:'.length)
  return AR_MODEL_URLS[slug] || null
}

/** Friendly source label shown in the AR overlay. */
export function arModelSourceLabel(productId) {
  const key = MODEL_FOR_PRODUCT[productId]
  if (key && key.startsWith('remote:')) return 'FurniMesh'
  return 'Sample'
}

/** @deprecated — kept for callers that still resolve Asset modules synchronously. */
export function arModelAssetModule(productId) {
  const a = arModelSource(productId)
  if (!a) return null
  try {
    return Asset.fromModule(a)
  } catch (e) {
    return null
  }
}
