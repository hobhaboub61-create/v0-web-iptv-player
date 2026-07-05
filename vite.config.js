import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Allow all hosts - the preview host (sb-*.vercel.run) changes on every sandbox restart
    allowedHosts: true,
    proxy: {
      '/translate': {
        target: 'http://fanyi.youdao.com/translate',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/translate/, '')
      }
    }
  },
})
