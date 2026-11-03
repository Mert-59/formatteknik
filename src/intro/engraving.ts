import * as THREE from 'three'

/**
 * Tekirdağ yüzeyine lazerle kazınan yazı plakası.
 *
 * Yazı bir canvas'a maske olarak çizilir (R kanalı: başlık, G kanalı: alt satır) ve
 * ilin üst yüzeyine yapışık bir düzleme uygulanır. Shader, soldan sağa ilerleyen bir
 * lazer cephesi simüle eder: cephe beyaz-sıcak, geride kalan iz akkordan çeliğe soğur.
 */

/** Plakanın en/boy oranı — geo.ts'deki yerleşim bu orana göre hesaplandı. */
export const PLATE_ASPECT = 4.2

const TITLE = 'TEKİRDAĞ'
const CITY = 'ÇORLU'
const BRAND = 'FORMAT TEKNİK'
const W = 2048
const H = Math.round(W / PLATE_ASPECT)

export function drawPlateMask(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'
  const pad = W * 0.02

  // Başlık — Archivo Expanded Bold, mürekkep genişliği plakaya tam oturur
  ctx.fontStretch = 'expanded'
  ctx.letterSpacing = '0px'
  const fontA = (s: number) => `700 ${s}px Archivo, "Arial Black", sans-serif`
  ctx.font = fontA(200)
  let m = ctx.measureText(TITLE)
  let size = (200 * (W - pad * 2)) / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)
  ctx.font = fontA(size)
  m = ctx.measureText(TITLE)
  // İ noktası ve Ğ şapkası dahil yükseklik plakanın %56'sını geçmesin (alt satıra yer kalsın)
  const maxAscent = H * 0.56
  if (m.actualBoundingBoxAscent > maxAscent) {
    size *= maxAscent / m.actualBoundingBoxAscent
    ctx.font = fontA(size)
    m = ctx.measureText(TITLE)
  }
  const baseA = pad + m.actualBoundingBoxAscent
  ctx.fillStyle = '#f00'
  ctx.fillText(TITLE, pad + m.actualBoundingBoxLeft, baseA)

  // Alt satır, birincil (G kanalı): ÇORLU — başlıkla aynı aile, belirgin
  const citySize = H * 0.15
  ctx.letterSpacing = `${citySize * 0.06}px`
  ctx.font = fontA(citySize)
  const mc = ctx.measureText(CITY)
  const baseB = baseA + H * 0.09 + mc.actualBoundingBoxAscent
  ctx.fillStyle = '#0f0'
  ctx.fillText(CITY, pad + mc.actualBoundingBoxLeft, baseB)
  const cityRight = pad + mc.actualBoundingBoxLeft + mc.actualBoundingBoxRight
  const capMid = baseB - mc.actualBoundingBoxAscent / 2

  // Alt satır, ikincil (B kanalı): ayraç + FORMAT TEKNİK (mono) + teknik çizim çizgisi
  const brandSize = H * 0.105
  const stroke = Math.max(2, brandSize * 0.07)
  ctx.fillStyle = '#00f'
  const dashX = cityRight + citySize * 0.38
  const dashW = citySize * 0.42
  ctx.fillRect(dashX, capMid - stroke / 2, dashW, stroke)
  ctx.fontStretch = 'normal'
  ctx.letterSpacing = `${brandSize * 0.24}px`
  ctx.font = `500 ${brandSize}px "IBM Plex Mono", ui-monospace, monospace`
  const mb = ctx.measureText(BRAND)
  const brandX = dashX + dashW + citySize * 0.38
  // Mono büyük harflerin dikey ortası ÇORLU'nun ortasıyla hizalanır
  const brandBase = capMid + mb.actualBoundingBoxAscent / 2
  ctx.fillText(BRAND, brandX, brandBase)
  const ruleX = brandX + mb.width + brandSize * 0.5
  if (ruleX < W - pad) ctx.fillRect(ruleX, capMid - stroke / 2, W - pad - ruleX, stroke)
}

export function createPlate(width: number, anisotropy: number) {
  // Boyut baştan sabit: GPU dokusu bir kez ayrılır; sonradan boyut değişirse yeniden yüklenemez
  // ve maske boş kalır. İçerik yazı tipleri yüklenince aynı boyutta yeniden çizilir.
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.anisotropy = anisotropy // yüzeye eğik bakıldığında harfler keskin kalsın

  const uniforms = {
    tMask: { value: texture },
    uGhost: { value: 0 }, // kazımadan önce beliren silik yerleşim
    uA: { value: 0 }, // başlık kazıma ilerleyişi
    uB: { value: 0 }, // alt satır kazıma ilerleyişi
    uCool: { value: 0 }, // son soğuma
    uFade: { value: 1 },
    uInk: { value: new THREE.Color(0xd9dde3) }, // soğumuş çelik
    uHot: { value: new THREE.Color(1, 0.74, 0.46).multiplyScalar(4) }, // lazer cephesi (bloom tetikler)
    uGhostCol: { value: new THREE.Color(0xffb59a) },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tMask;
      uniform float uGhost, uA, uB, uCool, uFade;
      uniform vec3 uInk, uHot, uGhostCol;
      varying vec2 vUv;

      vec4 burn(float mask, float prog, float x) {
        float front = mix(-0.04, 1.04, prog);
        float done = 1.0 - smoothstep(front - 0.003, front + 0.003, x);
        float dist = max(front - x, 0.0);               // negatif üs yok → NaN yok
        float heat = done * exp(-dist / 0.045) * (1.0 - uCool);
        vec3 col = mix(uGhostCol, mix(uInk, uHot, heat), done);
        return vec4(col, mask * max(done, uGhost * 0.16));
      }

      void main() {
        vec3 m = texture2D(tMask, vUv).rgb;              // R: başlık, G: ÇORLU, B: marka satırı
        float x = vUv.x + (vUv.y - 0.5) * 0.05;          // hafif eğimli cephe
        vec4 a = burn(m.r, uA, x);
        vec4 b = burn(m.g, uB, x);
        vec4 c = burn(m.b, uB, x);
        c.a *= 0.85;                                     // ikincil satır bir ton geride
        float alpha = max(max(a.a, b.a), c.a);
        vec3 col = (a.rgb * a.a + b.rgb * b.a + c.rgb * c.a) / max(a.a + b.a + c.a, 1e-4);
        gl_FragColor = vec4(col, alpha * uFade);
      }`,
  })

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / PLATE_ASPECT), material)
  mesh.renderOrder = 2

  return {
    mesh,
    uniforms,
    /** Yazı tipleri yüklendikten sonra çağrılır. */
    draw() {
      drawPlateMask(canvas)
      texture.needsUpdate = true
    },
  }
}
