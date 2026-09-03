import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { GLView } from 'expo-gl'
import { Renderer, TextureLoader } from 'expo-three'
import * as THREE from 'three'
import { colors } from '../theme'

/**
 * Render a real .glb 3D model in a transparent GLView. Loads the GLB via
 * expo-asset (so the asset module id resolves to a local file URI), then
 * renders with ambient + directional lights and an auto-spin animation.
 *
 * Props:
 *   asset:     require()-able module for a .glb file
 *   scale:     optional uniform scale factor (default 1)
 *   height:    viewport height in px (default 240)
 *   isRTL:     flips the camera around the Y axis to keep lighting consistent
 *   backgroundColor: clear color (default transparent black)
 *   onError:   callback if the model fails to load
 */
export default function ARModelScene({
  asset,
  scale = 1,
  height = 240,
  isRTL = false,
  backgroundColor = 'transparent',
  onError,
}) {
  const [state, setState] = useState('loading') // loading | ready | error

  // Imperative ref so the spinner survives re-renders while we wait for the GLB.
  const onContextCreate = async (gl) => {
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

      // Load GLB. expo-asset is already a dependency of expo-gl.
      const ExpoTHREE = require('expo-three')
      const { Asset } = require('expo-asset')
      const assetRef = Asset.fromModule(asset)
      await assetRef.downloadAsync()
      const loader = new ExpoTHREE.GLTFLoader()
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          assetRef.localUri || assetRef.uri,
          (g) => resolve(g),
          undefined,
          (e) => reject(e),
        )
      })
      const model = gltf.scene
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

      let frame = 0
      const tick = () => {
        frame = requestAnimationFrame(tick)
        const t = Date.now() * 0.001
        // Gentle auto-spin so the user immediately sees it's 3D.
        model.rotation.y = (isRTL ? -1 : 1) * t * 0.6
        renderer.render(scene, camera)
        gl.endFrameEXP()
      }
      tick()

      // Cleanup on unmount via cancellation flag.
      const origSetState = setState
      return () => cancelAnimationFrame(frame)
    } catch (e) {
      console.warn('[ARModelScene] failed:', e?.message)
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
