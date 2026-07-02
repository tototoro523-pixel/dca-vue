import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  //vite개발서버 프록시
  //브라우저가 opendart에 직접요청하지않고 vite개발서버를 통해서 요청
  server: {
    proxy:{
      '/dart-api': {
        target: 'https://opendart.fss.or.kr',
        changeOrigin: true,
        secure: true,

        // dart-api부분을 /api로 변경합니다.
        rewrite:(path) => path.replace(/^\/dart-api/, '/api'),
      },
      },
    },
})
