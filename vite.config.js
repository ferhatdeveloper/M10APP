import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    exclude: [
      'react-native',
      'expo',
      '@expo/metro-runtime',
      'expo-modules-core',
      'expo-status-bar',
      'expo-constants',
      'expo-font',
      'expo-linking',
      'expo-splash-screen',
      'expo-router',
      '@react-native-async-storage/async-storage',
      '@react-navigation/native',
      '@react-navigation/native-stack',
      '@react-navigation/bottom-tabs',
    ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  build: {
    rollupOptions: {
      external: [
        /^react-native/,
        /^expo/,
        /^@expo/,
        /^@react-native/,
        /^@react-navigation/,
      ],
    },
  },
})
