import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { FastAverageColor } from 'fast-average-color'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { maxLength } from '../services/util.service'
import { ContextMenu } from './ContextMenu'
import { useSelector, shallowEqual } from 'react-redux'
import { playContext, togglePlay, setPlay } from '../store/actions/player.actions'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {
  const [dynamicBgColor, setDynamicBgColor] = useState('#121212')
  const navigate = useNavigate()
  const recentsScrollRef = useRef(null)

  // 🔎 Read current player state (to decide per-station play behavior)
  const { queue = [], isPlaying = false, contextId = null, contextType = null } = useSelector(
    s => s.playerModule || {},
    shallowEqual
  )

  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    stationId: null,
  })

  const handleRecentsScroll = (scrollOffset) => {
    if (recentsScrollRef.current) {
      recentsScrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' })
    }
  }

  const handleContextMenu = (event, stationId) => {
    event.preventDefault()
    setContextMenu({ isOpen: true, position: { x: event.pageX, y: event.pageY }, stationId })
  }

  const handleCloseMenu = () => setContextMenu(prev => ({ ...prev, isOpen: false }))

  const handleDelete = () => {
    if (contextMenu.stationId) {
      onRemoveStation(contextMenu.stationId)
      handleCloseMenu()
    }
  }

  useEffect(() => {
    if (contextMenu.isOpen) window.addEventListener('click', handleCloseMenu)
    return () => window.removeEventListener('click', handleCloseMenu)
  }, [contextMenu.isOpen])

  useEffect(() => {
    if (!stations || !stations.length || !stations[0].imgUrl) {
      setDynamicBgColor('#121212'); return
    }
    const imageUrl = stations[0].imgUrl
    const fac = new FastAverageColor()
    fac.getColorAsync(imageUrl, { algorithm: 'dominant' })
      .then(color => setDynamicBgColor(`linear-gradient(${color.hex} 0%, #121212 350px)`))
      .catch(() => setDynamicBgColor('#121212'))
    return () => fac.destroy()
  }, [stations])

  // helper: compare queues by ids
  const idsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      const aid = a[i]?.id ?? a[i]
      const bid = b[i]?.id ?? b[i]
      if (aid !== bid) return false
    }
    return true
  }

// render 1 station card (reused below)
const renderStationItem = (station) => {
  const stationSongs = Array.isArray(station?.songs) ? station.songs : []

  const isThisStationContext =
    !!station?._id &&
    contextId === station._id &&
    contextType === 'station' &&
    idsEqual(queue, stationSongs)

  // active only while actually playing
  const isActive = isThisStationContext && isPlaying

  const onPlayClick = (e) => {
    e.stopPropagation()
    if (!station?._id || !stationSongs.length) return

    if (isThisStationContext) {
      // Same context → toggle based on current state
      if (!isPlaying) togglePlay()   // resume
      else setPlay(false)            // pause
    } else {
      // New context → load from first track and autoplay
      playContext({
        contextId: station._id,
        contextType: 'station',
        tracks: stationSongs,
        index: 0,
        autoplay: true,
      })
    }
  }

  return (
    <li
      className="station-list-wrapper"
      data-active={isActive ? 'true' : 'false'}
      onClick={() => navigate(`/station/${station._id}`)}
    >
      <StationPreview station={station} />

      <button
        type="button"
        className="play-button"
        onClick={onPlayClick}
        aria-pressed={isActive}
        aria-label={isActive ? 'Pause' : 'Play'}
        data-playing={isActive ? 'true' : 'false'}
      >
        {isActive ? (
          // pause icon
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          // play icon
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5V19L19 12L8 5Z" />
          </svg>
        )}
      </button>
    </li>
  )
}

  return (
    <section className="station-list-container" style={{ background: dynamicBgColor }}>
      <div className='main-station-list-header'>
        <div className='main-station-list-filters'>
          <button>All</button>
          <button>Music</button>
        </div>

        <div className='station-list-recents'>
          {stations.slice(0, 6).map(station => (
            <button
              onClick={() => navigate(`/station/${station._id}`)}
              key={station._id}
              className="recent-item-list"
            >
              <img src={station.imgUrl} alt={station.name} />
              <span>{maxLength(station.name, 15)}</span>

              {/* recent-row play button mirrors same behavior */}
              <button
                type="button"
                className="play-button"
                onClick={(e) => {
                  e.stopPropagation()
                  const stationSongs = Array.isArray(station?.songs) ? station.songs : []
                  const isActive =
                    contextId === station._id &&
                    contextType === 'station' &&
                    idsEqual(queue, stationSongs)
                  if (!stationSongs.length) return
                  if (isActive) {
                    if (!isPlaying) togglePlay()
                    else setPlay(false)
                  } else {
                    playContext({
                      contextId: station._id,
                      contextType: 'station',
                      tracks: stationSongs,
                      index: 0,
                      autoplay: true,
                    })
                  }
                }}
                aria-label="Play"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5V19L19 12L8 5Z" fill="black" />
                </svg>
              </button>
            </button>
          ))}
        </div>

        <h2 className='station-list-title'>All Stations</h2>
      </div>

      <div className="station-list-content">
        {/* You had multiple repeated lists; reusing a single map here */}
        <ul className="station-list">
          {stations.map(renderStationItem)}
        </ul>
      </div>

      {contextMenu.isOpen && (
        <ContextMenu
          position={contextMenu.position}
          onDelete={handleDelete}
          onClose={handleCloseMenu}
        />
      )}
    </section>
  )
}
