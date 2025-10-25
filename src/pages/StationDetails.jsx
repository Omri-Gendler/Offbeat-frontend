import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'


import { FastAverageColor } from 'fast-average-color'

import { SongPicker } from '../cmps/SongPicker'
import { SongsList } from '../cmps/SongsList.jsx'
import { StationActions } from '../cmps/StationActions.jsx'
import { EditStationModal } from '../cmps/EditStationModal.jsx'
import { useParams } from 'react-router-dom'
import {PlaylistHeader} from  '../cmps/PlaylistHeader.jsx'


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
        if (!cancelled) setDynamicBg(hex)
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
    <section className="station-details" >
<PlaylistHeader station={station} onSaveStation={handleSaveDetails}/>

      
        <div className="content-spacing-container">
      <div className="station-details-body">
      <StationActions station={station} />

          

          <SongsList station={station} />
          <div className='find-more-container'>

          <button className="find-more-btn" onClick={() => setIsPickerOpen(true)}>Find more</button>

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
      </div>
      
    </section>

  )
}
