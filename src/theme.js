// M10 theme tokens — Teknik Şartname (Pantone 2347 C / 116 C + yardımcılar)
// Supports light & dark modes. Safe app-wide.

export const palette = {
  // Kurumsal — Pantone 2347 C
  red: '#E02020',
  redDark: '#C01818',
  redDeep: '#9A1212',
  redSoft: '#FDECEC',
  // Kurumsal — Pantone 116 C
  yellow: '#FFD000',
  yellowDark: '#E6BB00',
  yellowSoft: '#FFF8D6',
  // Yardımcı — Pantone 1365 C
  orange: '#F0B040',
  orangeDark: '#D99420',
  orangeSoft: '#FFF4E0',
  // Yardımcı — Pantone 432 C
  slate: '#3D596A',
  // Yardımcı — Pantone 2287 C
  open: '#60B040',
  openBg: '#EAF6E4',
  // Yardımcı — Pantone 2146 C
  blue: '#203080',
  blueSoft: '#E8EAF4',
  // Nötr
  ink: '#161616',
  muted: '#7A7A7A',
  line: '#ECECEC',
  bg: '#F6F6F7',
  card: '#FFFFFF',
  // Uyarı (turuncu soft)
  busy: '#D99420',
  busyBg: '#FFF4E0',
}

export const darkPalette = {
  ...palette,
  ink: '#F5F5F7',
  muted: '#9A9AA3',
  line: '#26262F',
  bg: '#0A0A0F',
  card: '#15151D',
  redSoft: '#2A1418',
  yellowSoft: '#2A2410',
  orangeSoft: '#2A1E0A',
  openBg: '#0F2A1A',
  blueSoft: '#141828',
  busyBg: '#2A1E0A',
}

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 }
export const radiusSm = radius.sm
export const radiusLg = radius.lg
export const radiusPill = radius.pill

export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

export const shadow = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  float: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
}

export const cardStyle = {
  backgroundColor: palette.card,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: palette.line,
}

// Legacy export — preserved for the rest of the app that still imports `colors` directly.
export const colors = palette

export const accentBar = {
  borderLeftWidth: 3,
  borderLeftColor: palette.red,
}

// Build a runtime theme using the active palette.
// Use: const theme = useTheme(); const colors = theme.colors;
export const buildTheme = (mode = 'light') => {
  const c = mode === 'dark' ? darkPalette : palette
  return {
    mode,
    colors: c,
    radius,
    space,
    shadow,
    cardStyle: {
      backgroundColor: c.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.line,
    },
    accentBar: {
      borderLeftWidth: 3,
      borderLeftColor: c.red,
    },
  }
}
