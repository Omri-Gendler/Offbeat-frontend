
export function SearchDropdown({ isOpen, anchorRef, recentSearches = [], onPick, onClear }) {
  if (!isOpen) return null

  return (
    <div id="search-dropdown" role="listbox" className="search-dropdown">
      <p className="recent-title">Recent searches</p>
      <ul className="recent-list" role="grid">
        {recentSearches.length ? (
          recentSearches.map((term, i) => (
            <li
              key={i}
              className="recent-item"
              role="option"
              tabIndex={0}
              onClick={() => onPick?.(term)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick?.(term)}
            >
              {term}
            </li>
          ))
        ) : (
          <li className="empty">No recent searches</li>
        )}
      </ul>
      <button className="clear-btn" type="button" onClick={onClear}>
        Clear 
      </button>
    </div>
  )
}
