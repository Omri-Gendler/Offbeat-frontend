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
      {!searchQuery ? <Categories onClickCategory={handleCategoryClick} /> : null}

      {searchQuery && (
        <div className="search-content">
          {/* Show filtered stations if any */}
          {filteredStations.length > 0 && (
            <div className="stations-section">
              <h2>Your Playlists</h2>
              <StationList stations={filteredStations} />
            </div>
          )}

          {/* Always show YouTube search results for queries */}
          <div className="youtube-section">
            <SearchResults searchTerm={input} />
          </div>
        </div>
      )}
    </section>
  )
}

