import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr({ svgrOptions: { icons: true } })],
    resolve: {
        alias: {
          "@": path.resolve(__dirname, "src/"),
        },
      },
    server: {
        proxy: {
            '/api': 'http://localhost:3001'
        }
    },
    build: {
        outDir: '../server/frontend',
        emptyOutDir: true,
    }
})
