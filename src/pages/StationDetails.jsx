// src/pages/StationDetails.jsx

// --- ייבוא נוסף עבור סוקטים ו-Redux ---
import { socketService } from '../services/socket.service.js'
import { store } from '../store/store' // ייבוא ישיר של ה-store
import { setPlay } from '../store/actions/player.actions' // ייבוא הפעולה setPlay
import { PLAY_CONTEXT } from '../store/reducers/player.reducer' // ייבוא קבוע הפעולה
import { SET_STATION } from '../store/reducers/station.reducer' // ייבוא קבוע הפעולה (ודא שהוא מיוצא מה-reducer)
// --- סוף ייבוא נוסף ---

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

  // --- useEffect לטיפול בסוקטים ---
  useEffect(() => {
    if (!stationId) return

    // הודעה לשרת שאנחנו צופים ב-station הזה
    socketService.emit('station-join', stationId)
    console.log(`Socket: Joining station ${stationId}`)

    // הגדרת מאזין לעדכונים של פרטי ה-Station
    const handleStationUpdate = (updatedStation) => {
      console.log('Socket: Received station-updated event', updatedStation)
      if (updatedStation._id === stationId) {
        // עדכון ישיר של ה-store
        store.dispatch({ type: SET_STATION, station: updatedStation })
      }
    }
    socketService.on('station-updated', handleStationUpdate)


    // --- מאזינים ל-Play/Pause ממשתמשים אחרים ---
    const handleReceivePlay = ({ stationId: receivedStationId, songId }) => {
      console.log('--- handleReceivePlay START ---')
      console.log('Socket: Received station-receive-play', { receivedStationId, songId })
      if (receivedStationId === stationId && songId) {
        const playerState = store.getState().playerModule
        const currentQueue = playerState.queue || []
        const currentContextId = playerState.contextId
        const currentContextType = playerState.contextType

        console.log(`Socket: Current player context: ${currentContextType} - ${currentContextId}`)
        console.log('Current Play Order (real indices):', currentPlayOrder)
        if (currentContextId === stationId && currentContextType === 'station') {
          const currentPlayOrder = playerState.playOrder || []
          const targetIndexInPlayOrder = currentPlayOrder.findIndex(realIndex => {
            const songInQueue = currentQueue[realIndex]
            return songInQueue && (songInQueue.id === songId || songInQueue._id === songId)
          })

          if (targetIndexInPlayOrder !== -1) {
            console.log(`Socket: Song ${songId} found locally at index ${targetIndexInPlayOrder}. Setting index and playing.`)
            store.dispatch({ type: 'SET_INDEX', index: targetIndexInPlayOrder }) // Use action type constant if available
            store.dispatch(setPlay(true))
          } else {
            console.warn(`Socket: Song ${songId} not found in current local playOrder. Using PLAY_CONTEXT with songId.`)
            store.dispatch({
              type: PLAY_CONTEXT,
              payload: {
                contextId: stationId,
                contextType: 'station',
                tracks: currentQueue,
                trackId: songId, // Use songId
                autoplay: true,
                preserveCurrent: true // Try to preserve shuffle/repeat state
              }
            })
          }
        } else {
          console.log(`Socket: Context is different or null. Using PLAY_CONTEXT with songId to set context.`)
          const currentStationState = store.getState().stationModule.station
          const currentSongs = currentStationState?.songs || []
          store.dispatch({
            type: PLAY_CONTEXT,
            payload: {
              contextId: stationId,
              contextType: 'station',
              tracks: currentSongs,
              trackId: songId, // Use songId
              autoplay: true
            }
          })
        }
      }
    }

    const handleReceivePause = ({ stationId: receivedStationId }) => {
      console.log('Socket: Received station-receive-pause', { receivedStationId })
      if (receivedStationId === stationId) {
        store.dispatch(setPlay(false))
      }
    }

    // הרשמה למאזינים
    socketService.on('station-receive-play', handleReceivePlay)
    socketService.on('station-receive-pause', handleReceivePause)
    // --- סוף הוספת מאזינים ---


    // Cleanup: הפסקת האזנה ועזיבת החדר
    return () => {
      socketService.emit('station-leave', stationId)
      console.log(`Socket: Leaving station ${stationId}`)
      socketService.off('station-updated', handleStationUpdate)
      // --- הסרת מאזינים ---
      socketService.off('station-receive-play', handleReceivePlay)
      socketService.off('station-receive-pause', handleReceivePause)
      // --- סוף הסרה ---
    }
    // התלות stationId מבטיחה שה-useEffect ירוץ מחדש רק אם ה-ID משתנה
  }, [stationId])
  // --- סוף הוספת useEffect לסוקטים ---

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
        <div className="content-spacing">Loading playlist</div>
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