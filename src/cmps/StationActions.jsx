import { Delete } from '@mui/icons-material'
import { IconPlay24, IconMoreHorizontal24, IconAddCircle24 ,IconPause24} from '../cmps/Icon.jsx'
import { stationService } from '../services/station/station.service.local.js'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeStation } from '../store/actions/station.actions.js'

export function StationActions({ station }) {
    const [playingId, setPlayingId] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const song = station.songs?.[0]
    const onTogglePlay = (song) => {
      if (playingId === song.id) {
        setIsPlaying((p) => !p);
      } else {
        setPlayingId(song.id);
        setIsPlaying(true);
      }
    }

  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function handleDelete(ev) {
    ev.stopPropagation();
    try {
      removeStation(station._id)
      navigate('/stations')
    } catch (err) {
      console.error('Failed to remove station:', err)
    }
  }

  return (
    <div className="station-actions-space">
      <div className="station-actions flex ">
      
            <button
              className="station-actions-play-btn"
              onClick={() => onTogglePlay(song)}
              aria-pressed={playingId === song.id && isPlaying}  
              aria-label={
                playingId === song.id && isPlaying
                  ? `Pause ${song.title}${song.artists ? ` by ${song.artists}` : ""}`
                  : `Play ${song.title}${song.artists ? ` by ${song.artists}` : ""}`
              }
              data-playing={playingId === song.id && isPlaying ? "true" : "false"}  
              tabIndex={-1}
            >
              {playingId === song.id && isPlaying ? (
                <IconPause24 />
              ) : (
                <IconPlay24 />
              )}
          </button>
                  

        <button className="tertiary-btn" aria-label="add to your library">
          <IconAddCircle24 className="icon" />
        </button>


        <button className="tertiary-btn" aria-label="More options">
          <IconMoreHorizontal24 className="icon" />
        </button>

        <button onClick={handleDelete} className='delete' aria-label={`Delete ${station.name}`} style={{ backgroundColor: 'transparent' }}>
          <Delete className="icon" />
        </button>
      </div>
    </div>
  )
}