/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SITE, whatsappUrl } from '../config/site'

/**
 * Teklif fişi (sepet). Sunucu yok: her şey tarayıcıda saklanır,
 * WhatsApp mesajı olarak gönderilir. Site hiçbir veriyi kendisi tutmaz ya da bir yere göndermez.
 *
 * Gönderim akışı: "WhatsApp ile gönder" → WhatsApp açılır (openedAt) → müşteri "Evet, gönderdim" der (sentAt).
 * Site mesajın gerçekten gidip gitmediğini bilemez; bu yüzden "gönderildi" mührü ve geçmiş kaydı müşterinin onayıyla olur.
 * Gönderilmiş (ya da WhatsApp'ı açılmış) bir fiş değişirse yeni numara alır; mesajda önceki numara yazılır.
 */
export type CartItem = {
  id: string
  category: string // ürün grubu adı; '' = belirtilmedi
  code: string // ürün kodu / açıklama
  brand: string // '' = fark etmez
  qty: number
  note: string
}

export type NewItem = { category?: string; code: string; brand?: string; qty: number; note?: string }
export type Customer = { name: string; company: string; note: string }
/** Fişin önceki bir fişle ilişkisi: güncel hâli ya da tekrarı — WhatsApp mesajında yazılır. */
export type OrderRef = { kind: 'update' | 'repeat'; no: string }
type Order = {
  no: string
  /** müşterinin "gönderdim" dediği an (0 = onaylanmadı) */
  sentAt: number
  /** WhatsApp'ın açıldığı an; onay bekleniyor (0 = açılmadı) */
  openedAt: number
  ref?: OrderRef
}
/** Gönderilmiş bir fiş — yalnızca bu cihazda saklanır (ft-history-v1). */
export type PastSlip = { no: string; sentAt: number; items: Required<NewItem>[] }

type CartState = {
  items: CartItem[]
  /** kalem sayısı */
  count: number
  /** toplam adet */
  units: number
  open: boolean
  /** çekmece açılırken kod alanına odaklanılsın mı */
  focusAdd: boolean
  /** son eklenen kalemler (satırda kısa vurgu için) — bkz. itemKey */
  lastAdded: { keys: string[]; at: number }
  orderNo: string
  /** müşterinin gönderdiğini onayladığı an (0 = onaylanmadı) */
  sentAt: number
  /** WhatsApp açıldı, "gönderdiniz mi?" onayı bekleniyor (0 = hayır) */
  openedAt: number
  orderRef?: OrderRef
  customer: Customer
  /** gönderilmiş fişler, en yenisi başta */
  history: PastSlip[]
  setCustomer: (c: Customer) => void
  setOpen: (open: boolean) => void
  openCart: (opts?: { focus?: boolean }) => void
  add: (item: NewItem) => void
  addMany: (items: NewItem[]) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  buildMessage: () => string
  /** WhatsApp'ı hazır mesajla açar */
  sendWhatsApp: () => void
  /** "Evet, gönderdim": mühür basılır, fiş geçmişe kaydedilir */
  confirmSent: () => void
  /** "Henüz göndermedim": onay sorusu kalkar */
  dismissSent: () => void
  /** Geçmişteki bir fişin kalemlerini fişe ekler */
  repeat: (slip: PastSlip) => void
  clearHistory: () => void
}

const KEY = 'ft-cart-v1'
const ORDER_KEY = 'ft-order-v1'
const CUSTOMER_KEY = 'ft-customer-v1'
const HISTORY_KEY = 'ft-history-v1'
/** Cihazda saklanan en fazla geçmiş fiş */
const HISTORY_MAX = 20
const Ctx = createContext<CartState | null>(null)

const clampQty = (n: number) => Math.max(1, Math.min(9999, Math.round(n) || 1))
/** Aynı grup + kod + marka aynı kalemdir. */
export const itemKey = (it: { category: string; code: string; brand: string }) =>
  `${it.category}|${it.code.trim().toLocaleLowerCase('tr')}|${it.brand}`
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

function read<T>(key: string, fallback: T, valid: (x: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    return parsed !== null && valid(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* gizli pencere vb. — fiş yine de oturum boyunca çalışır */
  }
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null
const str = (x: unknown) => (typeof x === 'string' ? x : '')
const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : 0)

/** Kayıttan gelen kalem; kodu olmayan atlanır. */
const toItem = (x: unknown): Required<NewItem> | null =>
  isObj(x) && typeof x.code === 'string' && x.code.trim()
    ? { category: str(x.category), code: x.code, brand: str(x.brand), qty: clampQty(Number(x.qty)), note: str(x.note) }
    : null

function loadItems(): CartItem[] {
  return read<unknown[]>(KEY, [], Array.isArray)
    .map((x) => {
      const it = toItem(x)
      return it && { ...it, id: isObj(x) && typeof x.id === 'string' ? x.id : uid() }
    })
    .filter((x): x is CartItem => x !== null)
}

/** FT-YYAAGG-NNNN — fişin kimliği; mesajda ve çekmecede görünür. */
function newOrderNo() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `FT-${p(d.getFullYear() % 100)}${p(d.getMonth() + 1)}${p(d.getDate())}-${String(Math.floor(1000 + Math.random() * 9000))}`
}

const EMPTY_ORDER: Order = { no: '', sentAt: 0, openedAt: 0 }

function loadOrder(hasItems: boolean): Order {
  const raw = read<Record<string, unknown>>(ORDER_KEY, {}, isObj)
  const r = isObj(raw.ref) ? raw.ref : {}
  const ref: OrderRef | undefined =
    (r.kind === 'update' || r.kind === 'repeat') && typeof r.no === 'string' ? { kind: r.kind, no: r.no } : undefined
  const o: Order = { no: str(raw.no), sentAt: num(raw.sentAt), openedAt: num(raw.openedAt), ref }
  // Eski sürümden kalan dolu sepet: fiş numarası yoksa üret
  return o.no || !hasItems ? o : { ...EMPTY_ORDER, no: newOrderNo() }
}

function loadCustomer(): Customer {
  const c = read<Record<string, unknown>>(CUSTOMER_KEY, {}, isObj)
  return { name: str(c.name), company: str(c.company), note: '' }
}

function loadHistory(): PastSlip[] {
  return read<unknown[]>(HISTORY_KEY, [], Array.isArray)
    .map((x): PastSlip | null => {
      if (!isObj(x) || typeof x.no !== 'string' || !Array.isArray(x.items)) return null
      const items = x.items.map(toItem).filter((i): i is Required<NewItem> => i !== null)
      return items.length ? { no: x.no, sentAt: num(x.sentAt), items } : null
    })
    .filter((x): x is PastSlip => x !== null)
    .slice(0, HISTORY_MAX)
}

/**
 * Fiş değişti. Daha önce gönderildiyse (ya da WhatsApp'ı açıldıysa) yeni numara alır ve mesajda eski numara
 * "güncel hâli" olarak yazılır: firmaya aynı numarayla iki farklı fiş gitmez. Gönderilmemiş fişin numarası kalır.
 */
const changed = (o: Order): Order =>
  o.sentAt || o.openedAt ? { no: newOrderNo(), sentAt: 0, openedAt: 0, ref: { kind: 'update', no: o.no } } : { ...o, no: o.no || newOrderNo() }

export function CartProvider({ children }: { children: ReactNode }) {
  /*
   * Ön-render: sunucuda ve tarayıcının ilk (devralma) çiziminde fiş boştur; kayıtlı fiş, ekrana
   * çizilmeden hemen önce (useLayoutEffect) okunur. `ready` olmadan hiçbir şey yazılmaz:
   * aksi hâlde ilk çizimdeki boş fiş, kayıtlı fişin üzerine yazılırdı.
   */
  const [ready, setReady] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [order, setOrder] = useState<Order>(EMPTY_ORDER)
  const [customer, setCustomerState] = useState<Customer>({ name: '', company: '', note: '' })
  const [history, setHistory] = useState<PastSlip[]>([])
  const [open, setOpen] = useState(false)
  const [focusAdd, setFocusAdd] = useState(false)
  const [lastAdded, setLastAdded] = useState<{ keys: string[]; at: number }>({ keys: [], at: 0 })
  // Geri çağrılarda güncel kalem listesi (ör. son kalem kaldırılınca fiş sıfırlansın)
  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useLayoutEffect(() => {
    // Bilinçli: tarayıcı deposundan (localStorage) okuma; ön-render HTML'i ile uyuşmazlık olmasın diye çizimden önce.
    const saved = loadItems()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(saved)
    setOrder(loadOrder(saved.length > 0))
    setCustomerState(loadCustomer())
    setHistory(loadHistory())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) write(KEY, items)
  }, [ready, items])
  useEffect(() => {
    if (ready) write(ORDER_KEY, order)
  }, [ready, order])
  // Ad ve firma bir sonraki siparişte hazır gelsin; not her fişe özeldir.
  useEffect(() => {
    if (ready) write(CUSTOMER_KEY, { name: customer.name, company: customer.company })
  }, [ready, customer.name, customer.company])
  useEffect(() => {
    if (ready) write(HISTORY_KEY, history)
  }, [ready, history])

  const setCustomer = useCallback((c: Customer) => setCustomerState(c), [])

  const addMany = useCallback((incoming: NewItem[]) => {
    const clean = incoming
      .map((it) => ({ category: it.category ?? '', code: it.code.trim(), brand: it.brand ?? '', qty: clampQty(it.qty), note: it.note ?? '' }))
      .filter((it) => it.code)
    if (!clean.length) return
    setItems((prev) => {
      let next = prev
      for (const item of clean) {
        // Aynı grup + kod + marka varsa adet artar
        const same = next.find((p) => itemKey(p) === itemKey(item))
        next = same
          ? next.map((p) => (p === same ? { ...p, qty: clampQty(p.qty + item.qty) } : p))
          : [...next, { ...item, id: uid() }]
      }
      return next
    })
    setOrder(changed) // boş fişe ilk kalemde numara verilir
    setLastAdded({ keys: clean.map(itemKey), at: Date.now() })
  }, [])

  const add = useCallback((item: NewItem) => addMany([item]), [addMany])

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: clampQty(qty) } : p)))
    setOrder(changed)
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setOrder(EMPTY_ORDER)
    setCustomerState((c) => ({ ...c, note: '' }))
  }, [])

  const remove = useCallback(
    (id: string) => {
      // son kalem de gidince fiş baştan başlar (numarasız, boş)
      if (itemsRef.current.every((p) => p.id === id)) return clear()
      setItems((prev) => prev.filter((p) => p.id !== id))
      setOrder(changed)
    },
    [clear],
  )

  const openCart = useCallback((opts?: { focus?: boolean }) => {
    setFocusAdd(!!opts?.focus)
    setOpen(true)
  }, [])

  /** WhatsApp mesajı; *kalın* yazım WhatsApp biçimidir. */
  const buildMessage = useCallback(
    () => {
      const lines = [`Merhaba ${SITE.name},`, `Web sitenizden teklif talebim — Fiş ${order.no}`]
      if (order.ref?.kind === 'update') lines.push(`(${order.ref.no} numaralı fişin güncel hâlidir)`)
      if (order.ref?.kind === 'repeat') lines.push(`(${order.ref.no} numaralı fişin tekrarı)`)
      lines.push('')
      items.forEach((it, i) => {
        lines.push(`${i + 1}) *${it.code}* × ${it.qty}`)
        const meta = [it.category, it.brand && `Marka: ${it.brand}`].filter(Boolean).join(' · ')
        if (meta) lines.push(`   ${meta}`)
        if (it.note) lines.push(`   Not: ${it.note}`)
      })
      const who = [
        customer.name.trim() && `Ad Soyad: ${customer.name.trim()}`,
        customer.company.trim() && `Firma: ${customer.company.trim()}`,
        customer.note.trim() && `Not: ${customer.note.trim()}`,
      ].filter(Boolean) as string[]
      if (who.length) lines.push('', ...who)
      return lines.join('\n').trim()
    },
    [items, customer, order.no, order.ref],
  )

  const sendWhatsApp = useCallback(() => {
    window.open(whatsappUrl(buildMessage()), '_blank', 'noopener')
    // Onaylanmış fiş "tekrar gönder"ilince yeniden sorulmaz
    setOrder((o) => (o.sentAt ? o : { ...o, openedAt: Date.now() }))
  }, [buildMessage])

  const confirmSent = useCallback(() => {
    const at = order.openedAt || Date.now()
    setOrder((o) => ({ ...o, sentAt: at, openedAt: 0 }))
    // Geçmişe yazılır (aynı numara varsa güncellenir), en yenisi başta
    const slip: PastSlip = {
      no: order.no,
      sentAt: at,
      items: items.map(({ category, code, brand, qty, note }) => ({ category, code, brand, qty, note })),
    }
    setHistory((h) => [slip, ...h.filter((s) => s.no !== slip.no)].slice(0, HISTORY_MAX))
  }, [order.no, order.openedAt, items])

  const dismissSent = useCallback(() => setOrder((o) => ({ ...o, openedAt: 0 })), [])

  const repeat = useCallback(
    (slip: PastSlip) => {
      const wasEmpty = itemsRef.current.length === 0
      addMany(slip.items)
      // boş fişe tekrarlanınca mesajda hangi fişin tekrarı olduğu yazılır
      if (wasEmpty) setOrder((o) => ({ ...o, ref: { kind: 'repeat', no: slip.no } }))
    },
    [addMany],
  )

  const clearHistory = useCallback(() => setHistory([]), [])

  const value = useMemo<CartState>(
    () => ({
      items,
      count: items.length,
      units: items.reduce((n, it) => n + it.qty, 0),
      open,
      focusAdd,
      lastAdded,
      orderNo: order.no,
      sentAt: order.sentAt,
      openedAt: order.openedAt,
      orderRef: order.ref,
      customer,
      history,
      setCustomer,
      setOpen,
      openCart,
      add,
      addMany,
      setQty,
      remove,
      clear,
      buildMessage,
      sendWhatsApp,
      confirmSent,
      dismissSent,
      repeat,
      clearHistory,
    }),
    [
      items, open, focusAdd, lastAdded, order, customer, history, setCustomer, openCart, add, addMany, setQty, remove, clear,
      buildMessage, sendWhatsApp, confirmSent, dismissSent, repeat, clearHistory,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalı')
  return ctx
}
