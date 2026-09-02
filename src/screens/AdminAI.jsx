import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Sparkles, KeyRound, Languages, ImageIcon, Share2, Trash2 } from 'lucide-react-native'
import { colors, shadow } from '../theme'
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_IMAGE_MODEL,
  generateImage,
  generateSocialPack,
  loadApiKey,
  loadChatModel,
  loadImageModel,
  loadSocialDrafts,
  maskApiKey,
  OpenRouterError,
  saveApiKey,
  saveChatModel,
  saveImageModel,
  saveSocialDrafts,
  testConnection,
  translateProductText,
} from '../utils/openrouter'

function Field({ label, value, onChangeText, isRTL, multiline, placeholder, secureTextEntry, editable = true }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 12,
          padding: 12,
          backgroundColor: editable ? '#fff' : colors.bg,
          textAlign: isRTL ? 'right' : 'left',
          minHeight: multiline ? 88 : undefined,
          color: colors.ink,
        }}
      />
    </View>
  )
}

function SubTab({ id, label, icon: Icon, on, onPress, isRTL }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: on ? colors.red : colors.bg,
        borderWidth: on ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      <Icon size={14} color={on ? '#fff' : colors.muted} />
      <Text style={{ fontWeight: '800', fontSize: 11, color: on ? '#fff' : colors.ink }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  )
}

function LangChip({ label, on, onPress, isRTL }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: on ? colors.red : colors.bg,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: on ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      <Text style={{ fontWeight: '800', fontSize: 12, color: on ? '#fff' : colors.ink, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
    </Pressable>
  )
}

function PrimaryBtn({ label, onPress, disabled, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? '#ccc' : colors.red,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        opacity: loading ? 0.85 : 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {loading ? <ActivityIndicator color="#fff" /> : null}
      <Text style={{ color: '#fff', fontWeight: '900' }}>{label}</Text>
    </Pressable>
  )
}

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

export default function AdminAI({ t, isRTL, liveCatalog, lang, adminUpsertProduct }) {
  const [sub, setSub] = useState('setup')
  const [apiKey, setApiKey] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [connected, setConnected] = useState(false)
  const [chatModel, setChatModel] = useState(DEFAULT_CHAT_MODEL)
  const [imageModel, setImageModel] = useState(DEFAULT_IMAGE_MODEL)
  const [busy, setBusy] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const [sourceText, setSourceText] = useState('')
  const [targets, setTargets] = useState({ ar: true, en: true, tr: true })
  const [translations, setTranslations] = useState(null)
  const [applyProductId, setApplyProductId] = useState('')

  const [imgPrompt, setImgPrompt] = useState('')
  const [imgResult, setImgResult] = useState(null)

  const [socialBrief, setSocialBrief] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [socialPack, setSocialPack] = useState(null)
  const [drafts, setDrafts] = useState([])

  useEffect(() => {
    ;(async () => {
      const [k, cm, im, d] = await Promise.all([
        loadApiKey(),
        loadChatModel(),
        loadImageModel(),
        loadSocialDrafts(),
      ])
      setApiKey(k)
      setKeySaved(!!k)
      setConnected(!!k)
      setChatModel(cm)
      setImageModel(im)
      setDrafts(d)
    })()
  }, [])

  const requireKey = useCallback(() => {
    if (!apiKey?.trim()) {
      Alert.alert(t('aiErrorTitle'), t('aiNeedKey'))
      setSub('setup')
      return false
    }
    return true
  }, [apiKey, t])

  const onSaveKey = async () => {
    try {
      await saveApiKey(apiKey)
      await saveChatModel(chatModel)
      await saveImageModel(imageModel)
      setKeySaved(!!apiKey.trim())
      Alert.alert(t('aiSavedTitle'), t('aiKeySaved'))
    } catch {
      Alert.alert(t('aiErrorTitle'), t('aiErrGeneric'))
    }
  }

  const onClearKey = () => {
    Alert.alert(t('aiClearKeyTitle'), t('aiClearKeyHint'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('aiClearKey'),
        style: 'destructive',
        onPress: async () => {
          setApiKey('')
          setKeySaved(false)
          setConnected(false)
          await saveApiKey('')
        },
      },
    ])
  }

  const onTest = async () => {
    if (!requireKey()) return
    setBusy(true)
    try {
      const r = await testConnection(apiKey.trim())
      setConnected(true)
      await saveApiKey(apiKey)
      setKeySaved(true)
      Alert.alert(
        t('aiConnectedTitle'),
        r.via === 'models' ? t('aiConnectedModels', { n: r.count }) : t('aiConnectedChat'),
      )
    } catch (e) {
      setConnected(false)
      showOrError(e, t)
    } finally {
      setBusy(false)
    }
  }

  const onTranslate = async () => {
    if (!requireKey()) return
    setBusy(true)
    try {
      const selected = Object.entries(targets)
        .filter(([, v]) => v)
        .map(([k]) => k)
      const result = await translateProductText(apiKey.trim(), {
        text: sourceText,
        targets: selected,
        model: chatModel,
      })
      setTranslations(result)
    } catch (e) {
      showOrError(e, t)
    } finally {
      setBusy(false)
    }
  }

  const onApplyToProduct = () => {
    if (!translations) return
    const id = applyProductId.trim()
    if (!id) {
      Alert.alert(t('aiErrorTitle'), t('aiNeedProductId'))
      return
    }
    const existing = (liveCatalog || []).find((p) => p.id === id)
    if (!existing) {
      Alert.alert(t('aiErrorTitle'), t('aiProductNotFound'))
      return
    }
    const nameAr = translations.ar ?? existing.names?.ar ?? existing.name ?? ''
    const nameEn = translations.en ?? existing.names?.en ?? ''
    const nameTr = translations.tr ?? existing.names?.tr ?? ''
    adminUpsertProduct({
      ...existing,
      nameAr,
      nameEn,
      nameTr,
      names: { ar: nameAr, en: nameEn, tr: nameTr },
    })
    Alert.alert(t('aiSavedTitle'), t('aiAppliedProduct'))
  }

  const onGenImage = async () => {
    if (!requireKey()) return
    setBusy(true)
    setImgResult(null)
    try {
      const result = await generateImage(apiKey.trim(), { prompt: imgPrompt, model: imageModel })
      setImgResult(result)
      if (result.fallback) {
        Alert.alert(t('aiImageFallbackTitle'), t('aiImageFallbackHint'))
      }
    } catch (e) {
      showOrError(e, t)
    } finally {
      setBusy(false)
    }
  }

  const onSocial = async () => {
    if (!requireKey()) return
    setBusy(true)
    try {
      const pack = await generateSocialPack(apiKey.trim(), {
        brief: socialBrief,
        model: chatModel,
        platform,
      })
      setSocialPack(pack)
    } catch (e) {
      showOrError(e, t)
    } finally {
      setBusy(false)
    }
  }

  const onSaveDraft = async () => {
    if (!socialPack) return
    const entry = {
      id: `draft-${Date.now()}`,
      createdAt: Date.now(),
      brief: socialBrief.slice(0, 120),
      platform,
      pack: socialPack,
    }
    const next = [entry, ...drafts].slice(0, 30)
    setDrafts(next)
    await saveSocialDrafts(next)
    Alert.alert(t('aiSavedTitle'), t('aiDraftSaved'))
  }

  const onDeleteDraft = async (id) => {
    const next = drafts.filter((d) => d.id !== id)
    setDrafts(next)
    await saveSocialDrafts(next)
  }

  const shareText = async (text) => {
    try {
      await Share.share({ message: String(text || '') })
    } catch {
      /* ignore */
    }
  }

  const guide = (
    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 4, ...shadow.soft }}>
      <Text style={{ fontWeight: '900', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t('aiHowToTitle')}</Text>
      <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: isRTL ? 'right' : 'left' }}>
        {t('aiHowToBody')}
      </Text>
    </View>
  )

  return (
    <View style={{ gap: 12 }}>
      <View style={{ backgroundColor: colors.ink, borderRadius: 16, padding: 14 }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color={colors.yellow} />
          <Text style={{ color: colors.yellow, fontWeight: '900', fontSize: 14 }}>{t('aiSectionTitle')}</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
          {t('aiSectionHint')}
        </Text>
        <View
          style={{
            marginTop: 10,
            alignSelf: isRTL ? 'flex-end' : 'flex-start',
            backgroundColor: connected ? colors.openBg : 'rgba(255,255,255,0.12)',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontWeight: '800', fontSize: 11, color: connected ? colors.open : '#fff' }}>
            {connected ? t('aiStatusConnected') : keySaved ? t('aiStatusKeySaved') : t('aiStatusDisconnected')}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6 }}>
        <SubTab id="setup" label={t('aiTabSetup')} icon={KeyRound} on={sub === 'setup'} onPress={() => setSub('setup')} isRTL={isRTL} />
        <SubTab id="translate" label={t('aiTabTranslate')} icon={Languages} on={sub === 'translate'} onPress={() => setSub('translate')} isRTL={isRTL} />
        <SubTab id="image" label={t('aiTabImage')} icon={ImageIcon} on={sub === 'image'} onPress={() => setSub('image')} isRTL={isRTL} />
        <SubTab id="social" label={t('aiTabSocial')} icon={Share2} on={sub === 'social'} onPress={() => setSub('social')} isRTL={isRTL} />
      </View>

      {sub === 'setup' ? (
        <>
          {guide}
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
            <Field
              label={t('aiApiKey')}
              value={apiKey}
              onChangeText={setApiKey}
              isRTL={isRTL}
              secureTextEntry={!showKey}
              placeholder="sk-or-v1-…"
            />
            <Pressable onPress={() => setShowKey((s) => !s)} style={{ marginBottom: 10 }}>
              <Text style={{ color: colors.red, fontWeight: '700', fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>
                {showKey ? t('aiHideKey') : t('aiShowKey')}
                {keySaved && apiKey ? ` · ${maskApiKey(apiKey)}` : ''}
              </Text>
            </Pressable>
            <Field
              label={t('aiChatModel')}
              value={chatModel}
              onChangeText={setChatModel}
              isRTL={isRTL}
              placeholder={DEFAULT_CHAT_MODEL}
            />
            <Field
              label={t('aiImageModel')}
              value={imageModel}
              onChangeText={setImageModel}
              isRTL={isRTL}
              placeholder={DEFAULT_IMAGE_MODEL}
            />
            <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
              {t('aiKeyLocalOnly')}
            </Text>
            <View style={{ gap: 8 }}>
              <PrimaryBtn label={t('aiSaveKey')} onPress={onSaveKey} loading={busy} />
              <PrimaryBtn label={t('aiTestConnection')} onPress={onTest} loading={busy} />
              <Pressable onPress={onClearKey} style={{ padding: 10, alignItems: 'center' }}>
                <Text style={{ color: colors.red, fontWeight: '700' }}>{t('aiClearKey')}</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : null}

      {sub === 'translate' ? (
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 4 }}>
          <Text style={{ fontWeight: '800', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t('aiTranslateTitle')}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
            {t('aiTranslateHint')}
          </Text>
          <Field
            label={t('aiSourceText')}
            value={sourceText}
            onChangeText={setSourceText}
            isRTL={isRTL}
            multiline
            placeholder={t('aiSourcePlaceholder')}
          />
          <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
            {t('aiTargetLangs')}
          </Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginBottom: 12 }}>
            {['ar', 'en', 'tr'].map((l) => (
              <LangChip
                key={l}
                label={l.toUpperCase()}
                on={!!targets[l]}
                onPress={() => setTargets((prev) => ({ ...prev, [l]: !prev[l] }))}
                isRTL={isRTL}
              />
            ))}
          </View>
          <PrimaryBtn label={t('aiRunTranslate')} onPress={onTranslate} loading={busy} disabled={!sourceText.trim()} />
          {translations ? (
            <View style={{ marginTop: 14, gap: 8 }}>
              {['ar', 'en', 'tr'].map((l) =>
                translations[l] ? (
                  <View key={l}>
                    <Text style={{ fontWeight: '800', marginBottom: 4 }}>{l.toUpperCase()}</Text>
                    <Pressable onPress={() => shareText(translations[l])}>
                      <Text
                        selectable
                        style={{
                          backgroundColor: colors.bg,
                          borderRadius: 10,
                          padding: 10,
                          textAlign: l === 'ar' ? 'right' : 'left',
                        }}
                      >
                        {translations[l]}
                      </Text>
                    </Pressable>
                  </View>
                ) : null,
              )}
              <Field
                label={t('aiApplyProductId')}
                value={applyProductId}
                onChangeText={setApplyProductId}
                isRTL={isRTL}
                placeholder="mm-eggs"
              />
              <PrimaryBtn label={t('aiApplyToProduct')} onPress={onApplyToProduct} />
            </View>
          ) : null}
        </View>
      ) : null}

      {sub === 'image' ? (
        <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
          <Text style={{ fontWeight: '800', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t('aiImageTitle')}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
            {t('aiImageHint')}
          </Text>
          <Field
            label={t('aiImagePrompt')}
            value={imgPrompt}
            onChangeText={setImgPrompt}
            isRTL={isRTL}
            multiline
            placeholder={t('aiImagePlaceholder')}
          />
          <PrimaryBtn label={t('aiRunImage')} onPress={onGenImage} loading={busy} disabled={!imgPrompt.trim()} />
          {imgResult?.ok && imgResult.uri ? (
            <View style={{ marginTop: 14 }}>
              <Image source={{ uri: imgResult.uri }} style={{ width: '100%', height: 240, borderRadius: 12 }} resizeMode="cover" />
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
                {t('aiImageModelUsed')}: {imgResult.model} ({imgResult.source})
              </Text>
            </View>
          ) : null}
          {imgResult?.fallback ? (
            <View style={{ marginTop: 14, gap: 8 }}>
              {imgResult.copy ? (
                <Text selectable style={{ backgroundColor: colors.bg, borderRadius: 10, padding: 10, textAlign: isRTL ? 'right' : 'left' }}>
                  {imgResult.copy}
                </Text>
              ) : null}
              <Pressable
                onPress={() => Linking.openURL(imgResult.unsplashUrl)}
                style={{ backgroundColor: colors.yellow, borderRadius: 12, padding: 12, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '900', color: colors.ink }}>{t('aiOpenUnsplash')}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      {sub === 'social' ? (
        <View style={{ gap: 12 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
            <Text style={{ fontWeight: '800', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t('aiSocialTitle')}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
              {t('aiSocialHint')}
            </Text>
            <Field
              label={t('aiSocialBrief')}
              value={socialBrief}
              onChangeText={setSocialBrief}
              isRTL={isRTL}
              multiline
              placeholder={t('aiSocialPlaceholder')}
            />
            <Text style={{ fontWeight: '700', fontSize: 12, color: colors.muted, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
              {t('aiPlatform')}
            </Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 8, marginBottom: 12 }}>
              {['instagram', 'facebook'].map((p) => (
                <LangChip key={p} label={p === 'instagram' ? 'Instagram' : 'Facebook'} on={platform === p} onPress={() => setPlatform(p)} isRTL={isRTL} />
              ))}
            </View>
            <PrimaryBtn label={t('aiRunSocial')} onPress={onSocial} loading={busy} disabled={!socialBrief.trim()} />
            {socialPack ? (
              <View style={{ marginTop: 14, gap: 10 }}>
                {['tr', 'en', 'ar'].map((l) => {
                  const block = socialPack[l]
                  if (!block) return null
                  const tags = Array.isArray(block.hashtags) ? block.hashtags.join(' ') : ''
                  const full = `${block.caption || ''}\n\n${block.short || ''}\n\n${tags}`.trim()
                  return (
                    <View key={l} style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 12 }}>
                      <Text style={{ fontWeight: '900', marginBottom: 6 }}>{l.toUpperCase()}</Text>
                      <Text selectable style={{ textAlign: l === 'ar' ? 'right' : 'left', lineHeight: 20 }}>
                        {block.caption}
                      </Text>
                      {block.short ? (
                        <Text selectable style={{ marginTop: 8, color: colors.muted, fontSize: 12, textAlign: l === 'ar' ? 'right' : 'left' }}>
                          {block.short}
                        </Text>
                      ) : null}
                      {tags ? (
                        <Text selectable style={{ marginTop: 8, color: colors.red, fontWeight: '700', fontSize: 12 }}>
                          {tags}
                        </Text>
                      ) : null}
                      <Pressable onPress={() => shareText(full)} style={{ marginTop: 8 }}>
                        <Text style={{ color: colors.red, fontWeight: '800', fontSize: 12 }}>{t('aiShareCopy')}</Text>
                      </Pressable>
                    </View>
                  )
                })}
                {socialPack.imagePrompt ? (
                  <View style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 12 }}>
                    <Text style={{ fontWeight: '900', marginBottom: 6 }}>{t('aiImagePromptSuggest')}</Text>
                    <Text selectable style={{ textAlign: isRTL ? 'right' : 'left' }}>{socialPack.imagePrompt}</Text>
                  </View>
                ) : null}
                <PrimaryBtn label={t('aiSaveDraft')} onPress={onSaveDraft} />
              </View>
            ) : null}
          </View>

          {drafts.length > 0 ? (
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14 }}>
              <Text style={{ fontWeight: '800', marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>{t('aiDrafts')}</Text>
              {drafts.map((d) => (
                <View
                  key={d.id}
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: colors.line,
                    paddingVertical: 10,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => {
                      setSocialPack(d.pack)
                      setSocialBrief(d.brief || '')
                      setPlatform(d.platform || 'instagram')
                    }}
                  >
                    <Text style={{ fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
                      {d.brief || d.id}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11, textAlign: isRTL ? 'right' : 'left' }}>
                      {d.platform} · {new Date(d.createdAt).toLocaleString(lang === 'ar' ? 'ar' : lang === 'tr' ? 'tr-TR' : 'en')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => onDeleteDraft(d.id)} hitSlop={8}>
                    <Trash2 size={16} color={colors.red} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}
