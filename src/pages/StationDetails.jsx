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
      {/* <Link to="/stations">Back to list</Link> */}
      {station &&
      <> 
       <div className="content-spacing">
        <div className='station-details-container flex align-center'>
        <img className="station-img" src={station.songs[0].imgUrl} alt="station cover" />
        <div className="station-details-text flex column">
        <span>Public Playlist</span>
        <h1 className=''>{station.name}</h1>
        <p className='details'>
        <span>created by </span> <a href="">{station.createdBy.fullname}</a>  . <span>{station.songs.length} songs </span>
        </p>
        </div>
        {/* <pre> {JSON.stringify(station, null, 2)} </pre> */}
      </div>
      </div>
        <SongsList station={station} />
    </>
}
    </section>
      
  )
}