/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SITE, whatsappUrl } from '../config/site'

/**
 * Teklif fişi (sepet). Sunucu yok: her şey tarayıcıda saklanır,
 * WhatsApp ya da e-posta mesajı olarak gönderilir.
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
/** Fişin gönderildiği kanal ('' = gönderilmedi) */
export type SentVia = '' | 'whatsapp' | 'email'
type Order = { no: string; sentAt: number; via: SentVia }

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
  /** WhatsApp/e-posta ile gönderildiği an (0 = gönderilmedi) */
  sentAt: number
  /** Son gönderimin kanalı — "Tekrar gönder" aynı kanaldan gider */
  sentVia: SentVia
  customer: Customer
  setCustomer: (c: Customer) => void
  setOpen: (open: boolean) => void
  openCart: (opts?: { focus?: boolean }) => void
  add: (item: NewItem) => void
  addMany: (items: NewItem[]) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  buildMessage: (plain?: boolean) => string
  sendWhatsApp: () => void
  mailHref: () => string
  markSent: (via: Exclude<SentVia, ''>) => void
}

const KEY = 'ft-cart-v1'
const ORDER_KEY = 'ft-order-v1'
const CUSTOMER_KEY = 'ft-customer-v1'
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

function loadItems(): CartItem[] {
  const list = read<unknown[]>(KEY, [], Array.isArray)
  return list
    .filter((x): x is Record<string, unknown> => isObj(x) && typeof x.code === 'string')
    .map((x) => ({
      id: typeof x.id === 'string' ? x.id : uid(),
      category: typeof x.category === 'string' ? x.category : '',
      code: x.code as string,
      brand: typeof x.brand === 'string' ? x.brand : '',
      qty: clampQty(Number(x.qty)),
      note: typeof x.note === 'string' ? x.note : '',
    }))
}

/** FT-YYAAGG-NNNN — fişin kimliği; mesajda ve çekmecede görünür. */
function newOrderNo() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `FT-${p(d.getFullYear() % 100)}${p(d.getMonth() + 1)}${p(d.getDate())}-${String(Math.floor(1000 + Math.random() * 9000))}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems)
  const [order, setOrder] = useState<Order>(() => {
    const raw = read<Record<string, unknown>>(ORDER_KEY, { no: '' }, (x) => isObj(x) && typeof x.no === 'string')
    const sentAt = typeof raw.sentAt === 'number' ? raw.sentAt : 0
    // Eski sürümde kanal tutulmuyordu: gönderilmiş fiş WhatsApp'tan gitmiş sayılır
    const via: SentVia = raw.via === 'email' || raw.via === 'whatsapp' ? raw.via : sentAt ? 'whatsapp' : ''
    const o: Order = { no: raw.no as string, sentAt, via }
    // Eski sürümden kalan dolu sepet: fiş numarası yoksa üret
    return o.no || !items.length ? o : { no: newOrderNo(), sentAt: 0, via: '' }
  })
  const [customer, setCustomerState] = useState<Customer>(() => ({
    ...read(CUSTOMER_KEY, { name: '', company: '' }, isObj),
    note: '',
  }))
  const [open, setOpen] = useState(false)
  const [focusAdd, setFocusAdd] = useState(false)
  const [lastAdded, setLastAdded] = useState<{ keys: string[]; at: number }>({ keys: [], at: 0 })

  useEffect(() => write(KEY, items), [items])
  useEffect(() => write(ORDER_KEY, order), [order])
  // Ad ve firma bir sonraki siparişte hazır gelsin; not her fişe özeldir.
  useEffect(() => write(CUSTOMER_KEY, { name: customer.name, company: customer.company }), [customer.name, customer.company])

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
    // Yeni kalem eklenince fiş yeniden "gönderilmedi" olur; boş fişe ilk kalemde numara verilir.
    setOrder((o) => ({ no: o.no || newOrderNo(), sentAt: 0, via: '' }))
    setLastAdded({ keys: clean.map(itemKey), at: Date.now() })
  }, [])

  const add = useCallback((item: NewItem) => addMany([item]), [addMany])

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: clampQty(qty) } : p)))
  }, [])

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), [])

  const clear = useCallback(() => {
    setItems([])
    setOrder({ no: '', sentAt: 0, via: '' })
    setCustomerState((c) => ({ ...c, note: '' }))
  }, [])

  const openCart = useCallback((opts?: { focus?: boolean }) => {
    setFocusAdd(!!opts?.focus)
    setOpen(true)
  }, [])

  const buildMessage = useCallback(
    (plain = false) => {
      const b = (s: string) => (plain ? s : `*${s}*`)
      const lines = [`Merhaba ${SITE.name},`, `Web sitenizden teklif talebim — Fiş ${order.no}`, '']
      items.forEach((it, i) => {
        lines.push(`${i + 1}) ${b(it.code)} × ${it.qty}`)
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
    [items, customer, order.no],
  )

  const markSent = useCallback((via: Exclude<SentVia, ''>) => setOrder((o) => ({ ...o, sentAt: Date.now(), via })), [])

  const sendWhatsApp = useCallback(() => {
    window.open(whatsappUrl(buildMessage()), '_blank', 'noopener')
    markSent('whatsapp')
  }, [buildMessage, markSent])

  // WhatsApp kullanmayan (ör. masaüstündeki satın alma birimi) için aynı mesaj e-postayla
  const mailHref = useCallback(
    () =>
      `mailto:${SITE.email}?subject=${encodeURIComponent(`Teklif talebi — Fiş ${order.no}`)}&body=${encodeURIComponent(buildMessage(true))}`,
    [buildMessage, order.no],
  )

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
      sentVia: order.via,
      customer,
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
      mailHref,
      markSent,
    }),
    [items, open, focusAdd, lastAdded, order, customer, setCustomer, openCart, add, addMany, setQty, remove, clear, buildMessage, sendWhatsApp, mailHref, markSent],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalı')
  return ctx
}
