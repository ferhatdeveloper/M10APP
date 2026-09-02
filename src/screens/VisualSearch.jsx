import { useState } from 'react'
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera, ImagePlus, Sparkles, X } from 'lucide-react-native'
import TopBar from '../components/TopBar'
import SoftPress from '../components/SoftPress'
import ProductImage from '../components/ProductImage'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatIQD, productName, storeName, liveStores } from '../data/mock'
import { loadApiKey, loadChatModel, describeImage } from '../utils/openrouter'
import { colors, radius, shadow } from '../theme'

export default function VisualSearchScreen({ navigation }) {
  const { t, lang, isRTL } = useI18n()
  const { getLiveProducts, liveStores: stores } = useApp()
  const [imageUri, setImageUri] = useState(null)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState(null) // { query, matches: [...] }
  const [error, setError] = useState('')

  const pickFromLibrary = async () => {
    setError('')
    try {
      const ImagePicker = await import('expo-image-picker')
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (perm.status !== 'granted') {
        setError(t('vsPermDenied'))
        return
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
        allowsEditing: false,
      })
      if (!res.canceled && res.assets?.[0]) {
        setImageUri(res.assets[0].uri)
        setResults(null)
      }
    } catch (e) {
      setError(t('vsPickFail'))
    }
  }

  const takePhoto = async () => {
    setError('')
    try {
      const ImagePicker = await import('expo-image-picker')
      const perm = await ImagePicker.requestCameraPermissionsAsync()
      if (perm.status !== 'granted') {
        setError(t('vsPermDenied'))
        return
      }
      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      })
      if (!res.canceled && res.assets?.[0]) {
        setImageUri(res.assets[0].uri)
        setResults(null)
      }
    } catch (e) {
      setError(t('vsPickFail'))
    }
  }

  const runSearch = async () => {
    if (!imageUri) return
    setBusy(true)
    setError('')
    try {
      const apiKey = await loadApiKey()
      if (!apiKey) {
        setError(t('vsNoApiKey'))
        return
      }
      const model = await loadChatModel()
      const description = await describeImage(apiKey, { model, imageUrl: imageUri, lang })
      // Match the description against catalog using fuzzy matching already in searchCatalog
      // We import directly to avoid circulars
      const { searchCatalog } = await import('../data/mock')
      const { matchedProducts } = searchCatalog(description, lang)
      // Enrich with storeId
      const enriched = matchedProducts.slice(0, 24).map((p) => ({
        ...p,
        storeId: p.storeId,
      }))
      setResults({ query: description, matches: enriched })
    } catch (e) {
      setError(e?.message || t('vsSearchFail'))
    } finally {
      setBusy(false)
    }
  }

  const clear = () => {
    setImageUri(null)
    setResults(null)
    setError('')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={[]}>
      <TopBar title={t('searchByImage')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {/* Image picker card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.line,
            ...shadow.soft,
          }}
        >
          {imageUri ? (
            <View>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 220, borderRadius: 14, backgroundColor: colors.bg }}
                resizeMode="cover"
              />
              <Pressable
                onPress={clear}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} color="#fff" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickFromLibrary}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 14,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colors.line,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ImagePlus size={36} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: '700' }}>
                {t('vsPickHint')}
              </Text>
            </Pressable>
          )}

          {!imageUri ? (
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 8,
                marginTop: 12,
              }}
            >
              <SoftPress
                onPress={pickFromLibrary}
                style={pickerBtn('#fff', colors.ink, colors.line)}
              >
                <ImagePlus size={16} color={colors.ink} />
                <Text style={{ fontWeight: '800' }}>{t('vsFromGallery')}</Text>
              </SoftPress>
              <SoftPress
                onPress={takePhoto}
                style={pickerBtn(colors.red, '#fff', colors.red)}
              >
                <Camera size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800' }}>{t('vsTakePhoto')}</Text>
              </SoftPress>
            </View>
          ) : (
            <SoftPress
              onPress={runSearch}
              disabled={busy}
              style={{
                marginTop: 12,
                backgroundColor: busy ? '#888' : colors.red,
                borderRadius: 14,
                padding: 14,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '900' }}>
                {busy ? t('vsSearching') : t('vsFindMatches')}
              </Text>
            </SoftPress>
          )}

          {error ? (
            <Text
              style={{
                color: colors.red,
                fontWeight: '700',
                marginTop: 10,
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {error}
            </Text>
          ) : null}
        </View>

        {/* Hint card */}
        {!results && !imageUri ? (
          <View
            style={{
              backgroundColor: colors.ink,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={16} color={colors.yellow} />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  flex: 1,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {t('vsHowTitle')}
              </Text>
            </View>
            <Text
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: 12,
                marginTop: 6,
                lineHeight: 18,
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {t('vsHowBody')}
            </Text>
          </View>
        ) : null}

        {/* Results */}
        {results ? (
          <View style={{ gap: 10 }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: colors.line,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={14} color={colors.red} />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  flex: 1,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {t('vsAiSaw')}
              </Text>
              <Text
                style={{ fontWeight: '900', color: colors.ink, fontSize: 13 }}
                numberOfLines={1}
              >
                {results.query}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: '800',
                color: colors.muted,
                fontSize: 12,
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {t('resultsCount', { n: results.matches.length })}
            </Text>
            {results.matches.length === 0 ? (
              <Text style={{ color: colors.muted, textAlign: 'center', paddingVertical: 24 }}>
                {t('vsNoMatches')}
              </Text>
            ) : (
              results.matches.map((p) => {
                const store = stores.find((s) => s.id === p.storeId)
                return (
                  <Pressable
                    key={`${p.storeId}-${p.id}`}
                    onPress={() => navigation.navigate('Store', { id: p.storeId })}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      padding: 10,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      gap: 10,
                      ...shadow.soft,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '800' }} numberOfLines={2}>
                        {productName(p, lang)}
                      </Text>
                      <Text
                        style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}
                        numberOfLines={1}
                      >
                        {store ? storeName(store, lang) : ''}
                      </Text>
                      <Text
                        style={{
                          color: colors.red,
                          fontWeight: '900',
                          marginTop: 6,
                        }}
                      >
                        {formatIQD(p.price, lang)}
                      </Text>
                    </View>
                    <ProductImage
                      uri={p.image}
                      aisle={p.aisle}
                      style={{ width: 80, height: 80, borderRadius: 12 }}
                    />
                  </Pressable>
                )
              })
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

function pickerBtn(bg, fg, border) {
  return {
    flex: 1,
    backgroundColor: bg,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: border,
  }
}