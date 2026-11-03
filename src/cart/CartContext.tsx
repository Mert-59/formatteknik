/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SITE } from '../config/site'

export type CartItem = {
  id: string
  category: string // ürün grubu adı
  code: string // ürün kodu / açıklama
  brand: string // '' = fark etmez
  qty: number
  note: string
}

export type Customer = { name: string; company: string; note: string }

type CartState = {
  items: CartItem[]
  count: number
  open: boolean
  lastAddedAt: number
  setOpen: (open: boolean) => void
  add: (item: Omit<CartItem, 'id'>) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  buildMessage: (c: Customer) => string
}

const KEY = 'ft-cart-v1'
const Ctx = createContext<CartState | null>(null)

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [open, setOpen] = useState(false)
  const [lastAddedAt, setLastAddedAt] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* gizli pencere vb. — sepet yine de oturum boyunca çalışır */
    }
  }, [items])

  const add = useCallback((item: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      // Aynı grup + kod + marka varsa adedi artır
      const same = prev.find(
        (p) => p.category === item.category && p.code.toLowerCase() === item.code.toLowerCase() && p.brand === item.brand,
      )
      if (same) return prev.map((p) => (p === same ? { ...p, qty: p.qty + item.qty } : p))
      return [...prev, { ...item, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` }]
    })
    setLastAddedAt(Date.now())
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Math.min(9999, qty)) } : p)))
  }, [])

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const buildMessage = useCallback(
    (c: Customer) => {
      const lines = [`Merhaba ${SITE.name},`, 'Web sitenizden oluşturduğum sipariş / teklif talebim:', '']
      items.forEach((it, i) => {
        const brand = it.brand ? ` — Marka: ${it.brand}` : ''
        lines.push(`${i + 1}) ${it.category}: ${it.code}${brand} — Adet: ${it.qty}`)
        if (it.note) lines.push(`   Not: ${it.note}`)
      })
      lines.push('')
      if (c.name) lines.push(`Ad Soyad: ${c.name}`)
      if (c.company) lines.push(`Firma: ${c.company}`)
      if (c.note) lines.push(`Not: ${c.note}`)
      return lines.join('\n').trim()
    },
    [items],
  )

  const value = useMemo<CartState>(
    () => ({
      items,
      count: items.reduce((n, it) => n + it.qty, 0),
      open,
      lastAddedAt,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      buildMessage,
    }),
    [items, open, lastAddedAt, add, setQty, remove, clear, buildMessage],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalı')
  return ctx
}
