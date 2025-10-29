import DeleteIcon from '@mui/icons-material/Delete'
import { PlayPauseButton } from '../cmps/PlayPauseButton.jsx'
import { IconMoreHorizontal24, IconAddCircle24, IconCheckCircle24 } from '../cmps/Icon.jsx'
import { useNavigate } from 'react-router'
import { useEffect, useState, useMemo } from 'react' 
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { removeStation, addStationToLibrary, removeStationFromLibrary } from '../store/actions/station.actions.js' 
import { libraryService } from '../services/library/library.service.local.js'
import { playContext, togglePlay, setPlay } from '../store/actions/player.actions'

export function StationActions({ station }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { queue = [], isPlaying = false, contextId = null, contextType = null } = useSelector(
    s => s.playerModule || {},
    shallowEqual
  )
  
  const loggedinUser = useSelector(s => s.userModule.user)

  const isAdded = useMemo(() => {
      if (!station?.likedByUsers || !loggedinUser?._id) {
          return false
      }
      return station.likedByUsers.some(userId => userId.toString() === loggedinUser._id.toString())
  }, [station?.likedByUsers, loggedinUser?._id])

  const handleToggleLibrary = () => {
    if (!station?._id) return

    if (isAdded) {
      removeStationFromLibrary(station)
    } else {
      addStationToLibrary(station)
    }
  }

  async function handleDelete(ev) {
    ev.stopPropagation()
    try {
      const isOwner = station.owner?._id?.toString() === loggedinUser?._id?.toString()
      if (!isOwner) {
        console.warn('User attempted to delete a station they do not own.')
        return
      }
      if (window.confirm(`Are you sure you want to delete "${station.name}"?`)) {
        await removeStation(station._id) 
        navigate('/') 
      }
    } catch (err) {
      console.error('Failed to remove station:', err)
    }
  }

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

  const handlePlay = () => {
    if (!station?._id || !stationSongs.length) return
    if (isThisStationActive) {
      if (!isPlaying) togglePlay() 
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

  const isOwner = station.owner?._id?.toString() === loggedinUser?._id?.toString();

  return (
    <div className="station-actions-space content-spacing">
      <div className="station-actions flex">
        <PlayPauseButton
          isPlaying={isThisStationActive && isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          disabled={!stationSongs.length}
        />

        <button
          type="button"
          className="tertiary-btn"
          onClick={handleToggleLibrary}
          aria-pressed={isAdded} 
          aria-label={isAdded ? 'Remove from your library' : 'Add to your library'}
          data-added={isAdded ? 'true' : 'false'}
          disabled={!station?._id}
        >
          {isAdded ? <IconCheckCircle24 style={{ color: 'var(--clr3)' }} /> : <IconAddCircle24 />}
        </button>

        <button type="button" className="tertiary-btn" aria-label="More options">
          <IconMoreHorizontal24 className="icon" />
        </button>

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            className="delete tertiary-btn"
            aria-label={`Delete ${station?.name ?? 'station'}`}
            style={{ backgroundColor: 'transparent' }}
            disabled={!station?._id}
          >
            <DeleteIcon className="icon" />
          </button>
        )}
      </div>
    </div>
  )
}