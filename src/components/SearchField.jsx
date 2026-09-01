import { useState } from 'react'
import { Platform, Pressable, Text, TextInput, View } from 'react-native'
import { ScanBarcode, Search, X } from 'lucide-react-native'
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
  onSubmitEditing,
  isRTL = false,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false)
  const showClear = mode === 'input' && Boolean(String(value || '').length)

  const row = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: radiusPill,
    paddingHorizontal: 14,
    paddingVertical: mode === 'pressable' ? 13 : 4,
    minHeight: 50,
    borderWidth: focused ? 1.5 : 1,
    borderColor: focused ? colors.red : colors.line,
    ...shadow.soft,
    ...(Platform.OS === 'web'
      ? { boxShadow: focused ? '0 4px 18px rgba(227,30,36,0.12)' : '0 3px 12px rgba(22,22,22,0.06)' }
      : null),
  }

  const scanBtn = onScan ? (
    <SoftPress
      onPress={onScan}
      accessibilityRole="button"
      accessibilityLabel="scan"
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.redSoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(227,30,36,0.18)',
      }}
    >
      <ScanBarcode size={18} color={colors.red} strokeWidth={2.2} />
    </SoftPress>
  ) : null

  if (mode === 'pressable') {
    return (
      <SoftPress onPress={onPress} style={row}>
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
        <Text style={{ flex: 1, color: colors.muted, fontWeight: '600', fontSize: 15 }} numberOfLines={1}>
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
      {scanBtn}
    </View>
  )
}
