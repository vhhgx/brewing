import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// const apiBaseUrl = import.meta.env.VITE_BASE_API

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/pre/main.scss";'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      views: path.resolve(__dirname, './src/views')
    }
  },
  server: {
    port: 5173
    // proxy: {
    //   '/api': {
    //     target: apiBaseUrl,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
    //   },
    // },
  }
})
