export const colors = {
  red: '#E31E24',
  redDark: '#C4181E',
  redDeep: '#9E1218',
  redSoft: '#FDECEE',
  yellow: '#FFF200',
  yellowDark: '#E6D600',
  ink: '#161616',
  muted: '#7A7A7A',
  line: '#ECECEC',
  bg: '#F6F6F7',
  card: '#FFFFFF',
  open: '#12803C',
  openBg: '#E8F8EE',
  busy: '#B86A00',
  busyBg: '#FFF4E0',
}

export const radius = 16
export const radiusSm = 12
export const radiusLg = 20
export const radiusPill = 999

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
}

export const shadow = {
  soft: {
    shadowColor: '#161616',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  card: {
    shadowColor: '#161616',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  float: {
    shadowColor: '#161616',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
}

export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: radius,
  borderWidth: 1,
  borderColor: colors.line,
}

export const accentBar = {
  borderLeftWidth: 3,
  borderLeftColor: colors.red,
}
