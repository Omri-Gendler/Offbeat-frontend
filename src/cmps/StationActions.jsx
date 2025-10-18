import DeleteIcon from '@mui/icons-material/Delete'
import { PlayPauseButton } from '../cmps/PlayPauseButton.jsx'
import { IconMoreHorizontal24, IconAddCircle24, IconCheckCircle24 } from '../cmps/Icon.jsx'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { removeStation } from '../store/actions/station.actions.js'
import { libraryService } from '../services/library/library.service.local.js'
import { playContext, togglePlay, setPlay } from '../store/actions/player.actions' // ← import player actions
import { addStationToLibrary, removeStationFromLibrary } from '../store/actions/station.actions.js'
export function StationActions({ station }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Player slice (to detect current context & queue)
  const { queue = [], isPlaying = false, contextId = null, contextType = null } = useSelector(
    s => s.playerModule || {},
    shallowEqual
  )

  const isAdded = station?.createdBy?.fullname === 'You'

  const handleToggleLibrary = () => {
    if (!station?._id) return

    const { added: nowAdded } = libraryService.toggle(station._id)
    setAdded(nowAdded)

    if (isAdded) {
      removeStationFromLibrary(station)
    } else {
      addStationToLibrary(station)
    }
  }

  // Local “added to library” UI state
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (station?._id) setAdded(libraryService.has(station._id))
    else setAdded(false)
  }, [station?._id])

  async function handleDelete(ev) {
    ev.stopPropagation()
    try {
      await dispatch(removeStation(station._id))
      navigate('/stations')
    } catch (err) {
      console.error('Failed to remove station:', err)
    }
  }

  // Helper: compare two track arrays by id
  const idsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      const aid = a[i]?.id ?? a[i]
      const bid = b[i]?.id ?? b[i]
      if (aid !== bid) return false
    }
    return true
  }

  const stationSongs = Array.isArray(station?.songs) ? station.songs : []
  const isThisStationActive =
    !!station?._id &&
    contextId === station._id &&
    contextType === 'station' &&
    idsEqual(queue, stationSongs)

  const isPressed = isThisStationActive && isPlaying
  // Play/Pause like Spotify:
  // - If this station is the active context → toggle play.
  // - Else → replace queue with this station, start at index 0, autoplay.
  const handlePlay = () => {
    if (!station?._id || !stationSongs.length) return
    if (isThisStationActive) {
      if (!isPlaying) togglePlay() // resume if currently paused
    } else {
      playContext({
        contextId: station._id,
        contextType: 'station',
        tracks: stationSongs,
        index: 0,
        autoplay: true,
      })
    }
  }

  const handlePause = () => {
    if (isPlaying) setPlay(false)
  }

  return (
    <div className="station-actions-space content-spacing">
      <div className="station-actions flex">
        <PlayPauseButton
          isPlaying={isThisStationActive && isPlaying}  // ← controlled by Redux
          onPlay={handlePlay}
          onPause={handlePause}
          disabled={!stationSongs.length}
        />

        <button
          type="button"
          className="tertiary-btn"
          onClick={handleToggleLibrary}
          aria-pressed={added}
          aria-label={added ? 'Added to your library' : 'Add to your library'}
          data-added={added ? 'true' : 'false'}
          disabled={!station?._id}
        >
          {added ? <IconCheckCircle24 /> : <IconAddCircle24 />}
        </button>

        <button type="button" className="tertiary-btn" aria-label="More options">
          <IconMoreHorizontal24 className="icon" />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="delete"
          aria-label={`Delete ${station?.name ?? 'station'}`}
          style={{ backgroundColor: 'transparent' }}
          disabled={!station?._id}
        >
          <DeleteIcon className="icon" />
        </button>
      </div>
    </div>
  )
}
