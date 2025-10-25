import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Recents } from './Recents'

import { maxLength } from '../services/util.service'
import { ContextMenu } from './ContextMenu'
import { StationPreview } from './StationPreview'
import { playContext, togglePlay, setPlay } from '../store/actions/player.actions'

export function StationList({ stations, onRemoveStation, onUpdateStation, variant = 'default' }) {
  const [dynamicBgColor, setDynamicBgColor] = useState('#121212')
  const navigate = useNavigate()

  const { isPlaying = false, contextId = null, contextType = null } =
    useSelector(s => s.playerModule || {}, shallowEqual)

  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    stationId: null,
  })

  const isActiveStation = useCallback(
    (station) => contextType === 'station' && station?._id && contextId === station._id,
    [contextId, contextType]
  )

  const makeHandlePlayClick = (station) => (e) => {
    e.stopPropagation()
    e.preventDefault()

    const tracks = Array.isArray(station?.songs) ? station.songs : []
    if (!station?._id || tracks.length === 0) return

    if (isActiveStation(station)) {
      if (!isPlaying) togglePlay()
      else setPlay(false)
    } else {
      playContext({
        contextId: station._id,
        contextType: 'station',
        tracks,
        index: 0,
        autoplay: true,
      })
    }
  }

  const handleOpenStation = (stationId) => navigate(`/station/${stationId}`)

  // Context menu
  const handleContextMenu = (event, stationId) => {
    event.preventDefault()
    setContextMenu({
      isOpen: true,
      position: { x: event.pageX, y: event.pageY },
      stationId,
    })
  }

  const handleCloseMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleDelete = () => {
    if (contextMenu.stationId && onRemoveStation) {
      onRemoveStation(contextMenu.stationId)
      handleCloseMenu()
    }
  }

  useEffect(() => {
    if (!contextMenu.isOpen) return
    window.addEventListener('click', handleCloseMenu)
    return () => window.removeEventListener('click', handleCloseMenu)
  }, [contextMenu.isOpen, handleCloseMenu])

  // UI snippets
  const PlayButton = ({ active, onClick }) => (
    <button
      type="button"
      className="play-button"
      onClick={onClick}
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
  )

  const renderStationItem = (station) => {
    const active = isActiveStation(station) && isPlaying
    const onPlayClick = makeHandlePlayClick(station)

    const onKeyOpen = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleOpenStation(station._id)
    }

    return (
      <li
        key={station._id}
        className="station-list-wrapper"
        data-active={active ? 'true' : 'false'}
        onContextMenu={(e) => handleContextMenu(e, station._id)}
        onClick={() => handleOpenStation(station._id)}
        tabIndex={0}
        onKeyDown={onKeyOpen}
      >
        <StationPreview station={station} />
        <PlayButton active={active} onClick={onPlayClick} />
      </li>
    )
  }

  // Grid variant for homepage sections
  if (variant === 'grid') {
    return (
      <>
        {stations.map(station => (
          <StationPreview
            key={station._id}
            station={station}
            onRemoveStation={onRemoveStation}
            onUpdateStation={onUpdateStation}
          />
        ))}
      </>
    )
  }

  return (
    <section className="station-list-contain">

      
        <h2 className="station-list-title">All Stations</h2>
        <ul className="station-list-scroll">
          {stations.map(renderStationItem)}
        </ul>

        <h2>Made For You</h2>
        <ul className="station-list-scroll">
          {stations.slice(10, 28).map(renderStationItem)}
        </ul>

    </section>
  )
}
