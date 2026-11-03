import * as THREE from 'three'
import gsap from 'gsap'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { KM_PER_UNIT, PLATE, PROVINCES, TARGET_PROVINCE, provinceShapes, ringSegments, unproject } from './geo'
import { createPlate } from './engraving'

const DEG = Math.PI / 180
/** İl kalınlığı (harita birimi) */
const DEPTH = 0.14
/** Varışta Tekirdağ'ın kaç kat yükseleceği */
const TEK_RISE = 3.2

const C = {
  bg: new THREE.Color(0x0a0c0f),
  ground: new THREE.Color(0x0d1015),
  grid: new THREE.Color(0x1c232c),
  cap: new THREE.Color(0x1b2028),
  capDim: new THREE.Color(0x101318),
  side: new THREE.Color(0x0e1115),
  sideDim: new THREE.Color(0x0a0c0f),
  line: new THREE.Color(0x4a5664),
  blueprint: new THREE.Color(0x8796a6),
  heat: new THREE.Color(0xff3a1c), // Tekirdağ'ın kızıl ısısı
  tekCap: new THREE.Color(0x5a1608),
  tekLine: new THREE.Color(0xff9c80),
}

/** Kamera, hedef nokta etrafında küresel koordinatlarla tanımlanır; tüm hareket GSAP ile bu değerlere uygulanır. */
export type CameraRig = {
  tx: number; ty: number; tz: number
  dist: number
  elev: number // derece, yatay düzlemden
  azim: number // derece, 0 = güneyden kuzeye bakış
}

/** Zaman çizelgesinin canlandırdığı skaler efektler (0..1). */
type Fx = {
  draw: number // sınır çiziminin ilerleyişi
  blueprint: number // çizim katmanının opaklığı
  lines: number // il üst kenar çizgileri
  dim: number // diğer illerin kararması
  glow: number // Tekirdağ'ın kızarması
}

export class IntroScene {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 300)
  readonly renderer: THREE.WebGLRenderer
  readonly cam: CameraRig = { tx: 1.6, ty: 0, tz: -0.2, dist: 24, elev: 64, azim: -14 }
  readonly fx: Fx = { draw: 0, blueprint: 0, lines: 0, dim: 0, glow: 0 }
  onFrame: (() => void) | null = null

  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private fog = new THREE.Fog(C.bg, 10, 60)
  private map = new THREE.Group()
  private provinces: THREE.Group[] = []
  private tek!: THREE.Group
  private blueprint!: THREE.LineSegments
  private blueprintVerts = 0
  private plate: ReturnType<typeof createPlate>
  /** Yazı plakasının merkezi (dünya, y=0) — kameranın varış hedefi */
  private focus = new THREE.Vector3(PLATE.x, 0, -PLATE.y)
  private width = 1
  private height = 1
  private v = new THREE.Vector3()

  private mats = {
    cap: new THREE.MeshStandardMaterial({
      color: C.cap, roughness: 0.78, metalness: 0.3,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    }),
    side: new THREE.MeshStandardMaterial({ color: C.side, roughness: 0.9, metalness: 0.2 }),
    line: new THREE.LineBasicMaterial({ color: C.line, transparent: true, opacity: 0 }),
    blueprint: new THREE.LineBasicMaterial({ color: C.blueprint, transparent: true, opacity: 0 }),
    tekCap: new THREE.MeshStandardMaterial({
      color: C.cap.clone(), emissive: C.heat, emissiveIntensity: 0, roughness: 0.42, metalness: 0.45,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    }),
    tekSide: new THREE.MeshStandardMaterial({
      color: C.side.clone(), emissive: C.heat, emissiveIntensity: 0, roughness: 0.5, metalness: 0.3,
    }),
    tekLine: new THREE.LineBasicMaterial({ color: C.line.clone(), transparent: true, opacity: 0 }),
  }

  constructor(canvas: HTMLCanvasElement) {
    // WebGL yoksa burada hata fırlatır; çağıran taraf girişi atlar.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.toneMapping = THREE.NeutralToneMapping

    this.scene.background = C.bg
    this.scene.fog = this.fog

    // MSAA'lı render hedefi: ince sınır çizgileri pürüzsüz kalsın.
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
    this.composer = new EffectComposer(this.renderer, rt)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    // Yüksek eşik: yalnızca lazer cephesi parlar, yüzeyler değil.
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.4, 0.78)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())

    this.plate = createPlate(PLATE.maxWidth * 0.9, this.renderer.capabilities.getMaxAnisotropy())

    this.build()
    this.resize()
    window.addEventListener('resize', this.resize)
    gsap.ticker.add(this.tick)
  }

  /* ------------------------------------------------------------------ sahne */

  private build() {
    const { scene, map, mats: m } = this

    scene.add(new THREE.HemisphereLight(0xc4d4e4, 0x050607, 1.0))
    const key = new THREE.DirectionalLight(0xffffff, 2.4)
    key.position.set(-6, 14, 9)
    const rim = new THREE.DirectionalLight(0x7a9cc0, 0.9)
    rim.position.set(10, 5, -12)
    scene.add(key, rim)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshStandardMaterial({ color: C.ground, roughness: 1, metalness: 0 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.006
    const grid = new THREE.GridHelper(160, 320, C.grid, C.grid)
    const gm = grid.material as THREE.LineBasicMaterial
    gm.transparent = true
    gm.opacity = 0.55
    gm.depthWrite = false
    grid.position.y = -0.003
    scene.add(ground, grid)

    // Harita XY düzleminde kurulur, -90° döndürülerek yere yatırılır: yerel z = dünya yukarı.
    map.rotation.x = -Math.PI / 2
    scene.add(map)

    const bp: number[] = []
    for (const pr of PROVINCES) {
      const isTek = pr.n === TARGET_PROVINCE
      const geo = new THREE.ExtrudeGeometry(provinceShapes(pr), {
        depth: DEPTH, bevelEnabled: false, curveSegments: 1, steps: 1,
      })
      const mesh = new THREE.Mesh(geo, isTek ? [m.tekCap, m.tekSide] : [m.cap, m.side])
      const lg = new THREE.BufferGeometry()
      lg.setAttribute('position', new THREE.Float32BufferAttribute(ringSegments(pr, DEPTH + 0.0015), 3))
      const lines = new THREE.LineSegments(lg, isTek ? m.tekLine : m.line)

      const group = new THREE.Group()
      group.add(mesh, lines)
      group.scale.z = 0.0001 // düz başlar, zaman çizelgesinde yükselir
      map.add(group)
      this.provinces.push(group)
      if (isTek) this.tek = group

      ringSegments(pr, 0.002, bp)
    }

    // Yazı plakası Tekirdağ grubunun çocuğudur: il yükseldikçe üst yüzeyle birlikte yükselir.
    const plate = this.plate.mesh
    plate.position.set(PLATE.x, PLATE.y, DEPTH + 0.003)
    plate.rotation.z = PLATE.angleDeg * DEG
    this.tek.add(plate)

    // "Çizim" katmanı: tüm sınırlar tek geometride; drawRange ile takım yolu gibi çizilir.
    const bg = new THREE.BufferGeometry()
    bg.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3))
    this.blueprintVerts = bp.length / 3
    bg.setDrawRange(0, 0)
    this.blueprint = new THREE.LineSegments(bg, m.blueprint)
    map.add(this.blueprint)
  }

  /* ---------------------------------------------------------- zaman çizelgesi */

  /** 3D sahnenin tüm hareketlerini verilen zaman çizelgesine ekler ve etiketleri tanımlar. */
  addTo(tl: gsap.core.Timeline) {
    const { fx, cam } = this
    const u = this.plate.uniforms
    const { x: tx, z: tz } = this.focus

    tl.addLabel('draw', 0.2)
      .addLabel('rise', 1.2)
      .addLabel('fly', 1.3)
      .addLabel('arrive', 4.7)
      .addLabel('engrave', 5.6)
      .addLabel('settle', 6.4)
      .addLabel('reveal', 8.8) // kazıma 7.45'te biter; yazı haritada ~1.3 sn okunur kalır

    // 1 — Çizim: sınırlar doğudan batıya çizilir
    tl.to(fx, { blueprint: 1, duration: 0.4, ease: 'none' }, 'draw')
    tl.to(fx, { draw: 1, duration: 1.5, ease: 'power1.inOut' }, 'draw')

    // 2 — Üretim: iller sırayla yükselir, çizim katmanı üst kenarlara devreder
    tl.to(this.provinces.map((g) => g.scale), { z: 1, duration: 1, ease: 'power3.out', stagger: 0.016 }, 'rise')
    tl.to(fx, { lines: 1, duration: 1.2, ease: 'power1.out' }, 'rise+=0.3')
    tl.to(fx, { blueprint: 0, duration: 1.2, ease: 'power1.in' }, 'rise+=1')

    // 3 — Uçuş: farklı süre ve yumuşatmalar kavisli, organik bir rota üretir
    tl.to(cam, { tx, tz, duration: 4.8, ease: 'power3.inOut' }, 'fly')
    tl.to(cam, { dist: 3.4, duration: 4.9, ease: 'power3.inOut' }, 'fly+=0.1')
    tl.to(cam, { elev: 44, duration: 5.0, ease: 'sine.inOut' }, 'fly')
    tl.to(cam, { azim: 3, duration: 5.1, ease: 'power2.inOut' }, 'fly')

    // 4 — Varış: diğer iller geri çekilir, Tekirdağ yükselir ve kızarır
    tl.to(fx, { dim: 1, duration: 1.2, ease: 'power2.inOut' }, 'arrive')
    tl.to(this.tek.scale, { z: TEK_RISE, duration: 1.4, ease: 'expo.out' }, 'arrive+=0.2')
    tl.to(cam, { ty: DEPTH * TEK_RISE, duration: 1.4, ease: 'power2.out' }, 'arrive+=0.2')
    tl.to(fx, { glow: 1, duration: 1.1, ease: 'power2.out' }, 'arrive+=0.25')

    // 5 — Lazer kazıma: önce silik yerleşim, sonra başlık, ardından alt satır
    tl.to(u.uGhost, { value: 1, duration: 0.5, ease: 'power1.out' }, 'engrave-=0.4')
    tl.to(u.uA, { value: 1, duration: 1.3, ease: 'power1.inOut' }, 'engrave')
    tl.to(u.uB, { value: 1, duration: 0.8, ease: 'power1.inOut' }, 'engrave+=1.05')
    tl.to(u.uCool, { value: 1, duration: 0.9, ease: 'power2.out' }, 'engrave+=1.5')

    // 6 — Yerleşme: yazıya dik bakacak şekilde yükselir ve yaklaşır; geçiş bu hareketin içinde başlar
    tl.to(cam, { dist: 2.35, elev: 55, azim: PLATE.angleDeg - 4, duration: 3.8, ease: 'power1.inOut' }, 'settle')
  }

  /* ------------------------------------------------------------- yardımcılar */

  /** Yazı tiplerini bekler, plakayı çizer, shader'ları derler; animasyon takılmadan başlasın diye. */
  async warmup() {
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('700 100px Archivo', 'TEKİRDAĞ'),
          document.fonts.load('500 40px "IBM Plex Mono"', 'ÇORLU'),
        ]).then(() => document.fonts.ready)
      : Promise.resolve()
    await Promise.race([fonts, new Promise((r) => setTimeout(r, 2000))])
    this.plate.draw()
    await this.renderer.compileAsync(this.scene, this.camera)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  }

  /** Yazı plakası merkezinin (Tekirdağ'ın o anki üst yüzeyinde) ekran koordinatı */
  focusOnScreen() {
    const p = this.v.set(this.focus.x, DEPTH * this.tek.scale.z, this.focus.z).project(this.camera)
    return { x: (p.x * 0.5 + 0.5) * this.width, y: (-p.y * 0.5 + 0.5) * this.height }
  }

  /** Ekran merkezindeki (kameranın baktığı) noktanın boylam/enlemi */
  targetLonLat() {
    return unproject(this.cam.tx, -this.cam.tz)
  }

  altitudeKm() {
    return this.camera.position.y * KM_PER_UNIT
  }

  /* ----------------------------------------------------------------- döngü */

  private tick = () => {
    this.update()
    this.composer.render()
    this.onFrame?.()
  }

  private update() {
    const { fx, mats: m } = this

    this.blueprint.geometry.setDrawRange(0, Math.floor((fx.draw * this.blueprintVerts) / 2) * 2)
    m.blueprint.opacity = fx.blueprint

    m.line.opacity = fx.lines * (1 - 0.55 * fx.dim)
    m.cap.color.lerpColors(C.cap, C.capDim, fx.dim)
    m.side.color.lerpColors(C.side, C.sideDim, fx.dim)

    // Tekirdağ: yüzey derin kızıl, yan yüzler daha sıcak; yazının okunması için yüzey koyu kalır.
    m.tekCap.color.lerpColors(C.cap, C.tekCap, fx.glow)
    m.tekSide.color.lerpColors(C.side, C.tekCap, fx.glow)
    m.tekCap.emissiveIntensity = 0.2 * fx.glow
    m.tekSide.emissiveIntensity = 0.7 * fx.glow
    m.tekLine.color.lerpColors(C.line, C.tekLine, fx.glow)
    m.tekLine.opacity = Math.max(fx.lines, fx.glow)

    this.applyCamera()
  }

  private applyCamera() {
    const c = this.cam
    // Dar (dikey) ekranlarda kamerayı uzaklaştır. 1.35: Türkiye (≈19 birim) dikey telefonda
    // ekran genişliğinin ~%90'ını doldurur. Yakın planda yazı ekrana sığacak kadar uzaklaşır.
    const fitWide = THREE.MathUtils.clamp(1.35 / (this.width / this.height), 1, 3)
    const wide = THREE.MathUtils.clamp((c.dist - 4) / 18, 0, 1)
    const d = c.dist * THREE.MathUtils.lerp(Math.min(fitWide, 2), fitWide, wide)

    const el = c.elev * DEG
    const az = c.azim * DEG
    this.camera.position.set(
      c.tx + Math.sin(az) * Math.cos(el) * d,
      c.ty + Math.sin(el) * d,
      c.tz + Math.cos(az) * Math.cos(el) * d,
    )
    this.camera.lookAt(c.tx, c.ty, c.tz)
    this.fog.near = d * 0.8
    this.fog.far = d * 2.6
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.width = w
    this.height = h
    const dpr = Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 2)
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.composer.setPixelRatio(dpr)
    this.composer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    gsap.ticker.remove(this.tick)
    window.removeEventListener('resize', this.resize)
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
      const mat = mesh.material
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else mat?.dispose()
    })
    this.plate.uniforms.tMask.value.dispose()
    this.bloom.dispose()
    this.composer.dispose()
    this.renderer.dispose()
  }
}
