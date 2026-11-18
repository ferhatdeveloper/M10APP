import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Cloudflare quick tunnel / arbitrary preview hosts
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.web.jsx', '.web.js', '.web.tsx', '.web.ts', '.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: [
      { find: /^react-native$/, replacement: 'react-native-web' },
      { find: /^react-native\/(.*)/, replacement: 'react-native-web/$1' },
      // lucide-react-native pulls bare "react-native" peers; use web package on Vite
      { find: /^lucide-react-native$/, replacement: 'lucide-react' },
      { find: /^lucide-react-native\/(.*)/, replacement: 'lucide-react/$1' },
      { find: /^expo-modules-core(.*)/, replacement: path.resolve(__dirname, 'src/polyfills/expo-mock.js') },
      { find: /^expo-network(.*)/, replacement: path.resolve(__dirname, 'src/polyfills/expo-mock.js') },
      { find: /^expo\/(.*)/, replacement: path.resolve(__dirname, 'src/polyfills/expo-mock.js') },
      { find: /^expo$/, replacement: path.resolve(__dirname, 'src/polyfills/expo-mock.js') },
      { find: /^@react-native-async-storage\/async-storage/, replacement: path.resolve(__dirname, 'src/polyfills/async-storage.js') },
      { find: /react-native-svg/, replacement: path.resolve(__dirname, 'src/polyfills/react-native-svg.jsx') },
      { find: /react-native-safe-area-context/, replacement: path.resolve(__dirname, 'src/polyfills/safe-area-context.jsx') },
      { find: '@context', replacement: path.resolve(__dirname, 'src/context') },
      { find: /\/data\/mock\.js$/, replacement: path.resolve(__dirname, 'src/data/mock.web.js') },
      { find: '../data/mock.js', replacement: path.resolve(__dirname, 'src/data/mock.web.js') },
      { find: './mock.js', replacement: path.resolve(__dirname, 'src/data/mock.web.js') },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
})
