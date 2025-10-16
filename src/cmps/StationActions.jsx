import DeleteIcon from '@mui/icons-material/Delete'
import { PlayPauseButton } from '../cmps/PlayPauseButton.jsx'
import { IconMoreHorizontal24, IconAddCircle24, IconCheckCircle24 } from '../cmps/Icon.jsx'
import { useNavigate } from 'react-router'
import { useEffect, useState , } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { removeStation } from '../store/actions/station.actions.js'
import { libraryService } from '../services/library/library.service.local.js'
import { addLikedSong } from '../services/station/station.service.local';

export function StationActions({ station }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // local UI state, derived from storage
  const [added, setAdded] = useState(false)

  // initialize + keep in sync when station changes
  useEffect(() => {
    if (station?._id) {
      setAdded(libraryService.has(station._id))
    } else {
      setAdded(false)
    }
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

  function handleClickAdd() {
    if (!station?._id) return
    // toggle in storage and reflect the new state in UI
    const { added: nowAdded } = libraryService.toggle(station._id)
    setAdded(nowAdded)
  }
function DebugLibraryLogger() {
  useEffect(() => {
    (async () => {
      console.log('Library IDs:', ids);
      console.log('Library Stations:', libraryStations);
    })();
  }, []);

  return null;
}


  return (
    <div className="station-actions-space content-spacing">
      <div className="station-actions flex">
        <PlayPauseButton
          defaultPressed={false}
          onPlay={() => console.log('started')}
          onPause={() => console.log('stopped')}
        />

        <button
          type="button"
          className="tertiary-btn"
          onClick={handleClickAdd}
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

