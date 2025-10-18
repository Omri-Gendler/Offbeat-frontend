import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FastAverageColor } from 'fast-average-color'

import { SongPicker } from '../cmps/SongPicker'
import { SongsList } from '../cmps/SongsList.jsx'
import { StationActions } from '../cmps/StationActions.jsx'
import { EditStationModal } from '../cmps/EditStationModal.jsx'
import { addStation, loadStation, updateStation } from '../store/actions/station.actions'
import { addStationToLibrary } from '../store/actions/station.actions'

export function StationDetails() {
  const { stationId } = useParams()
  const station = useSelector(s => s.stationModule.station)
  const dispatch = useDispatch()

  // state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [dynamicBg, setDynamicBg] = useState('#121212')

  // Load station
  useEffect(() => {
    if (stationId) loadStation(stationId)
  }, [stationId])

  // Safe alias: never read station.songs directly
  const songs = station?.songs ?? []

  // Dynamic bg
  useEffect(() => {
    const fac = new FastAverageColor()
    const imageUrl = station?.imgUrl
    if (!imageUrl) {
      setDynamicBg('#121212')
      return () => fac.destroy()
    }
    fac.getColorAsync(imageUrl, { algorithm: 'dominant', crossOrigin: 'anonymous' })
      .then(({ hex }) => setDynamicBg(`linear-gradient(${hex} 0%, #121212 350px)`))
      .catch(() => setDynamicBg('#121212'))
    return () => fac.destroy()
  }, [station?.imgUrl])

  const handleCoverChange = useCallback((newUrl) => {
    if (station) dispatch(updateStation({ ...station, imgUrl: newUrl }))
  }, [station, dispatch])

  // ✅ Use `songs` in both computation and deps
  const existingIds = useMemo(
    () => new Set(songs.map(t => t.id)),
    [songs]
  )

  const handleSaveDetails = async (updatedDetails) => {
    if (!station) return
    await dispatch(updateStation({ ...station, ...updatedDetails }))
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
        <div className="background-color-details"></div>
        <div className="background background-position"></div>

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
          <div className="actions-bar">

          </div>

          <SongsList station={station} />

          <button className="btn" onClick={() => setIsPickerOpen(true)}>Add songs</button>

          {isPickerOpen && (
            <SongPicker
              stationId={station._id}
              existingIds={existingIds}
              onClose={() => setIsPickerOpen(false)}
            // optional: initial={suggestedTracksArray}
            />
          )}
        </div>
      </div>
    </section>
  )
}
