/**
 * Yönlendirmeler — TEK KAYNAK: proje kökündeki vercel.json → "redirects".
 *
 * Vercel bu listeyi doğrudan okur. Diğer barındırıcılar için derlemede (scripts/prerender.mjs) aynı listeden
 * üretilir: dist/.htaccess (Apache / cPanel) ve dist/_redirects (Netlify). `npm run preview` da aynı listeyi uygular.
 * Yeni yönlendirme eklemek için yalnızca vercel.json'a bir satır ekleyin; elle .htaccess yazmayın.
 *
 * Desteklenen kaynak (source) yazımları — üç barındırıcıda da aynı çalışsın diye bilinçli olarak sınırlı:
 *   /tr/kategori-kilavuz/59     birebir adres
 *   /tr/:page/:id               :ad → tek bir adres parçası (bölü içermez); TAM parça olmalı ("kategori-:x" olmaz)
 *   /tr/:path*                  :ad* → sondaki tüm parçalar (hiç parça yoksa /tr'yi de kapsar); yalnızca en sonda
 * Hedefte (destination) aynı adlar kullanılabilir: /yeni/:path*
 * Sıra önemlidir: ilk eşleşen kural uygulanır — özel kurallar üstte, genel ("yakalayıcı") kurallar en altta.
 *
 * `has` içeren kurallar (alan adı yönlendirmesi: formatteknik.com.tr, formatteknik.com, www.formatteknik.com →
 * www.formatteknik.com.tr) yalnızca Vercel'e özeldir; Apache ve Netlify karşılığı aşağıda hostRules* işlevlerinde
 * aynı alan adı listesinden (hostAliases) üretilir. Yeni bir alan adı için vercel.json'a aynı biçimde bir satır yeterli.
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** vercel.json'daki yönlendirmeler: { path: [...], host: [...] } — path kuralları derlenmiş hâlde */
export async function loadRedirects(root) {
  const config = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'))
  const all = config.redirects ?? []
  const path = all.filter((r) => !r.has).map(compile)
  const host = all.filter((r) => r.has)
  return { path, host }
}

/** Kaynak adresi parçalarına ayırır ve düzenli ifadeye çevirir. Desteklenmeyen yazımda hata verir. */
function compile(rule) {
  const { source, destination } = rule
  if (!source.startsWith('/')) throw new Error(`[redirects] "${source}": kaynak / ile başlamalı`)
  const segs = source.split('/').slice(1)
  const names = []
  // Her parça iki biçimde: tarayıcı adresi (başında /) ve .htaccess (ilk parçanın başında / olmaz)
  const js = []
  const apache = []
  segs.forEach((seg, i) => {
    const rest = seg.match(/^:(\w+)\*$/)
    const one = seg.match(/^:(\w+)$/)
    const first = i === 0
    if (rest) {
      if (i !== segs.length - 1) throw new Error(`[redirects] "${source}": ":${rest[1]}*" yalnızca en sonda olabilir`)
      names.push({ name: rest[1], rest: true })
      js.push('(?:/(.*?))?')
      apache.push(first ? '(.*?)' : '(?:/(.*?))?')
    } else if (one) {
      names.push({ name: one[1], rest: false })
      js.push('/([^/]+)')
      apache.push(first ? '([^/]+)' : '/([^/]+)')
    } else if (/[:*()]/.test(seg)) {
      throw new Error(`[redirects] "${source}": parça içinde değişken desteklenmez (yalnızca tam parça: /:ad ya da /:ad*)`)
    } else {
      const lit = seg.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      js.push('/' + lit)
      apache.push(first ? lit : '/' + lit)
    }
  })
  // sondaki / isteğe bağlı (Vercel de /tr/urunler/ adresini /tr/urunler kuralıyla eşler)
  const regex = new RegExp(`^${js.join('')}/?$`)
  const apacheRegex = `^${apache.join('')}/?$`
  for (const m of destination.matchAll(/:(\w+)\*?/g)) {
    if (!names.some((n) => n.name === m[1])) throw new Error(`[redirects] "${source}": hedefteki ":${m[1]}" kaynakta yok`)
  }
  return { ...rule, regex, apacheRegex, names, generic: names.length > 0 }
}

/** Adres bir kurala uyuyorsa { rule, location } döner; uymuyorsa null. */
export function matchRedirect(rules, pathname) {
  for (const rule of rules) {
    const m = pathname.match(rule.regex)
    if (!m) continue
    let location = rule.destination
    rule.names.forEach((n, i) => {
      const value = m[i + 1] ?? ''
      location = location.replace(new RegExp(`:${n.name}\\*?`), value)
    })
    return { rule, location: location.replace(/\/{2,}/g, '/').replace(/(.)\/$/, '$1') }
  }
  return null
}

/* ------------------------------------------------------------ Apache (.htaccess) */

/** vercel.json alan adı kurallarının kaynak alan adları: ['formatteknik.com.tr', 'formatteknik.com', 'www.formatteknik.com'] */
export function hostAliases(hostRules) {
  return hostRules.map((r) => {
    const h = r.has.find((x) => x.type === 'host')
    if (!h || r.has.length !== 1 || r.source !== '/:path*' || !r.destination.endsWith('/:path*')) {
      throw new Error(`[redirects] alan adı kuralı { source: "/:path*", has: [{ type: "host", … }], destination: "https://…/:path*" } biçiminde olmalı: ${JSON.stringify(r)}`)
    }
    return h.value
  })
}

/** Alan adı + https kuralı: diğer alan adları (aliases) → https://www.formatteknik.com.tr (siteUrl SITE.url'dir) */
export function hostRulesApache(siteUrl, aliases) {
  const host = new URL(siteUrl).host // www.formatteknik.com.tr
  const q = (s) => s.replace(/\./g, '\\.')
  return [
    `# Tek adres: ${aliases.join(', ')} → ${host}, http → https (yerel denemelerde ve başka alan adlarında çalışmaz)`,
    `# Diğer alan adları da bu klasörü göstermeli (cPanel: "Alias" / "Parked" alan adı) ve SSL sertifikaları olmalı.`,
    `RewriteCond %{HTTP_HOST} ^(${aliases.map(q).join('|')})$ [NC]`,
    `RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,NE,L]`,
    `RewriteCond %{HTTP_HOST} ^${q(host)}$ [NC]`,
    `RewriteCond %{HTTPS} off`,
    // bazı paylaşımlı sunucularda https vekil sunucuda biter: o durumda yönlendirme döngüsüne girmesin
    `RewriteCond %{HTTP:X-Forwarded-Proto} !https`,
    `RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,NE,L]`,
  ]
}

export function toHtaccess(rules) {
  return rules.map((r) => {
    let dest = r.destination
    r.names.forEach((n, i) => (dest = dest.replace(new RegExp(`:${n.name}\\*?`), `$${i + 1}`)))
    return `RewriteRule ${r.apacheRegex} ${dest} [R=301,NE,L]`
  })
}

/* ------------------------------------------------------------ Netlify (_redirects) */

export function hostRulesNetlify(siteUrl, aliases) {
  const host = new URL(siteUrl).host
  return [
    ...aliases.flatMap((a) => [`http://${a}/* https://${host}/:splat 301!`, `https://${a}/* https://${host}/:splat 301!`]),
    `http://${host}/* https://${host}/:splat 301!`,
  ]
}

export function toNetlify(rules) {
  return rules.map((r) => {
    let src = r.source
    let dest = r.destination
    for (const n of r.names) {
      if (n.rest) {
        src = src.replace(`/:${n.name}*`, '/*')
        dest = dest.replace(`:${n.name}*`, ':splat')
      }
    }
    // Netlify sondaki parça olmadan /tr adresini /tr/* ile eşlemez: ayrı satır gerekir
    const extra = src.endsWith('/*') ? [`${src.slice(0, -2) || '/'} ${dest.replace(':splat', '')} 301`] : []
    return [...extra, `${src} ${dest} 301`].join('\n')
  })
}
