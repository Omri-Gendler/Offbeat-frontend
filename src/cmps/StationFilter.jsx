
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { SearchDropdown } from './SearchDropdown'
import { BrowseFilledIcon, BrowseOutlineIcon, SearchLensIcon } from './Icon'

export function StationFilter({ filterBy, setFilterBy }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname.startsWith('/search')
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
            <SearchLensIcon/>
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
            {isActive ? (
                    <BrowseFilledIcon size={24} color="#fff" />
                ) : (
                    <BrowseOutlineIcon size={24} color="#b3b3b3" />
                )}
              
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
