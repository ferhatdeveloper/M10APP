// Web polyfill for react-native-safe-area-context
import React from 'react'

export const SafeAreaProvider = ({ children }) => <div style={{ display: 'flex', flex: 1 }}>{children}</div>

export const SafeAreaView = ({ children, style, ...props }) => (
  <div style={{ ...style }} {...props}>{children}</div>
)

export const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 })

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
})

export const SafeAreaInsetsContext = React.createContext({ top: 0, right: 0, bottom: 0, left: 0 })

export default { SafeAreaProvider, SafeAreaView, useSafeAreaInsets }
