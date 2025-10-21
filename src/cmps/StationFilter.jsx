import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { SearchDropdown } from './SearchDropdown';
import { BrowseFilledIcon, BrowseOutlineIcon, SearchLensIcon } from './Icon';
import { useDebounce } from '../hooks/useDebounce';

export function StationFilter({ filterBy, setFilterBy }) { 
  const navigate = useNavigate()
  const location = useLocation()
  const { input } = useParams()

  const [txt, setTxt] = useState('')
  const debouncedSearchTerm = useDebounce(txt, 500) 
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches') || '[]')
  )
  const anchorRef = useRef(null)
  const isSearchActive = location.pathname.startsWith('/search')

  useEffect(() => {
    function onDocClick(ev) {
      if (!anchorRef.current?.contains(ev.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    const urlSearchTerm = input ? decodeURIComponent(input) : ''
    if (urlSearchTerm !== txt) {
      console.log(`updating txt from URL param: ${urlSearchTerm}`) // Debug
      setTxt(urlSearchTerm)
    }
    if (!isSearchActive && txt !== '') {
      console.log("clearing txt as we're not in search page") // Debug
      setTxt('')
    }
  }, [input, isSearchActive]) 

  useEffect(() => {
    if (!isSearchActive) {
      return;
    }

    const termFromDebounce = debouncedSearchTerm.trim()
    const termFromUrl = input ? decodeURIComponent(input).trim() : ''

    // נווט רק אם המשתמש הקליד משהו ששונה ממה שכבר נמצא ב-URL
    if (termFromDebounce !== termFromUrl) {
      const newPath = termFromDebounce ? `/search/${encodeURIComponent(termFromDebounce)}` : '/search'
      console.log(`updating URL to: ${newPath}`) // Debug
      navigate(newPath, { replace: true })
    }


  }, [debouncedSearchTerm, isSearchActive, input, navigate])

  function handleChange(e) {
    setTxt(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const term = txt.trim()
    if (!term) return

    const newPath = `/search/${encodeURIComponent(term)}`
    if (location.pathname !== newPath) {
      console.log(`navigating to: ${newPath}`) // Debug
      navigate(newPath)
    } else {
      console.log(`handleSubmit: already at ${newPath}, not navigating.`)
    }


    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    setIsOpen(false)
  }

  function handlePick(term) {
    setTxt(term)
    const newPath = `/search/${encodeURIComponent(term)}`
    console.log(('navigating to:', newPath))
    navigate(newPath)
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
          <SearchLensIcon />
          <input
            className="station-filter-input"
            name="station-search"
            type="text"
            placeholder="What do you want to play?"
            value={txt}
            onChange={handleChange}
            onFocus={() => txt.trim().length === 0 && setIsOpen(true)}
          />

          <div className="browse">
            <button
              data-testid="browse-button"
              className="button"
              aria-label="Browse"
              data-encore-id="buttonTertiary"
              type="button"
              onClick={() => navigate(`/search`)}
            >
              {isSearchActive ? (
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
  );
}