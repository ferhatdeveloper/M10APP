import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import * as THREE from 'three'
import * as FileSystem from 'expo-file-system/legacy'
import { Asset } from 'expo-asset'
import { colors } from '../theme'

/**
 * Render a real .glb 3D model in a transparent GLView.
 *
 * Two loading paths:
 *  1. `asset` (require() module id) — small bundled Khronos samples, loaded
 *     synchronously via expo-asset.
 *  2. `url`  (https URL) — large FurniMesh GLBs pulled from Google's public
 *     bucket. We download once into the app cache dir (FileSystem.cacheDirectory)
 *     and parse from disk on subsequent loads.
 *
 * Props:
 *   asset:     require()-able module for a .glb file (optional)
 *   url:       https URL to a .glb file (optional)
 *   scale:     optional uniform scale factor (default 1)
 *   height:    viewport height in px (default 240)
 *   isRTL:     flips the camera around the Y axis to keep lighting consistent
 *   backgroundColor: clear color (default transparent black)
 *   onError:   callback if the model fails to load
 */
export default function ARModelScene({
  asset,
  url,
  scale = 1,
  height = 240,
  isRTL = false,
  backgroundColor = 'transparent',
  onError,
}) {
  const [state, setState] = useState('loading') // loading | ready | error
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    return () => {
      cancelledRef.current = true
    }
  }, [])

  const onContextCreate = async (gl) => {
    let frame = 0
    try {
      const renderer = new Renderer({ gl })
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
      renderer.setClearColor(0x000000, backgroundColor === 'transparent' ? 0 : 1)

      const scene = new THREE.Scene()
      scene.background = null

      const camera = new THREE.PerspectiveCamera(
        45,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000,
      )
      camera.position.set(0, 1.2, 4)
      camera.lookAt(0, 0.5, 0)

      // Lighting — soft daylight so the model feels at home in a living room.
      const ambient = new THREE.AmbientLight(0xffffff, 0.55)
      scene.add(ambient)

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
      dirLight.position.set(3, 5, 4)
      scene.add(dirLight)

      const fillLight = new THREE.DirectionalLight(0xffd9b3, 0.35)
      fillLight.position.set(-4, 2, -2)
      scene.add(fillLight)

      // Soft contact shadow disc directly under the model.
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.7, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 }),
      )
      shadow.rotation.x = -Math.PI / 2
      shadow.position.y = -0.001
      scene.add(shadow)

      // Resolve the GLB binary: bundled asset OR downloaded remote URL.
      const ExpoTHREE = require('expo-three')
      let gltf

      if (url) {
        // Remote: cache to disk then parse the ArrayBuffer.
        const cachePath = `${FileSystem.cacheDirectory}ar-${hashKey(url)}.glb`
        const cacheInfo = await FileSystem.getInfoAsync(cachePath)
        if (!cacheInfo.exists || !cacheInfo.size) {
          const dl = FileSystem.createDownloadResumable(
            url,
            cachePath,
            {},
            (progress) => {
              const { totalBytesWritten, totalBytesExpectedToWrite } = progress
              if (totalBytesExpectedToWrite > 0) {
                // optional progress hook — left silent for now
                void totalBytesWritten
              }
            },
          )
          const result = await dl.downloadAsync()
          if (!result || !result.uri) throw new Error('GLB download failed')
        }
        const buffer = await readFileAsArrayBuffer(cachePath)
        const loader = new ExpoTHREE.GLTFLoader()
        gltf = await new Promise((resolve, reject) => {
          loader.parse(
            buffer,
            '',
            (g) => resolve(g),
            (e) => reject(e),
          )
        })
      } else if (asset) {
        const assetRef = Asset.fromModule(asset)
        await assetRef.downloadAsync()
        const loader = new ExpoTHREE.GLTFLoader()
        const uri = assetRef.localUri || assetRef.uri
        gltf = await new Promise((resolve, reject) => {
          loader.load(
            uri,
            (g) => resolve(g),
            undefined,
            (e) => reject(e),
          )
        })
      } else {
        throw new Error('ARModelScene needs either `asset` or `url`')
      }

      if (cancelledRef.current) return () => cancelAnimationFrame(frame)

      const model = gltf.scene || gltf.scenes[0]
      // Center & scale model so it fits nicely.
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)
      const maxAxis = Math.max(size.x, size.y, size.z) || 1
      const fit = scale * (1.4 / maxAxis)
      model.scale.setScalar(fit)
      model.position.x = -center.x * fit
      model.position.y = -center.y * fit
      model.position.z = -center.z * fit

      // Make sure meshes use lit materials where possible.
      model.traverse((node) => {
        if (node.isMesh && node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          mats.forEach((m) => {
            if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
          })
        }
      })

      scene.add(model)

      setState('ready')

      const tick = () => {
        frame = requestAnimationFrame(tick)
        const t = Date.now() * 0.001
        // Gentle auto-spin so the user immediately sees it's 3D.
        model.rotation.y = (isRTL ? -1 : 1) * t * 0.6
        renderer.render(scene, camera)
        gl.endFrameEXP()
      }
      tick()

      return () => cancelAnimationFrame(frame)
    } catch (e) {
      if (cancelledRef.current) return () => {}
      console.warn('[ARModelScene] failed:', e?.message || e)
      setState('error')
      onError?.(e)
    }
  }

  return (
    <View
      style={{
        height,
        backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        enableExperimentalWebGLSupport
      />
      {state === 'loading' ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ActivityIndicator size="small" color={colors.red} />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>3D</Text>
        </View>
      ) : null}
      {state === 'error' ? (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', textAlign: 'center' }}>
            3D model failed to load
          </Text>
        </View>
      ) : null}
    </View>
  )
}

/** Cheap stable hash for a URL → unique cache filename. */
function hashKey(input) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

/** Read a file into an ArrayBuffer suitable for GLTFLoader.parse(). */
async function readFileAsArrayBuffer(uri) {
  // expo-file-system supports string|base64; we read as base64 then convert.
  const b64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })
  if (typeof global.atob === 'function') {
    const binary = global.atob(b64)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
    return bytes.buffer
  }
  // Fallback for environments without atob — should not happen on RN.
  const { decode } = require('base-64')
  const binary = decode(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}
