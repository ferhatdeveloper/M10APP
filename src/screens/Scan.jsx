import { useCallback, useRef, useState } from 'react'
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Keyboard } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import {
  findProductByScan,
  getNearestStore,
  productName,
} from '../data/mock'
import { colors, radius, shadow } from '../theme'

const BARCODE_TYPES = ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39']

export default function ScanScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { user, addToCart } = useApp()
  const nearestId = getNearestStore(user?.address)?.id
  const [permission, requestPermission] = useCameraPermissions()
  const [manual, setManual] = useState('')
  const [showManual, setShowManual] = useState(Platform.OS === 'web')
  const lock = useRef(false)

  const applyCode = useCallback(
    (raw) => {
      const hit = findProductByScan(raw, nearestId)
      if (!hit) {
        Alert.alert(t('scanTitle'), t('scanNotFound'))
        return false
      }
      const ok = addToCart(hit.storeId, hit.productId)
      if (!ok) {
        Alert.alert(t('scanTitle'), t('scanAddFail'))
        return false
      }
      Alert.alert(t('scanTitle'), t('scanAdded', { name: productName(hit.product, lang) }), [
        { text: t('continue'), style: 'cancel' },
        { text: t('goToCart'), onPress: () => navigation.navigate('Cart') },
      ])
      return true
    },
    [addToCart, lang, nearestId, navigation, t],
  )

  const onBarcodeScanned = useCallback(
    ({ data }) => {
      if (lock.current || !data) return
      lock.current = true
      const ok = applyCode(data)
      setTimeout(() => {
        lock.current = false
      }, ok ? 1800 : 900)
    },
    [applyCode],
  )

  const submitManual = () => {
    const code = manual.trim()
    if (!code) return
    if (applyCode(code)) setManual('')
  }

  const cameraOk = permission?.granted && Platform.OS !== 'web'
  const cameraUnavailable = Platform.OS === 'web' || permission?.granted === false

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ink }} edges={['bottom']}>
      <TopBar title={t('scanTitle')} onBack={() => navigation.goBack()} />

      <View style={{ flex: 1 }}>
        {cameraOk ? (
          <View style={{ flex: 1 }}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
              onBarcodeScanned={onBarcodeScanned}
            />
            <View style={styles.overlay} pointerEvents="none">
              <View style={styles.frame} />
              <Text style={styles.hint}>{t('scanHint')}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.fallback}>
            {!permission ? (
              <Text style={styles.fallbackText}>{t('scanPermissionLoading')}</Text>
            ) : !permission.granted ? (
              <>
                <Text style={styles.fallbackText}>{t('scanPermissionDenied')}</Text>
                <SoftPress onPress={requestPermission} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>{t('scanAllowCamera')}</Text>
                </SoftPress>
              </>
            ) : (
              <Text style={styles.fallbackText}>{t('scanCameraUnavailable')}</Text>
            )}
            <Text style={[styles.fallbackText, { marginTop: 12, opacity: 0.75, fontSize: 13 }]}>
              {t('scanManualHint')}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.manualCard,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          {(showManual || cameraUnavailable) && (
            <>
              <TextInput
                value={manual}
                onChangeText={setManual}
                placeholder={t('scanManualPlaceholder')}
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={submitManual}
                style={[
                  styles.manualInput,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
              />
              <SoftPress onPress={submitManual} style={styles.addBtn}>
                <Text style={styles.addBtnText}>{t('addToCart')}</Text>
              </SoftPress>
            </>
          )}
          {!showManual && !cameraUnavailable ? (
            <SoftPress
              onPress={() => setShowManual(true)}
              style={[styles.manualToggle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Keyboard size={16} color={colors.ink} />
              <Text style={{ fontWeight: '700', color: colors.ink }}>{t('scanEnterManually')}</Text>
            </SoftPress>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={styles.samples}>{t('scanSamples')}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.yellow,
    backgroundColor: 'transparent',
  },
  hint: {
    marginTop: 18,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.bg,
  },
  fallbackText: {
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.red,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  manualCard: {
    margin: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: radius,
    padding: 10,
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shadow.card,
  },
  manualInput: {
    flex: 1,
    minWidth: 140,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.bg,
    fontWeight: '600',
    color: colors.ink,
  },
  addBtn: {
    backgroundColor: colors.red,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  manualToggle: {
    flex: 1,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  samples: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
})
