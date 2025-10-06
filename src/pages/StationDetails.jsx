import { useEffect,useState , useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FastAverageColor } from 'fast-average-color'

import StationCover from '../cmps/StationCover.jsx'
import { SongsList } from '../cmps/SongsList.jsx'
import { loadStation, updateStation } from '../store/actions/station.actions'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(s => s.stationModule.station)
  const stations = useSelector(s => s.stationModule.stations)

  useEffect(() => {
    if (!stationId) return
    loadStation(stationId) // your action dispatches internally
  }, [stationId])

  const [dynamicBgColor, setDynamicBgColor] = useState('#121212')
    useEffect(() => {
        if (!stations || !stations.length || !stations[0].imgUrl) {
            setDynamicBgColor('#121212')
            return
        }
        const imageUrl = stations[0].imgUrl
        const fac = new FastAverageColor()
        fac.getColorAsync(imageUrl, { algorithm: 'dominant' })
            .then(color => {
                const gradient = `linear-gradient(${color.hex} 0%, #121212 350px)`
                setDynamicBgColor(gradient)
            })
            .catch(e => {
                console.error('Error getting image color:', e)
                setDynamicBgColor('#121212')
            })
        return () => {
            fac.destroy()
        }
    }, [stations])


  const handleCoverChange = useCallback((newUrl) => {
    if (!station) return
    updateStation({ ...station, imgUrl: newUrl })
  }, [station])

  if (!station) {
    return (
      <section className="station-details">
        <div className="content-spacing">Loading station…</div>
      </section>
    )
  }

  return (
    <section className="station-details" style={{ background: dynamicBgColor }}>
      <div className="content-spacing">
        
        <header className="station-header flex align-center">
        
          <StationCover station={station} onChangeUrl={handleCoverChange} />
          
          <div className="station-meta">
            <span className="station-type">station</span>
            <h1 className="station-title">{station?.name ?? 'NEW station'}</h1>

            <div className="station-byline">
              <a className="station-owner" href="">{station?.createdBy?.fullname ?? 'Unknown'}</a>
              <span className="dot">•</span>
              <span className="station-stats">
                {station?.songs?.length ?? 0} songs
              </span>
            </div>
          </div>

        </header>
          

            <div className="station-actions">
              <button className="play-btn" aria-label="Play">Play</button>
              <button className="like-btn" aria-label="Like">♡</button>
              <button className="more-btn" aria-label="More options">•••</button>
            </div>

        <div className="station-tracks">
          <SongsList station={station} />
        </div>
      </div>
    </section>
  )
}
