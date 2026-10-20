import { useState } from 'react'
import { Platform, Pressable, Text, TextInput, View } from 'react-native'
import { Mic, ScanBarcode, Search, X } from 'lucide-react-native'
import SoftPress from './SoftPress'
import { colors, radiusPill, shadow } from '../theme'

/**
 * Shared search pill — Home (pressable) + Search (input).
 * TopBar is never modified here.
 */
export default function SearchField({
  mode = 'input',
  value = '',
  onChangeText,
  placeholder,
  onPress,
  onScan,
  onVoice,
  voiceListening = false,
  onSubmitEditing,
  isRTL = false,
  autoFocus = false,
  compact = false,
}) {
  const [focused, setFocused] = useState(false)
  const showClear = mode === 'input' && Boolean(String(value || '').length)

  const row = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: compact ? 8 : 10,
    backgroundColor: compact ? colors.bg : '#fff',
    borderRadius: radiusPill,
    paddingHorizontal: compact ? 12 : 14,
    paddingVertical: mode === 'pressable' ? (compact ? 0 : 13) : 4,
    minHeight: compact ? 38 : 50,
    height: compact && mode === 'pressable' ? 38 : undefined,
    borderWidth: focused ? 1.5 : 1,
    borderColor: focused ? colors.red : colors.line,
    ...(compact
      ? { shadowOpacity: 0, elevation: 0 }
      : {
          ...shadow.soft,
          ...(Platform.OS === 'web'
            ? { boxShadow: focused ? '0 4px 18px rgba(227,30,36,0.12)' : '0 3px 12px rgba(22,22,22,0.06)' }
            : null),
        }),
  }

  const scanBtn = onScan ? (
    <SoftPress
      onPress={onScan}
      accessibilityRole="button"
      accessibilityLabel="scan"
      style={{
        width: compact ? 30 : 38,
        height: compact ? 30 : 38,
        borderRadius: compact ? 15 : 19,
        backgroundColor: colors.redSoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(227,30,36,0.18)',
      }}
    >
      <ScanBarcode size={compact ? 15 : 18} color={colors.red} strokeWidth={2.2} />
    </SoftPress>
  ) : null

  if (mode === 'pressable') {
    return (
      <SoftPress onPress={onPress} style={row}>
        {compact ? (
          <Search size={16} color={colors.muted} strokeWidth={2.2} />
        ) : (
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: colors.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search size={17} color={colors.muted} />
          </View>
        )}
        <Text
          style={{
            flex: 1,
            color: colors.muted,
            fontWeight: compact ? '500' : '600',
            fontSize: compact ? 13 : 15,
          }}
          numberOfLines={1}
        >
          {placeholder}
        </Text>
        {scanBtn}
      </SoftPress>
    )
  }

  return (
    <View style={row}>
      <Search size={18} color={focused ? colors.red : colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        style={{
          flex: 1,
          minHeight: 42,
          fontSize: 15,
          fontWeight: '600',
          color: colors.ink,
          textAlign: isRTL ? 'right' : 'left',
          ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
        }}
      />
      {showClear ? (
        <Pressable
          onPress={() => onChangeText?.('')}
          hitSlop={8}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} color={colors.muted} />
        </Pressable>
      ) : null}
      {onVoice ? (
        <SoftPress
          onPress={onVoice}
          accessibilityLabel="voice"
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: voiceListening ? colors.red : colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mic size={18} color={voiceListening ? '#fff' : colors.muted} />
        </SoftPress>
      ) : null}
      {scanBtn}
    </View>
  )
}
