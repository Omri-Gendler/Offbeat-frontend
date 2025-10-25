import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMemo,useEffect } from 'react'
import { StationList } from '../cmps/StationList.jsx'
import { Categories } from '../cmps/Categories.jsx'
import { SearchResults } from '../cmps/SearchResults.jsx'
import { setBgImage } from '../store/actions/app.actions.js'


export function Browser() {
  const unslug = (s='') =>
    decodeURIComponent(s)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  const { genre } = useParams()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  
  const q = (sp.get('q') || '').toLowerCase().trim()
  const genreSlug = (genre || '').toLowerCase().trim()

  // Effective filter term comes from ?q= or :genre
  const searchTerm = q || genreSlug

  const stations = useSelector(s => s.stationModule.stations || [])

    const categoryTitle = useMemo(() => {
    // prefer the route genre if present; fall back to ?q=
    if (genre) return unslug(genre)
    if (searchTerm) return unslug(searchTerm)
    return ''
  }, [genre, searchTerm])

  const filteredStations = useMemo(() => {
    if (!searchTerm) return []
    return stations.filter(st => {
      const nameHit = st.name?.toLowerCase().includes(searchTerm)
      const tagsHit = Array.isArray(st.tags) && st.tags.some(t => t?.toLowerCase() === searchTerm || t?.toLowerCase().includes(searchTerm))
      return nameHit || tagsHit
    })
  }, [stations, searchTerm])

  useEffect(() => {
  setBgImage(filteredStations[0]?.imgUrl || null)
  return () => setBgImage(null) 
}, [filteredStations])

  function handleCategoryClick(categoryName) {
    // pattern #2: push a clean URL segment
    navigate(`/search/${encodeURIComponent(categoryName)}`)
  }

  const showCategories = !searchTerm

  return (
    <>
      {showCategories ? (
        <div className='browser-categories'>
        <Categories onClickCategory={handleCategoryClick} />
        </div>
      ) : (
        <>
          {filteredStations.length > 0 && (
            <div className="stations-section" style={{ marginBottom: '32px' }}>
              <h2 className="station-list-title">{categoryTitle}</h2>
              <StationList stations={filteredStations} />
            </div>
          )}
          {/* Show YouTube search results when there's any search term (query param or route param) */}
          {searchTerm && <SearchResults searchTerm={searchTerm} />}
        </>
      )}
    </>
  )
}

