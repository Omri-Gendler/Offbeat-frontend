import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StationPreview } from '../cmps/StationPreview.jsx' // create if you don’t have it
import { StationList } from '../cmps/StationList.jsx'
import { Categories } from '../cmps/Categories.jsx'

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
      {!searchQuery ? <Categories/> : null}
    

      {filteredStations.length && searchQuery ? (
        <StationList 
        stations={filteredStations}/>
      ) : (
        null
      )}
    </section>
  )
}

