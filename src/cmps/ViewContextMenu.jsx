// src/cmps/ContextMenu/ViewContextMenu.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

export function ViewContextMenu({
  open,
  onClose,
  groups = [],
  anchorEl,
  placement = 'left-start',
  offset = 8,
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: -9999, y: -9999 })

  // compute groups / selected index FIRST (hooks always run)
  const viewGroup = useMemo(
    () => groups.find(g => /view/i.test(g.title)) || null,
    [groups]
  )
  const viewIndex = useMemo(() => {
    if (!viewGroup) return 0
    const i = viewGroup.items.findIndex(i => i.id === viewGroup.value)
    return i < 0 ? 0 : i
  }, [viewGroup])

  // position next to anchor
  useLayoutEffect(() => {
    if (!open) return
    const a = anchorEl?.getBoundingClientRect?.()
    const el = ref.current
    if (!a || !el) return

    setPos({ x: -9999, y: -9999 })
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      let x = a.left - r.width - offset
      let y = a.bottom

      if (placement === 'right-start') { x = a.right + offset; y = a.top }
      if (placement === 'bottom-start') { x = a.left; y = a.bottom + offset }

      if (x < 0) x = a.right + offset
      if (x + r.width > innerWidth) x = Math.max(8, innerWidth - r.width - 8)
      if (y + r.height > innerHeight) y = Math.max(8, innerHeight - r.height - 8)
      if (y < 0) y = 8
      setPos({ x, y })
    })
  }, [open, anchorEl, placement, offset])

  // dismiss
  useEffect(() => {
    if (!open) return
    const outside = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      onClose?.()
    }
    const esc = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('mousedown', outside, true)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', outside, true)
      document.removeEventListener('keydown', esc)
    }
  }, [open, onClose])

  // now it's safe to bail out
  if (!open) return null

  return (
    <div
      ref={ref}
      className="contextmenu"
      role="dialog"
      aria-label="View menu"
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {groups.map((g, gi) => (
        <ul key={gi} role="menu" className="contextmenu-group" aria-label={g.title}>
          <li role="presentation" className="contextmenu-group-title">{g.title}</li>

          {(/view/i.test(g.title)) ? (
            <div className="view-icon-row" style={{ '--selected-index': viewIndex }}>
              {g.items.map((opt) => {
                const checked = g.value === opt.id
                return (
                  <li key={opt.id} role="presentation">
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={checked}
                      className={`contextmenu-item view-op-cm flex ${checked ? 'checked-context-item' : ''}`}
                      onClick={() => { g.onChange?.(opt.id); onClose?.() }}
                      aria-label={opt.ariaLabel || opt.label}
                      title={opt.label}
                    >
                      <span className="cm-icon">{opt.icon}</span>
                     
                    </button>
                  </li>
                )
              })}
            </div>
          ) : (
            g.items.map(opt => {
              const checked = g.value === opt.id
              return (
                <li key={opt.id} role="presentation">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    className={`contextmenu-item  flex ${checked ? 'checked-context-item' : ''}`}
                    onClick={() => { g.onChange?.(opt.id); onClose?.() }}
                  >
                    {opt.icon && <span className="cm-icon">{opt.icon}</span>}
                    <span className="cm-label">{opt.label}</span>
                    {checked && <span className="cm-check">✓</span>}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ))}
    </div>
  )
}
