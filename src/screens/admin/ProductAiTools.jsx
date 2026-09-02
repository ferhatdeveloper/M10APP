import { useState } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'
import { Languages, Sparkles } from 'lucide-react-native'
import { colors } from '../../theme'
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_IMAGE_MODEL,
  generateImage,
  loadApiKey,
  loadChatModel,
  loadImageModel,
  OpenRouterError,
  translateProductText,
} from '../../utils/openrouter'
import { productName } from '../../data/mock'

function showOrError(e, t) {
  const status = e?.status
  if (status === 401 || status === 403) {
    Alert.alert(t('aiErrorTitle'), t('aiErrInvalidKey'))
    return
  }
  if (status === 429) {
    Alert.alert(t('aiErrorTitle'), t('aiErrRateLimit'))
    return
  }
  Alert.alert(t('aiErrorTitle'), e?.message || t('aiErrGeneric'))
}

export function ProductBatchTranslateBar({
  t,
  isRTL,
  selectedIds,
  liveCatalog,
  adminUpsertProduct,
  onClearSelection,
}) {
  const [targets, setTargets] = useState({ ar: true, en: true, tr: true })
  const [busy, setBusy] = useState(false)

  const toggle = (lang) => setTargets((prev) => ({ ...prev, [lang]: !prev[lang] }))

  const run = async () => {
    if (!selectedIds?.length) {
      Alert.alert(t('aiErrorTitle'), t('adminSelectProductsFirst'))
      return
    }
    const apiKey = await loadApiKey()
    if (!apiKey?.trim()) {
      Alert.alert(t('aiErrorTitle'), t('aiNeedKey'))
      return
    }
    const selected = Object.entries(targets)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (!selected.length) {
      Alert.alert(t('aiErrorTitle'), t('adminPickTargetLang'))
      return
    }
    setBusy(true)
    try {
      const chatModel = (await loadChatModel()) || DEFAULT_CHAT_MODEL
      let ok = 0
      for (const id of selectedIds) {
        const existing = (liveCatalog || []).find((p) => p.id === id)
        if (!existing) continue
        const source =
          existing.names?.en ||
          existing.names?.tr ||
          existing.names?.ar ||
          existing.nameEn ||
          existing.nameTr ||
          existing.name ||
          productName(existing, 'en')
        if (!String(source || '').trim()) continue
        const result = await translateProductText(apiKey.trim(), {
          text: source,
          targets: selected,
          model: chatModel,
        })
        const nameAr = result.ar ?? existing.names?.ar ?? existing.name ?? ''
        const nameEn = result.en ?? existing.names?.en ?? ''
        const nameTr = result.tr ?? existing.names?.tr ?? ''
        adminUpsertProduct({
          ...existing,
          nameAr,
          nameEn,
          nameTr,
          names: { ar: nameAr, en: nameEn, tr: nameTr },
        })
        ok += 1
      }
      Alert.alert(t('aiSavedTitle'), t('adminBatchTranslated', { n: ok }))
      onClearSelection?.()
    } catch (e) {
      showOrError(e, t)
    } finally {
      setBusy(false)
    }
  }

  if (!selectedIds?.length) return null

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 12,
        gap: 10,
      }}
    >
      <Text style={{ fontWeight: '800', textAlign: isRTL ? 'right' : 'left' }}>
        {t('adminSelectedCount', { n: selectedIds.length })}
      </Text>
      <Text style={{ fontSize: 12, color: colors.muted, textAlign: isRTL ? 'right' : 'left' }}>
        {t('adminBatchTranslateHint')}
      </Text>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, flexWrap: 'wrap' }}>
        {['ar', 'en', 'tr'].map((l) => {
          const on = !!targets[l]
          return (
            <Pressable
              key={l}
              onPress={() => toggle(l)}
              style={{
                backgroundColor: on ? colors.red : colors.bg,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderWidth: on ? 0 : 1,
                borderColor: colors.line,
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 12, color: on ? '#fff' : colors.ink }}>
                {l.toUpperCase()}
              </Text>
            </Pressable>
          )
        })}
      </View>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8 }}>
        <Pressable
          onPress={run}
          disabled={busy}
          style={{
            flex: 1,
            backgroundColor: colors.red,
            borderRadius: 8,
            padding: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: busy ? 0.85 : 1,
          }}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Languages size={14} color="#fff" />}
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13 }}>{t('adminAiTranslateSelected')}</Text>
        </Pressable>
        <Pressable
          onPress={onClearSelection}
          style={{
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.line,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontWeight: '700', color: colors.muted }}>{t('cancel')}</Text>
        </Pressable>
      </View>
    </View>
  )
}

export function ProductAiImageButton({ t, isRTL, productForm, setProductForm }) {
  const [busy, setBusy] = useState(false)

  const run = async () => {
    const apiKey = await loadApiKey()
    if (!apiKey?.trim()) {
      Alert.alert(t('aiErrorTitle'), t('aiNeedKey'))
      return
    }
    const name =
      productForm?.nameEn ||
      productForm?.nameTr ||
      productForm?.nameAr ||
      productForm?.id ||
      'grocery product'
    const prompt = `Professional supermarket product photo of "${name}", clean white background, retail packaging, high detail, commercial lighting, square 1:1`
    setBusy(true)
    try {
      const imageModel = (await loadImageModel()) || DEFAULT_IMAGE_MODEL
      const result = await generateImage(apiKey.trim(), { prompt, model: imageModel })
      if (result?.uri) {
        setProductForm((f) => (f ? { ...f, image: result.uri } : f))
        if (result.fallback) {
          Alert.alert(t('aiImageFallbackTitle'), t('aiImageFallbackHint'))
        } else {
          Alert.alert(t('aiSavedTitle'), t('adminAiImageApplied'))
        }
      } else if (result?.unsplashUrl) {
        Alert.alert(t('aiImageFallbackTitle'), t('aiImageFallbackHint'))
      }
    } catch (e) {
      if (e instanceof OpenRouterError || e?.status) showOrError(e, t)
      else Alert.alert(t('aiErrorTitle'), e?.message || t('aiErrGeneric'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Pressable
      onPress={run}
      disabled={busy}
      style={{
        backgroundColor: colors.ink,
        borderRadius: 10,
        padding: 12,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 10,
        opacity: busy ? 0.85 : 1,
      }}
    >
      {busy ? <ActivityIndicator color={colors.yellow} /> : <Sparkles size={16} color={colors.yellow} />}
      <Text style={{ color: '#fff', fontWeight: '800' }}>{t('adminAiSocialImage')}</Text>
    </Pressable>
  )
}

export function SelectDot({ on, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: on ? colors.red : colors.line,
        backgroundColor: on ? colors.red : '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {on ? <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>✓</Text> : null}
    </Pressable>
  )
}
