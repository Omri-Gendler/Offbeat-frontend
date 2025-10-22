export function SimpleContextMenu({ open, x, y, items = [], onClose }) {
  if (!open) return null
  return (
    <div
      className="context-menu"
      style={{ position: 'fixed', top: y, left: x, zIndex: 1000 }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="context-menu__list">
        {items.map(it => (
          <li key={it.id}>
            <button
              type="button"
              className="context-menu__item"
              onClick={() => { it.onSelect?.(); onClose(); }}
            >
              {it.icon ? <span className="context-menu__icon">{it.icon}</span> : null}
              <span>{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {/* click-away */}
      <div
        className="context-menu__backdrop"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: -1, background: 'transparent'
        }}
      />
    </div>
  )
}
