import { useEffect,useState , useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FastAverageColor } from 'fast-average-color'


import StationCover from '../cmps/StationCover.jsx'
import { SongsList } from '../cmps/SongsList.jsx'
import { loadStation, updateStation } from '../store/actions/station.actions'
import { StationActions } from '../cmps/StationActions.jsx'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(s => s.stationModule.station)

  useEffect(() => {
    if (stationId) loadStation(stationId)
  }, [stationId])

  const [dynamicBg, setDynamicBg] = useState('#121212')

  useEffect(() => {
    const fac = new FastAverageColor()
    const imageUrl = station?.imgUrl
    if (!imageUrl) {
      setDynamicBg('#121212')
      return
    }

    fac.getColorAsync(imageUrl, { algorithm: 'dominant', crossOrigin: 'anonymous' })
      .then(({ hex }) => {
        setDynamicBg(`linear-gradient(${hex} 0%, #121212 350px)`)
      })
      .catch(() => setDynamicBg('#121212'))

    return () => fac.destroy()
  }, [station?.imgUrl])

  const handleCoverChange = useCallback((newUrl) => {
    if (station) updateStation({ ...station, imgUrl: newUrl })
  }, [station])

  if (!station) {
    return (
      <section className="station-details">
        <div className="content-spacing">Loading station…</div>
      </section>
    )
  }

  return (
    <section className="station-details" style={{ background: dynamicBg }}>
      <div className="content-spacing">
        <header className="station-header flex align-center">
          <StationCover station={station} onChangeUrl={handleCoverChange} />
          <div className="station-meta">
            <span className="station-type">Playlist</span>
            <h1 className="station-title">{station?.name ?? 'NEW station'}</h1>
            <div className="station-byline">
              <a className="station-owner" href="">{station?.createdBy?.fullname ?? 'Unknown'}</a>
              <span className="dot">•</span>
              <span className="station-stats">{station?.songs?.length ?? 0} songs</span>
            </div>

            {/* Simple, clean action bar (don’t paste Spotify’s raw DOM) */}
          </div>
        </header>
        <StationActions station={station} />

        <div className="station-tracks">
          <SongsList station={station} />
        </div>
      </div>
    </section>
  )
}
