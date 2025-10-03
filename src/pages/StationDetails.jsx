import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SongsList } from '../cmps/SongsList.jsx'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStation, addStationMsg } from '../store/actions/station.actions'


export function StationDetails() {

  const {stationId} = useParams()
  const station = useSelector(storeState => storeState.stationModule.station)

  useEffect(() => {
    loadStation(stationId)
  }, [stationId])
    



  return (
    <section className="station-details">
      <Link to="/stations">Back to list</Link>
      <h1>Station Details</h1>
      {station && <div className="station-card">
        <div className='station-header grid'>
        <img className="station-img" src={station.songs[0].imgUrl} alt="station cover" />
        <h3>{station.name}</h3>
        <h4>created by: {station.createdBy.fullname}</h4>
        <h4>{station.songs.length} songs</h4>
        </div>
        {/* <pre> {JSON.stringify(station, null, 2)} </pre> */}
        <SongsList station={station} />
      </div>}
      

    </section>
  )
}