
import React, { memo } from 'react'
import { LIKED_ID } from '../store/reducers/station.reducer'
import { IconPinned } from './Icon'
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service'

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`
function getMetaParts(station, likedId) {
  const count = station.songs?.length ?? 0
  const songsPart = count > 0 ? plural(count, 'song', 'songs') : null

  switch (station.type) {
    case 'album':
      return [
        'Album',
        station.artistName || station.createdBy?.fullname || 'Unknown artist',
        songsPart, // only if count > 0
      ].filter(Boolean)

    case 'artist':
      return [
        'Artist',
        station.genre || station.country || station.createdBy?.fullname || null,
        // add other artist stats here if you have them
      ].filter(Boolean)

    case 'playlist':
    default: {
      const base = ['Playlist']
      if (songsPart) base.push(songsPart)
      return base
    }
  }
}

export function Library({
  items,
  viewMode = 'grid',           // <- default view
  onOpen,
  onPlay,
  isPlaying,
  isThisContext,
  onItemContextMenu,
  dragHandlers,
  draggedItem,
  dragOverIndex,
  isDragMode = false,
}) {
  if (!items?.length) return <div className="library-empty">No playlists yet</div>


  // normalize anything unexpected back to 'grid'
  const mode = (viewMode === 'list' || viewMode === 'grid-compact' || viewMode === 'grid')
    ? viewMode
    : 'grid'

  const containerClass =
    mode === 'list' ? 'library-list list'
    : mode === 'grid-compact' ? 'library-list grid-compact'
    : 'library-list grid'

  return (
    <div className={`${containerClass} ctx-anchor-library-list ${isDragMode ? 'drag-mode' : ''}`}>
      {items.map((st, index) => (
        <LibraryItem
          key={st._id}
          station={st}
          index={index}
          isActive={isThisContext(st) && isPlaying}
          onOpen={onOpen}
          onPlay={onPlay}
          onItemContextMenu={onItemContextMenu}
          compact={mode === 'grid-compact'}
          list={mode === 'list'}
          dragHandlers={dragHandlers}
          isDragged={draggedItem?._id === st._id}
          isDragOver={dragOverIndex === index}
          isDragMode={isDragMode}
        />
      ))}
    </div>
  )
}

const LibraryItem = memo(function LibraryItem({
  station,
  index,
  isActive,
  onOpen,
  onPlay,
  onItemContextMenu,
  compact,
  list,
  dragHandlers,
  isDragged,
  isDragOver,
  isDragMode
}) {
  

const parts = getMetaParts(station,LIKED_ID)

 const ariaParts = station.isPinned ? ['Pinned', ...parts] : parts




  const handleDragStart = (e) => {
    if (!isDragMode || station._id === 'liked-songs-station') return
    dragHandlers?.onDragStart(e, station)
  }

  const handleDragOver = (e) => {
    if (!isDragMode) return
    dragHandlers?.onDragOver(e, index)
  }

  const handleDragLeave = () => {
    if (!isDragMode) return
    dragHandlers?.onDragLeave()
  }

  const handleDrop = (e) => {
    if (!isDragMode) return
    dragHandlers?.onDrop(e, index)
  }

  const handleDragEnd = () => {
    if (!isDragMode) return
    dragHandlers?.onDragEnd()
  }

  return (
    <div
      className={`library-item ${compact ? 'compact' : ''} ${list ? 'list' : ''} ${isDragged ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      data-active={isActive ? 'true' : 'false'}
      title={station.name}
      onClick={() => onOpen(station)}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onItemContextMenu?.(e, station) }}
      tabIndex={0}
      data-id={station._id}
      draggable={isDragMode && station._id !== 'liked-songs-station'}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <div className="thumb-wrap">
        <img  loading="lazy" src={station.imgUrl || getAssetUrl(ASSET_PATHS.UNNAMED_SONG)} alt={station.name} />
        {!compact &&
        <button
          type="button"
          className="play-button"
          onClick={(e) => { e.stopPropagation(); onPlay(station, { active: isActive }) }}
          aria-pressed={isActive}
          aria-label={isActive ? 'Pause' : 'Play'}
          data-playing={isActive ? 'true' : 'false'}
        >
          {isActive ? (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5V19L19 12L8 5Z" />
            </svg>
          )}
        </button>
}         
      </div>



<div className="meta">
  {!compact &&
  <p className="name">{station.name}</p>}

{(!compact || list) && (
  <p className="sub" aria-label={ariaParts.join(' • ')}>
    {station.isPinned && (
      <span className="meta-chip pinned" aria-hidden="true">
        <IconPinned className='pinned-icon' size={12} color="var(--text-bright-accent, #1ed760)" />
      </span>
    )}

    {parts.map((part, i) => (
      <span key={i} className="meta-chip">
        {i > 0 ? <span aria-hidden> • </span> : null}
        {part}
      </span>
    ))}
  </p>
)}
</div>

    </div>
  )
})
