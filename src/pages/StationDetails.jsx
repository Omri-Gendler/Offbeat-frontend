import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import { FastAverageColor } from 'fast-average-color'

import { SongPicker } from '../cmps/SongPicker'
import { SongsList } from '../cmps/SongsList.jsx'
import { StationActions } from '../cmps/StationActions.jsx'
import { EditStationModal } from '../cmps/EditStationModal.jsx'
import { useParams } from 'react-router-dom'


import { addStation, loadStation, updateStation, addSongToStation } from '../store/actions/station.actions'
import { addStationToLibrary } from '../store/actions/station.actions'

export function StationDetails() {
  const dispatch = useDispatch()
  const { stationId } = useParams()
  const station = useSelector(s => s.stationModule.station)


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [dynamicBg, setDynamicBg] = useState('#121212')

  // Load station
  useEffect(() => {
    if (stationId) loadStation(stationId)
  }, [stationId])



  const songs = station?.songs ?? []

  const handleAddToCurrent = async (song) => {
    try {
      await addSongToStation(stationId, song)
      // optional: toast/snackbar
      // showSuccessMsg('Added to playlist')
    } catch (err) {
      // showErrorMsg('Could not add song')
    }
  }



  useEffect(() => {
    const fac = new FastAverageColor()
    const imageUrl = station?.imgUrl
    let cancelled = false
    if (!imageUrl) {
      setDynamicBg('#121212')
      return () => fac.destroy()
    }

    fac.getColorAsync(imageUrl, { algorithm: 'dominant', crossOrigin: 'anonymous' })
      .then(({ hex }) => {
        if (!cancelled) setDynamicBg(`linear-gradient(${hex} 0%, #121212 350px)`)
      })
      .catch(() => {
        if (!cancelled) setDynamicBg('#121212')
      })

    return () => {
      cancelled = true
      fac.destroy()
    }
  }, [station?.imgUrl])

  const handleCoverChange = useCallback((newUrl) => {
    if (station) updateStation({ ...station, imgUrl: newUrl })
  }, [station])
  // Set of ids already in this station (for picker to disable/hide)
  const existingIds = useMemo(
    () => new Set(songs.map(t => t.id)),
    [songs]
  )

  const handleSaveDetails = async (updatedDetails) => {
    if (!station) return
    await updateStation({ ...station, ...updatedDetails })
  }

  // Early return AFTER hooks
  if (!station) {
    return (
      <section className="station-details">
        <div className="content-spacing">Loading station…</div>
      </section>
    )
  }

  return (
    <section className="station-details" style={{ background: dynamicBg }}>
      <div className="station-header flex align-center">
        <div className="background-color-details" />
        

        <div className="station-details-header content-spacing">
          <div className="station-cover-container flex">
            <div className="station-cover-img-wrap" draggable={false}>
              <img
                aria-hidden="false"
                draggable="false"
                loading="eager"
                src={station.imgUrl || '/img/unnamed-song.png'}
                alt=""
                className="station-cover-img"
                sizes="(min-width: 1280px) 232px, 192px"
                onDoubleClick={() => handleCoverChange('/img/unnamed-song.png')}
              />
            </div>
          </div>

          <div className="station-meta">
            <span className="station-type">Public Playlist</span>
            <button className="station-title editable" onClick={() => setIsModalOpen(true)}>
              <span>
                <h1 className="e-91000-text encore-text-headline-large encore-internal-color-text-base">
                  {station?.name ?? 'My Station'}
                </h1>
              </span>
            </button>
            <div className="station-byline">
              <img src="/img/user-avatar.png" alt="user avatar" style={{ width: '25px', height: '25px' }} />
              <a className="station-owner">{station?.createdBy?.fullname ?? 'Unknown'}</a>
              <span className="dot">•</span>
              <span className="station-stats">{station?.songs?.length ?? 0} songs</span>
              <span className="dot">•</span>
              <span className="station-total">{station?.length ?? '—'}</span>
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

      {/* Actions row under header */}
      <StationActions station={station} />

      <div className="station-details-body">
        <div className="content-spacing">
          <div className="actions-bar">{/* put extra actions here */}</div>

          <SongsList station={station} />

          <button className="btn" onClick={() => setIsPickerOpen(true)}>Add songs</button>

          {isPickerOpen && (
            <SongPicker
              stationId={station._id}
              existingIds={existingIds}
              onClose={() => setIsPickerOpen(false)}
              onAdd={(song) => addSongToStation(stationId, song)}
            />
          )}
        </div>
      </div>
    </section>
  )
}
