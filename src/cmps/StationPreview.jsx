import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { playContext, togglePlay } from '../store/actions/player.actions'
import { IconPlay24 } from './Icon'

export function StationPreview({ station, onRemoveStation, onUpdateStation }) {
    const navigate = useNavigate()
    const { isPlaying, contextId, contextType } = useSelector(s => s.playerModule || {})
    
    const isThisStationPlaying = isPlaying && contextType === 'station' && contextId === station._id

    const handlePlayClick = (e) => {
        e.stopPropagation()
        
        if (isThisStationPlaying) {
            togglePlay()
        } else {
            playContext({
                contextId: station._id,
                contextType: 'station',
                tracks: station.songs || [],
                autoplay: true
            })
        }
    }

    const handleStationClick = () => {
        navigate(`/station/${station._id}`)
    }

    // Get description text
    const getDescription = () => {
        if (station.createdBy?.fullname) {
            return `By ${station.createdBy.fullname}`
        }
        if (station.tags?.length) {
            return station.tags.slice(0, 3).join(', ')
        }
        return `${station.songs?.length || 0} songs`
    }

    return (
        <article className="station-preview" onClick={handleStationClick}>
            <img 
                className="station-preview-image" 
                src={station.imgUrl} 
                alt={station.name} 
            />
            
            <h3 className="station-preview-title">{station.name}</h3>
            
            <p className="station-preview-description">{getDescription()}</p>
            
            <button 
                className="station-preview-play-btn"
                onClick={handlePlayClick}
                aria-label={isThisStationPlaying ? 'Pause' : 'Play'}
            >
                <IconPlay24 />
            </button>
        </article>
    )
}