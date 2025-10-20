import { FastAverageColor } from 'fast-average-color'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { maxLength } from '../services/util.service'
import { ContextMenu } from './ContextMenu'
import { StationPreview } from './StationPreview'
import { playContext, togglePlay, setPlay } from '../store/actions/player.actions'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {
  const [dynamicBgColor, setDynamicBgColor] = useState('#121212')
  const navigate = useNavigate()
  const recentsScrollRef = useRef(null)

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

  const idsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      const aid = a[i]?.id ?? a[i]
      const bid = b[i]?.id ?? b[i]
      if (aid !== bid) return false
    }
    return true
  }

  const isStationContext = (station) => {
    const stationSongs = Array.isArray(station?.songs) ? station.songs : []
    return !!station?._id &&
      contextId === station._id &&
      contextType === 'station' &&
      idsEqual(queue, stationSongs)
  }

  const makeHandlePlayClick = (station) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    const stationSongs = Array.isArray(station?.songs) ? station.songs : []
    if (!station?._id || !stationSongs.length) return
    const sameContext = isStationContext(station)
    if (sameContext) {
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
  }

  function randomStation() {
    const stations = [...stations]
    const randomStations = stations.slice(0, 5)
    return randomStations
  }

  const renderStationItem = (station) => {
    const sameContext = isStationContext(station)
    const active = sameContext && isPlaying
    const onPlayClick = makeHandlePlayClick(station)

    return (
      <li
        key={station._id}
        className="station-list-wrapper"
        data-active={active ? 'true' : 'false'}
        onContextMenu={(e) => handleContextMenu(e, station._id)}
        onClick={() => navigate(`/station/${station._id}`)}
      >
        <StationPreview station={station} />
        <button
          type="button"
          className="play-button"
          onClick={onPlayClick}
          aria-pressed={active}
          aria-label={active ? 'Pause' : 'Play'}
          data-playing={active ? 'true' : 'false'}
        >
          {active ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
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
          {stations.slice(0, 6).map(st => {
            const sameContext = isStationContext(st)
            const active = sameContext && isPlaying
            const onPlayClick = makeHandlePlayClick(st)

            return (
              <div
                key={st._id}
                className="recent-item-list"
                data-active={active ? 'true' : 'false'}
                onClick={() => navigate(`/station/${st._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/station/${st._id}`)}
              >
                <img src={st.imgUrl} alt={st.name} />
                <span>{maxLength(st.name, 15)}</span>
                <button
                  type="button"
                  className="play-button"
                  onClick={onPlayClick}
                  aria-pressed={active}
                  aria-label={active ? 'Pause' : 'Play'}
                  data-playing={active ? 'true' : 'false'}
                >
                  {active ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" />
                      <rect x="14" y="5" width="4" height="14" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5V19L19 12L8 5Z" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <h2 className='station-list-title'>All Stations</h2>
      </div>

      <div className="station-list-content">
        <ul className="station-list">
          {stations.map(renderStationItem)}
        </ul>

        <h2>Made For You</h2>
        <ul className="station-list">
          {stations.slice(10, 28).map(station => (
            renderStationItem(station)
          ))}
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




{/* <div className='station-list-recents'>
                    {stations.slice(0, 6).map(station => (
                        <button
                            onClick={() => navigate(`/station/${station._id}`)}
                            key={station._id}
                            className="recent-item-list"
                        >
                            <img src={station.imgUrl} alt={station.name} />
                            <span>{maxLength(station.name, 15)}</span>

                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>

                        </button>
                    ))}
                </div> */}