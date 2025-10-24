// src/cmps/ContextMenu/ViewContextMenu.jsx
import { useEffect, useMemo, useRef } from 'react'
import { IconCheckmark16 } from './Icon'

export function ViewContextMenu({
  open,
  onClose,
  groups = [],
  anchorEl,             // optional, not used for closing anymore
  closeOnSelect = false,
}) {
  const ref = useRef(null)

  const viewGroup = useMemo(
    () => groups.find(g => /view/i.test(g.title)) || null,
    [groups]
  )
  const viewIndex = useMemo(() => {
    if (!viewGroup) return 0
    const i = viewGroup.items.findIndex(i => i.id === viewGroup.value)
    return i < 0 ? 0 : i
  }, [viewGroup])

  // close on outside click or Esc
  useEffect(() => {
    if (!open) return
    const outside = (e) => {
      const el = ref.current
      if (!el) return
      if (el.contains(e.target)) return
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

  if (!open) return null

  const handleSelect = (group, optId) => {
    group.onChange?.(optId)
    if (closeOnSelect) onClose?.()
  }

  return (
    <div
      ref={ref}
      className="contextmenu"
      role="dialog"
      aria-label="View menu"
      data-anchor="library-list-tr"
      style={{ position: 'fixed', zIndex: 9999 }}
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
                      onClick={() => handleSelect(g, opt.id)}
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
                    className={`contextmenu-item flex ${checked ? 'checked-context-item' : ''}`}
                    onClick={() => handleSelect(g, opt.id)}
                  >
                    {opt.icon && <span className="cm-icon">{opt.icon}</span>}
                    <span className="cm-label">{opt.label}</span>
                    {checked && <span className="cm-check"><IconCheckmark16 /></span>}
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
