import { Delete } from '@mui/icons-material'
import { IconPlay24, IconMoreHorizontal24, IconAddCircle24 } from '../cmps/Icon.jsx'
import { stationService } from '../services/station/station.service.local.js'
import { useNavigate } from 'react-router'

export function StationActions({ station }) {

  const navigate = useNavigate()

  async function handleDelete(ev) {
    ev.stopPropagation()
    console.log('Deleting station:', station._id)
    await stationService.remove(station._id)
    navigate('/stations')
  }

  return (
    <div className="station-actions-space">
      <div className="station-actions flex ">
        <button className="station-actions-play-btn" aria-label={`Play ${station.name}`}>
          <span><IconPlay24 className="play" /></span>
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