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
const normalize = (s = '') => s.toLowerCase().replace(/[\s_-]+/g, '').trim()
  const q = (sp.get('q') || '').toLowerCase().trim()
  const genreSlug = (genre || '').toLowerCase().trim()

  // Effective filter term comes from ?q= or :genre
  const searchTerm = q || genreSlug

  const stations = useSelector(s => s.stationModule.stations || [])

const categoryTitle = useMemo(() => {
  if (genre) return unslug(genre)       // display "Hip Hop"
  if (searchTerm) return unslug(searchTerm)
  return ''
}, [genre, searchTerm])

const ALIAS_MAP = {
  hiphop: ['hiphop', 'hip-hop', 'hip hop'], // add any others you use
  rnb:    ['rnb', 'r&b', 'r n b'],
  edm:    ['edm', 'electronic', 'dance'],
  // ...
}
const filteredStations = useMemo(() => {
  if (!searchTerm) return []

  const normTerm = normalize(searchTerm)
  const aliasSet = new Set([normTerm, ...(ALIAS_MAP[normTerm] || []).map(normalize)])

  return stations.filter(st => {
    const nameNorm = normalize(st.name || '')
    const nameHit = [...aliasSet].some(a => nameNorm.includes(a))

    const tags = Array.isArray(st.tags) ? st.tags : []
    const tagsHit = tags.some(t => {
      const tn = normalize(t || '')
      // exact or partial match against any alias
      return [...aliasSet].some(a => tn === a || tn.includes(a))
    })

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
          {/* Use the explicit search term if present; otherwise fall back to :genre */}
        </>
      )}
    </>
  )
}

