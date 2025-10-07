import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview.jsx' // create if you don’t have it

export function Browser() {
  const { input } = useParams()
  const searchQuery = input ? decodeURIComponent(input).toLowerCase() : ''
  const stations = useSelector(state => state.stationModule.stations || [])

  // filter stations based on search query
  const filteredStations = searchQuery
    ? stations.filter(st =>
        st.name.toLowerCase().includes(searchQuery) ||
        st.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      )
    : stations

  return (
    <section className="browser">
      {searchQuery ? (
        <h2>Showing results for “{searchQuery}”</h2>
      ) : (
        <h2>Search</h2>
      )}

      {filteredStations.length ? (
        <ul className="station-list clean-list">
          {filteredStations.map(station => (
            <li key={station._id}>
              <StationPreview station={station} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No stations found.</p>
      )}
    </section>
  )
}

