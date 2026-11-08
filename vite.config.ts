import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * PDF katalogların gerçek dosya boyutları: `import sizes from 'virtual:catalog-sizes'` → { 'mitsubishi-tornalama': bayt, … }.
 * Boyut elle yazılmaz; public/kataloglar/ içindeki dosyadan okunur (dosya değişince boyut da kendiliğinden güncellenir).
 * Geliştirme sunucusunda PDF eklenip çıkarılınca sayfa yeniden yüklenir.
 */
function catalogSizes(): Plugin {
  const id = 'virtual:catalog-sizes'
  const dir = fileURLToPath(new URL('./public/kataloglar/', import.meta.url))
  const read = () =>
    Object.fromEntries(
      readdirSync(dir)
        .filter((f) => f.endsWith('.pdf'))
        .map((f) => [f.slice(0, -4), statSync(dir + f).size]),
    )
  return {
    name: 'catalog-sizes',
    resolveId: (source) => (source === id ? '\0' + id : undefined),
    load: (resolved) => (resolved === '\0' + id ? `export default ${JSON.stringify(read())}` : undefined),
    configureServer(server) {
      const refresh = (file: string) => {
        if (!file.replace(/\\/g, '/').includes('/public/kataloglar/') || !file.endsWith('.pdf')) return
        const mod = server.moduleGraph.getModuleById('\0' + id)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(dir)
      server.watcher.on('add', refresh).on('unlink', refresh).on('change', refresh)
    },
  }
}

/**
 * 3D giriş ayrı parça olarak yüklenir. Anasayfada bu parça, ana paket bitmeden
 * paralel inmeye başlasın diye yalnızca girişin oynayacağı anasayfa açılışında modulepreload eklenir.
 */
function preloadIntro(): Plugin {
  return {
    name: 'preload-intro',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const chunk = Object.values(ctx.bundle ?? {}).find((c) => c.type === 'chunk' && c.name === 'Intro')
        if (!chunk) return html
        // window.__ftIntro: index.html'deki ilk betik belirler (anasayfa + hareket azaltma kapalı)
        const script =
          `<script>if(window.__ftIntro){` +
          `var l=document.createElement('link');l.rel='modulepreload';l.href='/${chunk.fileName}';document.head.appendChild(l)}</script>`
        return html.replace('</head>', `    ${script}\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadIntro(), catalogSizes()],
  build: {
    // Giriş parçası (Three.js) bilinçli olarak büyük; yalnızca anasayfada iner.
    chunkSizeWarningLimit: 800,
  },
  // Ön-render derlemesi (src/entry-server.tsx → dist-ssr, bkz. scripts/prerender.mjs):
  // tüm paketler tek dosyaya alınır; Node'un paket çözümlemesine (gsap/motion alt yolları) takılmasın.
  ssr: {
    noExternal: true,
  },
})
