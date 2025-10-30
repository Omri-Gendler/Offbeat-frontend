// src/pages/StationDetails.jsx

import { computeAndSetCoverFromHex } from '../store/actions/app.actions.js'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FastAverageColor } from 'fast-average-color'
import { SongPicker } from '../cmps/SongPicker'
import { SongsList } from '../cmps/SongsList.jsx'
import { StationActions } from '../cmps/StationActions.jsx'
import { EditStationModal } from '../cmps/EditStationModal.jsx'
import { useParams } from 'react-router-dom'
import { PlaylistHeader } from '../cmps/PlaylistHeader.jsx'
import { setCoverHex, setCoverHue } from '../store/actions/app.actions.js'
import { addStation, loadStation, updateStation, addSongToStation } from '../store/actions/station.actions'
import { addStationToLibrary } from '../store/actions/station.actions'
import { joinStationRoom, leaveStationRoom } from '../store/actions/socket.actions'

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

  // Join station room when viewing station details
  useEffect(() => {
    if (stationId) {
      console.log(`📡 StationDetails: Joining station room ${stationId}`)
      joinStationRoom(stationId)
      
      return () => {
        console.log(`📡 StationDetails: Leaving station room ${stationId}`)
        leaveStationRoom(stationId)
      }
    }
  }, [stationId])

  const songs = station?.songs ?? []

  const handleAddToCurrent = async (song) => {
    try {
      await addSongToStation(stationId, song)
    } catch (err) {
      console.error('Failed to add song:', err);
    }
  }


  useEffect(() => {
    const fac = new FastAverageColor()
    const imageUrl = station?.imgUrl
    let cancelled = false

    if (!imageUrl) {
      setDynamicBg('#121212')
      setCoverHex('#1f1f1f')
      setCoverHue(0)
      return () => fac.destroy()
    }

    fac.getColorAsync(imageUrl, { algorithm: 'dominant', mode: 'precision', step: 1, crossOrigin: 'anonymous' })
      .then(({ hex }) => {
        if (cancelled) return
        const { hex: boosted } = computeAndSetCoverFromHex(hex) // sets both
        setDynamicBg(boosted)
      })
      .catch(() => {
        if (cancelled) return
        setDynamicBg('#121212')
        setCoverHex('#1f1f1f')
        setCoverHue(0)
      })


    return () => { cancelled = true; fac.destroy() }
  }, [station?.imgUrl])


  const handleCoverChange = useCallback((newUrl) => {
    if (station) updateStation({ ...station, imgUrl: newUrl })
  }, [station])

  const existingIds = useMemo(
    () => new Set(songs.map(t => t.id)),
    [songs]
  )

  const handleSaveDetails = async (updatedDetails) => {
    if (!station) return
    await updateStation({ ...station, ...updatedDetails })
  }


  if (!station) {
    return (
      <section className="station-details">
        <div className="content-spacing">Loading station…</div>
      </section>
    )
  }

  return (
    <section className="station-details" >
      <PlaylistHeader station={station} onSaveStation={handleSaveDetails} />

      <div className="content-spacing-container">
        <div className="station-details-body">
          <StationActions station={station} />
          <SongsList station={station} />
          <div className='find-more-container'>
            {!isPickerOpen &&
              <button className="find-more-btn" onClick={() => setIsPickerOpen(true)}>Find more</button>}

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