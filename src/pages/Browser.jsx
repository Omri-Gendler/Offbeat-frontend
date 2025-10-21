import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StationList } from '../cmps/StationList.jsx'
import { Categories } from '../cmps/Categories.jsx'
import { SearchResults } from '../cmps/SearchResults.jsx'

export function Browser() {
  const { input } = useParams()
  const navigate = useNavigate()
  const searchQuery = input ? decodeURIComponent(input).toLowerCase() : ''
  const stations = useSelector(state => state.stationModule.stations || [])

  // filter stations based on search query
  const filteredStations = searchQuery
    ? stations.filter(st =>
      (st.name && st.name.toLowerCase().includes(searchQuery)) ||
      st.tags?.some(tag => tag.toLowerCase() === searchQuery)
    )
    : []

  function handleCategoryClick(categoryName) {
    console.log('Category clicked:', categoryName)
    navigate(`/search/${encodeURIComponent(categoryName)}`)
  }

  return (
    <section className="browser">
      {!searchQuery ? (
        <Categories onClickCategory={handleCategoryClick} />
      ) : (
        <>
          {/* Show filtered stations if any */}
          {filteredStations.length > 0 && (
            <div className="stations-section" style={{ marginBottom: '32px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
                Your Playlists
              </h2>
              <StationList stations={filteredStations} />
            </div>
          )}

          {/* YouTube search results with Spotify-like layout */}
          <SearchResults searchTerm={input} />
        </>
      )}
    </section>
  )
}

