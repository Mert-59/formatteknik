import { useEffect, useState } from 'react'

/** Bir yazı alanı odaktayken (telefonda klavye açık) çubuk alanın üstüne binmesin. */
export function useTyping() {
  const [typing, setTyping] = useState(false)
  useEffect(() => {
    const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches('input, textarea, select, [contenteditable="true"]')
    const onIn = (e: FocusEvent) => setTyping(isField(e.target))
    const onOut = (e: FocusEvent) => setTyping(isField(e.relatedTarget))
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])
  return typing
}
