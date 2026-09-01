import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Camera, RotateCcw, ShoppingBag, X } from 'lucide-react-native'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { arOverlayHeight } from '../data/arModels'
import { arProductImage, canTryInRoom, getProduct, productName } from '../data/mock'
import { colors, radius, shadow } from '../theme'

const { width: WIN_W, height: WIN_H } = Dimensions.get('window')
const DEFAULT_ANCHOR = { x: WIN_W / 2, y: WIN_H * 0.58 }
const INITIAL = { x: 0, y: 0, scale: 1, rotation: 0 }

export default function TryInRoomScreen({ navigation, route }) {
  const { storeId, productId } = route.params || {}
  const product = getProduct(storeId, productId)
  const { addToCart } = useApp()
  const { t, lang, isRTL } = useI18n()
  const [permission, requestPermission] = useCameraPermissions()
  const [anchor, setAnchor] = useState(DEFAULT_ANCHOR)
  const [tf, setTf] = useState(INITIAL)
  const [dragging, setDragging] = useState(false)
  const [imgState, setImgState] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const tfRef = useRef(INITIAL)
  const savedRef = useRef(INITIAL)
  const anchorRef = useRef(DEFAULT_ANCHOR)

  const cutoutUri = useMemo(() => arProductImage(product), [product])
  const baseH = useMemo(() => arOverlayHeight(product?.id), [product?.id])
  const baseW = Math.round(baseH * 0.92)

  const syncTransform = useCallback((next) => {
    tfRef.current = next
    setTf(next)
  }, [])

  const commit = useCallback(
    (next) => {
      syncTransform(next)
    },
    [syncTransform],
  )

  const reset = useCallback(() => {
    const nextAnchor = DEFAULT_ANCHOR
    anchorRef.current = nextAnchor
    setAnchor(nextAnchor)
    commit(INITIAL)
  }, [commit])

  const retryImage = useCallback(() => {
    setImgState('loading')
    setReloadKey((k) => k + 1)
  }, [])

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onBegin(() => {
        savedRef.current = { ...tfRef.current }
        setDragging(true)
      })
      .onUpdate((e) => {
        commit({
          ...tfRef.current,
          x: savedRef.current.x + e.translationX,
          y: savedRef.current.y + e.translationY,
        })
      })
      .onFinalize(() => setDragging(false))

    const pinch = Gesture.Pinch()
      .onBegin(() => {
        savedRef.current = { ...tfRef.current }
      })
      .onUpdate((e) => {
        const scale = Math.min(3.2, Math.max(0.35, savedRef.current.scale * e.scale))
        commit({ ...tfRef.current, scale })
      })

    const rotation = Gesture.Rotation()
      .onBegin(() => {
        savedRef.current = { ...tfRef.current }
      })
      .onUpdate((e) => {
        const rotationDeg = savedRef.current.rotation + (e.rotation * 180) / Math.PI
        commit({ ...tfRef.current, rotation: rotationDeg })
      })

    const tap = Gesture.Tap()
      .maxDuration(250)
      .onEnd((e) => {
        const next = { x: e.x, y: e.y }
        anchorRef.current = next
        setAnchor(next)
        commit(INITIAL)
      })

    return Gesture.Race(Gesture.Simultaneous(pan, pinch, rotation), tap)
  }, [commit])

  const onAdd = () => {
    if (!product || !storeId) return
    const ok = addToCart(storeId, product.id)
    if (!ok) {
      Alert.alert(t('tryInRoomTitle'), t('tryInRoomAddFail'))
      return
    }
    Alert.alert(t('tryInRoomTitle'), t('tryInRoomAdded', { name: productName(product, lang) }), [
      { text: t('continue'), style: 'cancel', onPress: () => navigation.goBack() },
      { text: t('goToCart'), onPress: () => navigation.navigate('Cart') },
    ])
  }

  if (!product || !canTryInRoom(product) || !cutoutUri) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.centerBox}>
          <Text style={styles.msgText}>{t('tryInRoomUnavailable')}</Text>
          <SoftPress onPress={() => navigation.goBack()} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>{t('close')}</Text>
          </SoftPress>
        </View>
      </SafeAreaView>
    )
  }

  const cameraOk = permission?.granted && Platform.OS !== 'web'
  const needPermission = permission && !permission.granted && Platform.OS !== 'web'
  const showOverlay = imgState !== 'error'
  const canInteract = showOverlay && (cameraOk || Platform.OS === 'web' || permission?.granted === false)

  const overlayLeft = anchor.x + tf.x - (baseW * tf.scale) / 2
  const overlayTop = anchor.y + tf.y - baseH * tf.scale
  const shadowW = baseW * tf.scale * 0.72
  const shadowH = Math.max(10, baseH * tf.scale * 0.08)

  return (
    <View style={styles.root}>
      {cameraOk ? (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.roomFallback]} />
      )}

      {showOverlay ? (
        <GestureDetector gesture={gesture}>
          <View style={styles.stage} collapsable={false}>
            {!dragging ? (
              <View
                pointerEvents="none"
                style={[
                  styles.reticle,
                  {
                    left: anchor.x - 28,
                    top: anchor.y - 28,
                  },
                ]}
              >
                <View style={styles.reticleRing} />
                <View style={styles.reticleDot} />
              </View>
            ) : null}

            {/* Soft elliptical ground shadow under the product */}
            <View
              pointerEvents="none"
              style={[
                styles.groundShadow,
                {
                  left: anchor.x + tf.x - shadowW / 2,
                  top: anchor.y + tf.y - shadowH * 0.35,
                  width: shadowW,
                  height: shadowH,
                  borderRadius: shadowH,
                  opacity: 0.28 + Math.min(0.2, (tf.scale - 1) * 0.08),
                },
              ]}
            />

            <View
              pointerEvents="none"
              style={[
                styles.cutoutWrap,
                {
                  left: overlayLeft,
                  top: overlayTop,
                  width: baseW * tf.scale,
                  height: baseH * tf.scale,
                  transform: [{ rotate: `${tf.rotation}deg` }],
                },
              ]}
            >
              <Image
                key={`${cutoutUri}-${reloadKey}`}
                source={{ uri: cutoutUri }}
                style={styles.cutoutImage}
                resizeMode="contain"
                onLoad={() => setImgState('ready')}
                onError={() => setImgState('error')}
              />
            </View>

            {imgState === 'loading' ? (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color={colors.red} />
                <Text style={styles.loadingText}>{t('tryInRoomModelLoading')}</Text>
              </View>
            ) : null}
          </View>
        </GestureDetector>
      ) : null}

      {imgState === 'error' ? (
        <View style={styles.errorWrap}>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>{t('tryInRoomModelErrorTitle')}</Text>
            <Text style={styles.errorMsg}>{t('tryInRoomModelError')}</Text>
            <SoftPress onPress={retryImage} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t('tryInRoomModelRetry')}</Text>
            </SoftPress>
          </View>
        </View>
      ) : null}

      <SafeAreaView style={styles.chrome} edges={['top', 'bottom']} pointerEvents="box-none">
        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} pointerEvents="box-none">
          <SoftPress onPress={() => navigation.goBack()} style={styles.iconBtn} accessibilityLabel={t('close')}>
            <X size={22} color="#fff" strokeWidth={2.5} />
          </SoftPress>
          <View style={styles.titlePill} pointerEvents="none">
            <Text style={styles.titleText} numberOfLines={1}>
              {productName(product, lang)}
            </Text>
          </View>
          <SoftPress onPress={reset} style={styles.iconBtn} accessibilityLabel={t('tryInRoomReset')}>
            <RotateCcw size={20} color="#fff" strokeWidth={2.5} />
          </SoftPress>
        </View>

        {needPermission ? (
          <View style={styles.permCard}>
            <Camera size={28} color={colors.ink} strokeWidth={2} />
            <Text style={styles.permText}>{t('tryInRoomPermissionDenied')}</Text>
            <SoftPress onPress={requestPermission} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t('tryInRoomAllowCamera')}</Text>
            </SoftPress>
            <Text style={styles.permHint}>{t('tryInRoomFallbackHint')}</Text>
          </View>
        ) : Platform.OS === 'web' ? (
          <View style={styles.webBanner} pointerEvents="none">
            <Text style={styles.webBannerText}>{t('tryInRoomCameraUnavailable')}</Text>
          </View>
        ) : !permission ? (
          <Text style={styles.gestureHint}>{t('tryInRoomPermissionLoading')}</Text>
        ) : canInteract ? (
          <Text style={styles.gestureHint}>{t('tryInRoomHint')}</Text>
        ) : null}

        <View style={[styles.bottomRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <SoftPress onPress={reset} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>{t('tryInRoomReset')}</Text>
          </SoftPress>
          <SoftPress onPress={onAdd} style={styles.addBtn} disabled={imgState === 'loading'}>
            <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
            <Text style={styles.addBtnText}>{t('addToCart')}</Text>
          </SoftPress>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  roomFallback: {
    backgroundColor: '#2C2C2E',
  },
  stage: {
    ...StyleSheet.absoluteFillObject,
  },
  groundShadow: {
    position: 'absolute',
    backgroundColor: '#000',
    zIndex: 1,
  },
  cutoutWrap: {
    position: 'absolute',
    zIndex: 2,
    // Soft product drop shadow without a rectangular “photo frame”
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.38,
        shadowRadius: 16,
      },
      android: {
        // Avoid elevation (draws a hard rect). Ground ellipse handles contact shadow.
      },
      default: {},
    }),
  },
  cutoutImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    gap: 10,
    zIndex: 3,
  },
  loadingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  errorWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 4,
  },
  errorBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    maxWidth: 340,
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
  reticle: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  reticleRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  reticleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chrome: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topRow: {
    marginHorizontal: 14,
    marginTop: 6,
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(22,22,22,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    flex: 1,
    backgroundColor: 'rgba(22,22,22,0.72)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  titleText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  gestureHint: {
    alignSelf: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: 'rgba(22,22,22,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    maxWidth: '88%',
  },
  permCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: radius,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    ...shadow.card,
  },
  permText: {
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  permHint: {
    color: colors.muted,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  webBanner: {
    alignSelf: 'center',
    backgroundColor: 'rgba(22,22,22,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: '90%',
  },
  webBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomRow: {
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  secondaryBtn: {
    flex: 0.9,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  secondaryBtnText: { color: colors.ink, fontWeight: '800' },
  addBtn: {
    flex: 1.4,
    backgroundColor: colors.red,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...shadow.soft,
  },
  addBtnText: { color: '#fff', fontWeight: '800' },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: colors.bg,
  },
  msgText: {
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: colors.red,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
})
