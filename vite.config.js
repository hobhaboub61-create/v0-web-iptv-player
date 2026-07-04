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
    allowedHosts: [
      'sb-73kf0akev2cw.vercel.run',
      'sb-58z6wv0pkynv.vercel.run',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/translate': {
        target: 'http://fanyi.youdao.com/translate',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/translate/, '')
      }
    }
  },
})
