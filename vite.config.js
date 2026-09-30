import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { LANDINGS } from './scripts/landings.mjs'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

function staticLandings() {
  return {
    name: 'static-landings',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0])
        const landing = LANDINGS.find(l => url === `/${l.route}` || url.startsWith(`/${l.route}/`))
        if (!landing) return next()

        if (url === `/${landing.route}`) {
          res.statusCode = 301
          res.setHeader('Location', `/${landing.route}/`)
          return res.end()
        }

        const base = path.resolve(landing.dir)
        const rel = url.slice(landing.route.length + 2) || 'index.html'
        const file = path.resolve(base, rel)
        if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next()

        res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), staticLandings()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
