import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      // 代理音频文件请求
      '/song': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        secure: false
      },
      // 代理图片文件请求
      '/img': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        secure: false
      },
      // 代理头像图片请求
      '/avatorImages': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
