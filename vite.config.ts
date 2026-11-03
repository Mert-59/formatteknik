import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * 3D giriş ayrı parça olarak yüklenir. Anasayfada bu parça, ana paket bitmeden
 * paralel inmeye başlasın diye yalnızca "/" adresinde modulepreload eklenir.
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
        const script =
          `<script>if(location.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){` +
          `var l=document.createElement('link');l.rel='modulepreload';l.href='/${chunk.fileName}';document.head.appendChild(l)}</script>`
        return html.replace('</head>', `    ${script}\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadIntro()],
  build: {
    // Giriş parçası (Three.js) bilinçli olarak büyük; yalnızca anasayfada iner.
    chunkSizeWarningLimit: 800,
  },
})
