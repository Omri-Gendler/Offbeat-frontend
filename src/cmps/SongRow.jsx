import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { likeSong, unlikeSong } from '../store/actions/station.actions'
import { IconPlay24, IconPause24, IconKebab16, IconAddCircle24, IconCheckCircle24 ,Equalizer} from './Icon.jsx'
import { selectIsSongLiked } from '../store/selectors/player.selectors'


function formatDuration(ms) {
  if (typeof ms !== 'number') return ''
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatAdded(ts, { locale = navigator.language, thresholdWeeks = 3 } = {}) {
  if (!ts) return ''
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  const weeks = Math.floor(days / 7)
  if (weeks > thresholdWeeks) {
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
  }
  if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days  >= 1) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hrs   >= 1) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  if (mins  >= 1) return `${mins} minute${mins > 1 ? 's' : ''} ago`
  return 'Just now'
}

export function SongRowBase({
  idx,
  song,
  isActive,
  isPlaying,
  onPlayToggle,
  variant = 'station',
  isInStation = false, 
  onAdd,              
  isLikedSongs = false,
  onAddToAnother,
  onRemoveFromStation,
  onToggleLike, 
  showGenre = false,         
}) {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const kebabRef = useRef(null)
  const firstMenuBtnRef = useRef(null)

  const pressed = isActive && isPlaying
  const isPicker = variant === 'picker'
  const showStationActions = !isPicker && !isLikedSongs
  const isLiked = useSelector(state => selectIsSongLiked(state, song?.id))

  // close on ESC
  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMenuOpen])

  // focus first item when opened
  useEffect(() => {
    if (isMenuOpen) firstMenuBtnRef.current?.focus()
  }, [isMenuOpen])

  const openMenuNearKebab = () => {
    const btn = kebabRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const offset = 8
    const desiredLeft = rect.right + offset
    const desiredTop  = rect.bottom + offset
    const panelW = 260
    const panelH = 180
    const maxLeft = window.innerWidth - panelW - 8
    const maxTop  = window.innerHeight - panelH - 8
    setMenuPos({
      left: Math.max(8, Math.min(desiredLeft, maxLeft)),
      top : Math.max(8, Math.min(desiredTop , maxTop)),
    })
    setMenuOpen(true)
  }

  const handleToggleLike = async (e) => {
    e.stopPropagation()
    if (!song?.id) return
    if (onToggleLike) return onToggleLike(song, !isLiked)
    try {
      if (!isLiked) await likeSong(song)
      else          await unlikeSong(song.id)
    } catch (err) {
      console.error('toggle like failed', err)
    }
  }

  const durationEl = (
    <div className="duration-text">
      {song?.durationMs != null ? formatDuration(song.durationMs) : '-'}
    </div>
  )

  return (
    <li
      className={`row ${isPicker ? 'row--picker' : ''} ${isActive ? 'is-active' : ''} ${isPlaying && isActive ? 'is-playing' : ''}`}
      role="row"
      aria-rowindex={idx + 2}
    >
      <div className="song-list-row">
        {/* index / play */}
     
        <div className="cell index flex" role="gridcell" aria-colindex={1}>
          <div className="index-inner">
            {/* play/pause control (hidden until hover/focus) */}
            <button
              type="button"
              className={`play-btn ${isActive ? 'is-active' : ''}`}
              aria-pressed={pressed}
              aria-label={pressed ? `Pause ${song.title}` : `Play ${song.title}`}
              onClick={() => onPlayToggle?.(song)}
              tabIndex={-1}
            >
              {pressed ? < IconPause24 className='song-pause-icon' /> : <IconPlay24 />}
            </button>

            {/* index number (default state) */}
            {!isPicker && <span className="index-number">{idx + 1}</span>}

            {/* now-playing equalizer (reusing your existing component) */}
            {isActive && isPlaying && (
              <span className="np-indicator">
                <Equalizer playing size={12} color="#1ed760" />
              </span>
            )}
          </div>
        </div>


        {/* title */}
        <div className="cell title container flex" role="gridcell" aria-colindex={2}>
          {song.imgUrl && (
            <img className="thumb" src={song.imgUrl} alt="" width={40} height={40} draggable={false} loading="eager" />
          )}
          <div className="song-meta">
            <a className="track-link standalone-ellipsis-one-line" tabIndex={-1}>
              <div className={`title ${isActive ? 'title--playing' : ''}`}>{song.title}</div>
            </a>
            {!!song.artists && (
              <div className="artists standalone-ellipsis-one-line">
                <a draggable="true" tabIndex={-1}>{song.artists}</a>
                {showGenre && song.genre && (
                  <span className="genre-tag">• {song.genre}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* album */}
        <div className="cell album" role="gridcell" aria-colindex={3}>
          {song.album ? (
            <a className="standalone-ellipsis-one-line" tabIndex={-1}>{song.album}</a>
          ) : (
            <span className="standalone-ellipsis-one-line">—</span>
          )}
        </div>

        {/* date added */}
        <div className="cell added" role="gridcell" aria-colindex={4} aria-hidden={isPicker}>
          {!isPicker && (
            <span className="subdued standalone-ellipsis-one-line">
              {formatAdded(song.addedAt)}
            </span>
          )}
        </div>

       
        <div className="cell actions" role="gridcell" aria-colindex={5} aria-label="Actions">
          {isPicker ? (
            <button
              className="btn btn-add-text"
              aria-label="Add to playlist"
              onClick={(e) => { e.stopPropagation(); onAdd?.(song) }}
              tabIndex={-1}
            >
              <span>
              Add
              </span>
            </button>
          ) : (
            <>
              {showStationActions && (
                <button
                  className="tertiary-btn add-btn"
                  aria-label={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
                  onClick={handleToggleLike}
                  tabIndex={-1}
                >
                  {isLiked ? <IconCheckCircle24 /> : <IconAddCircle24 />}
                </button>
              )}

              {/* Duration BEFORE kebab */}
              {durationEl}

              {/* Kebab LAST */}
              <button
                ref={kebabRef}
                className="more-btn"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label={`More options for ${song.title}${song.artists ? ` by ${song.artists}` : ''}`}
                onClick={(e) => { e.stopPropagation(); openMenuNearKebab() }}
                tabIndex={-1}
              >
                <IconKebab16 />
              </button>
            </>
          )}
        </div>
      </div>

      {/* anchored popover */}
      {!isPicker && isMenuOpen && (
        <>
          <div className="menu-layer" onClick={() => setMenuOpen(false)} />
          <div
            className="menu-panel"
            role="menu"
            style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={firstMenuBtnRef}
              className="menu-item"
              role="menuitem"
              onClick={() => { onAddToAnother?.(song); setMenuOpen(false) }}
            >
              Add to another station
            </button>
            <button
              className="menu-item danger"
              role="menuitem"
              onClick={() => { onRemoveFromStation?.(song); setMenuOpen(false) }}
            >
              Remove from this station
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export const SongRow = React.memo(SongRowBase, (prev, next) =>
  prev.idx === next.idx &&
  prev.song.id === next.song.id &&
  prev.isActive === next.isActive &&
  prev.isPlaying === next.isPlaying &&
  prev.variant === next.variant &&
  prev.isInStation === next.isInStation &&
  prev.isLikedSongs === next.isLikedSongs

)
