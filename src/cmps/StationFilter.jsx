
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { SearchDropdown } from './SearchDropdown'

export function StationFilter({ filterBy, setFilterBy }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { input } = useParams() // from /search/:input when on that route

  const [txt, setTxt] = useState(filterBy.txt || '')
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches') || '[]')
  )
  const anchorRef = useRef(null)

useEffect(() => {
  function onDocClick(ev) {
    if (!anchorRef.current) return
    if (!anchorRef.current.contains(ev.target)) setIsOpen(false)
  }
  document.addEventListener('mousedown', onDocClick)
  return () => document.removeEventListener('mousedown', onDocClick)
}, [])

  useEffect(() => {
    setFilterBy(prev => ({ ...prev, txt }))
  }, [txt])

  function handleChange(e) {
    const value = e.target.value
    setTxt(value)

    const path = value.trim() ? `/search/${encodeURIComponent(value)}` : '/search'
    if (location.pathname !== path) {
      navigate(path, { replace: true })
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const term = txt.trim()
    if (!term) return

    navigate(`/search/${encodeURIComponent(term)}`)

    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    setIsOpen(false)
  }

  function handlePick(term) {
    setTxt(term)
    navigate(`/search/${encodeURIComponent(term)}`) // show picked term in route
    setIsOpen(false)
  }

  function handleClearRecent() {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <section className="station-filter">
      <form
        className="station-search-container"
        ref={anchorRef}
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <div className="station-search flex">
                     <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className="search-svg"
            data-testid="search-icon"
            viewBox="0 0 24 24"
          >
            <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
          </svg>
          <input
            className="station-filter-input"
            name="station-search"
            type="text"
            placeholder="What do you want to play?"
            value={txt}
            onChange={handleChange}
            onFocus={() => txt.trim().length === 0 && setIsOpen(true)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          
          <div className="browse">
            <button
              data-testid="browse-button"
              className="button"
              aria-label="Browse"
              data-encore-id="buttonTertiary"
              type="button"
              onClick={() => navigate(`/search`) }
            >
              <span aria-hidden="true" className="icon-wrapper">
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  className="browse-svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2"></path>
                  <path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4z"></path>
                </svg>
              </span>
            </button>
          </div>

        </div>

        <SearchDropdown
          isOpen={isOpen}
          recentSearches={recentSearches}
          onPick={handlePick}
          onClear={handleClearRecent}
        />
      </form>
    </section>
  )
}
