
import { LIKED_ID } from '../store/reducers/station.reducer'

export default function LibraryItem({
  station,
  onOpen,
  onPlay,
  isActive = false,   
  compact = false,      
  list = false         
}) {
  const metaText = station._id === LIKED_ID
    ? 'Playlist•Liked Songs'
    : `Playlist•${station.songs?.length ?? 0} songs`

  return (
// inside Library item component
<div
  className={`library-item ${compact ? 'compact' : ''} ${list ? 'list' : ''}`}
  data-active={isActive ? 'true' : 'false'}
  title={station.name}
  onClick={() => onOpen(station)}
  onContextMenu={(e) => {
    e.preventDefault()
    e.stopPropagation()      
    onItemContextMenu?.(e, station)
  }}
  onKeyDown={(e) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault()
      e.stopPropagation()          // <-- and here too
      const r = e.currentTarget.getBoundingClientRect()
      onItemContextMenu?.({ clientX: r.left, clientY: r.bottom + 6 }, station)
    }
  }}
>

      <div className="thumb-wrap">
        <img
          loading="lazy"
          src={station.imgUrl || '/img/unnamed-song.png'}
          alt={station.name}
        />
        <button
          type="button"
          className="play-button"
          onClick={(e) => { e.stopPropagation(); onPlay(station, { isActive }) }}
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
      </div>

      <div className="meta">
        <p className="name">{station.name}</p>
        {!compact && !list && <p className="sub">{metaText}</p>}
        {list && (
          <p className="sub">{metaText}</p> 
        )}
      </div>
    </div>
  )
}
