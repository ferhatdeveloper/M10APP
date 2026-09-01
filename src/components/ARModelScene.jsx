import { useCallback, useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Asset } from 'expo-asset'
import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { colors } from '../theme'

async function loadGltf(url) {
  const asset = Asset.fromURI(url)
  await asset.downloadAsync()
  const uri = asset.localUri || asset.uri
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(uri, resolve, undefined, reject)
  })
}

function fitModel(model, targetSize = 0.55) {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = targetSize / maxDim
  model.scale.setScalar(scale)
  box.setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  model.position.sub(center)
  box.setFromObject(model)
  model.position.y -= box.min.y
}

/**
 * Transparent GL overlay: camera feed underneath, GLB model on top.
 * Reads transformRef each frame — { x, y, scale, rotation }.
 */
export default function ARModelScene({
  modelUrl,
  baseScale = 0.55,
  transformRef,
  onReady,
  onError,
}) {
  const ctxRef = useRef(null)
  const mountedRef = useRef(true)
  const statusRef = useRef('loading')

  useEffect(() => {
    mountedRef.current = true
    statusRef.current = 'loading'
    return () => {
      mountedRef.current = false
      const ctx = ctxRef.current
      if (ctx?.frameId) cancelAnimationFrame(ctx.frameId)
      ctxRef.current = null
    }
  }, [modelUrl])

  const onContextCreate = useCallback(
    async (gl) => {
      statusRef.current = 'loading'
      const width = gl.drawingBufferWidth
      const height = gl.drawingBufferHeight

      const renderer = new Renderer({ gl, alpha: true })
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, width / height, 0.05, 50)
      camera.position.set(0, 0.35, 2.1)
      camera.lookAt(0, 0.15, 0)

      scene.add(new THREE.AmbientLight(0xffffff, 0.82))
      const key = new THREE.DirectionalLight(0xffffff, 1.05)
      key.position.set(2.5, 4, 3.5)
      scene.add(key)
      const fill = new THREE.DirectionalLight(0xfff2cc, 0.35)
      fill.position.set(-2, 1, -1)
      scene.add(fill)

      const pivot = new THREE.Group()
      scene.add(pivot)

      const ctx = { gl, renderer, scene, camera, pivot, frameId: null }
      ctxRef.current = ctx

      try {
        const gltf = await loadGltf(modelUrl)
        if (!mountedRef.current) return

        const model = gltf.scene
        fitModel(model, baseScale)
        pivot.add(model)

        statusRef.current = 'ready'
        onReady?.()
      } catch (err) {
        statusRef.current = 'error'
        onError?.(err instanceof Error ? err : new Error(String(err)))
        return
      }

      const renderLoop = () => {
        if (!mountedRef.current || ctxRef.current !== ctx) return

        const tf = transformRef?.current ?? { x: 0, y: 0, scale: 1, rotation: 0 }
        pivot.position.set(tf.x * 0.004, -tf.y * 0.004, 0)
        pivot.rotation.set(0, (tf.rotation * Math.PI) / 180, 0)
        const s = tf.scale ?? 1
        pivot.scale.set(s, s, s)

        renderer.render(scene, camera)
        gl.endFrameEXP()
        ctx.frameId = requestAnimationFrame(renderLoop)
      }
      renderLoop()
    },
    [baseScale, modelUrl, onError, onReady, transformRef],
  )

  if (!modelUrl) return null

  return (
    <GLView
      style={styles.gl}
      onContextCreate={onContextCreate}
      msaaSamples={4}
    />
  )
}

export function ARModelLoading({ label }) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <ActivityIndicator size="large" color={colors.red} />
      {label ? <Text style={styles.loadingText}>{label}</Text> : null}
    </View>
  )
}

export function ARModelError({ title, message, onRetry, retryLabel }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorMsg}>{message}</Text>
      {onRetry ? (
        <Text style={styles.retryBtn} onPress={onRetry}>
          {retryLabel}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  gl: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    gap: 10,
  },
  loadingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  errorBox: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  errorTitle: {
    color: colors.red,
    fontWeight: '800',
    fontSize: 15,
  },
  errorMsg: {
    color: colors.ink,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  retryBtn: {
    marginTop: 6,
    color: colors.red,
    fontWeight: '800',
    fontSize: 14,
  },
})
