import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy: {
      '/test': {
        target: 'https://www.baidu.com',
        secure: false,
        rewrite: (path) => path.replace(/^\/test/, '')
      },
      '/solitaireApi':{
        target: 'http://127.0.0.1:9123',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/solitaireApi/, ''),
      },
      "/solitaireApi-ws":{
        target: 'ws://127.0.0.1:9123',
        changeOrigin: true,
        ws:true,
        rewrite: (path) => path.replace(/^\/solitaireApi-ws/, ''),
        logLevel: "debug",
        // Add this:
        onError(err) {
          console.log('Suppressing WDS proxy upgrade error:', err);
        },
      }
    }
  },
  resolve:{
    extensions: ['.js', 'vue', '.json'],
    alias:{
      '@':path.resolve('src'),
      'src': path.resolve('src')
    }
  }
})


