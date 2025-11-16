import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or @vitejs/plugin-react-swc
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  base: mode === 'production' ? '/sem-risco/' : '/',

  plugins: [react()],

  server: {
    host: "::",
    port: 8080,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))