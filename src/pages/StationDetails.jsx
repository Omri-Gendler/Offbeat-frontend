import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FastAverageColor } from 'fast-average-color'


import StationCover from '../cmps/StationCover.jsx'
import { SongsList } from '../cmps/SongsList.jsx'
import { loadStation, updateStation } from '../store/actions/station.actions'
import { StationActions } from '../cmps/StationActions.jsx'
import { CompositeCover } from '../cmps/CompositeCover.jsx'
import { EditStationModal } from '../cmps/EditStationModal.jsx'
import { StationSearch} from '../cmps/StationSearch.jsx'
import { use } from 'react'


export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(s => s.stationModule.station)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLikedSongs, setLikedSongs] = useState(false)

  const dispatch = useDispatch()


  useEffect(() => {
    if (stationId) {
      loadStation(stationId)
    }
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

  const handleSaveDetails = async (updatedDetails) => {
    const stationToUpdate = { ...station, ...updatedDetails }

    try {
      await stationService.save(stationToUpdate)
      dispatch(updateStation(stationToUpdate))

      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to save station:", err)
    }
  }

  const hasCustomCover = !!station.imgUrl
  const canGenerateCover = station.songs && station.songs.length >= 2

  return (
    <section className="station-details" style={{ background: dynamicBg }}>
        <div className="station-header flex align-center">         
           <div className='background-color-details'></div>
          <div className='background background-position'></div>
          <div className='station-details-header content-spacing'>
            <div className='station-cover-container flex'>
                  <div
                      className="station-cover-img-wrap"
                      draggable={false}

                    >
                      { isLikedSongs &&
                      <img aria-hidden="false" draggable="false" loading="eager" src="https://misc.scdn.co/liked-songs/liked-songs-300.jpg" alt="" className="station-cover-img" srcSet="https://misc.scdn.co/liked-songs/liked-songs-300.jpg 150w, https://misc.scdn.co/liked-songs/liked-songs-300.jpg 300w" sizes="(min-width: 1280px) 232px, 192px"/>}
                      { !isLikedSongs &&
                      <img aria-hidden="false" draggable="false" loading="eager" src={station.imgUrl} alt="" className="station-cover-img" sizes="(min-width: 1280px) 232px, 192px"/>
                      }

                    </div>
                    </div>
          {/* {canGenerateCover ? (
            <CompositeCover
              images={station.songs.slice(0, 2).map(song => song.imgUrl)}
            />
          ) : hasCustomCover ? (
            <StationCover station={station} onChangeUrl={handleCoverChange} />
          ) : (
            <StationCover station={{ imgUrl: '/img/unnamed-song.png' }} isEditable={false} /> */}
          
          {/* <StationCover station={station} onChangeUrl={handleCoverChange} /> */}
        
          <div className="station-meta">
            <span className="station-type">Public Playlist</span>
            <button className="station-title editable" onClick={() => setIsModalOpen(true)}>
             <span><h1 className="e-91000-text encore-text-headline-large encore-internal-color-text-base" >{station?.name ?? 'my station'}</h1></span>
            </button>
            <div className="station-byline">
              <a className="station-owner" href="">{station?.createdBy?.fullname ?? 'Unknown'}</a>
              <span className="dot">•</span>
              <span className="station-stats">{station?.songs?.length ?? 0} songs</span>
              <span className="dot">•</span>
              <span className="station-total">{station?.length ?? '1 hr 25 min'}</span>

            </div>
          </div>
          {isModalOpen && (
            <EditStationModal
              station={station}
              onSave={handleSaveDetails}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
        </div>
        <StationActions station={station} />
        
        <div className='station-details-body'>
          <div className='content-spacing'>
       
        <SongsList station={station} />

        <StationSearch
          // value={query}
          // onChange={setQuery}
          // onSubmit={handleSubmit}
          // onClose={handleClose}
        />
        </div>
        </div>
    </section>
  )
}
