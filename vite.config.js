import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/feishu-rust-playground/',
  plugins: [vue()],
  server: {
    proxy: {
      '/execute': {
        target: 'https://play.rust-lang.org',
        changeOrigin: true
      },
      '/format': {
        target: 'https://play.rust-lang.org',
        changeOrigin: true
      },
      '/clippy': {
        target: 'https://play.rust-lang.org',
        changeOrigin: true
      }
    }
  }
})
