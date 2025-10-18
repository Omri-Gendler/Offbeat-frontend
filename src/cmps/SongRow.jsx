import React from 'react'
import { IconPlay24, IconPause24, IconKebab16, IconAddCircle24 } from './Icon.jsx'



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

/**
 * Props:
 * - variant: 'station' | 'picker' (default 'station')
 * - idx, song, isActive, isPlaying, onPlayToggle   (both variants)
 * - isInStation, onAdd                              (picker only)
 */
export function SongRowBase({
  idx,
  song,
  isActive,
  isPlaying,
  onPlayToggle,
  variant = 'station',
  isInStation = false,
  onAdd,
}) {
  const pressed = isActive && isPlaying
  const isPicker = variant === 'picker'
 

  return (
    <li
      className={`row ${isPicker ? 'row--picker' : ''} ${isActive ? 'is-active' : ''} ${isPlaying && isActive ? 'is-playing' : ''}`}
      role="row"
      aria-rowindex={idx + 2}
    >
      <div className="song-list-row">
        {/* # / Play */}
        <div className="cell index flex" role="gridcell" aria-colindex={1}>
          <div className="index-inner">
                               
              <button
                type="button"
                className={`play-btn ${isActive ? 'is-active' : ''}`}
                aria-pressed={pressed}
                aria-label={pressed ? `Pause ${song.title}` : `Play ${song.title}`}
                onClick={() => onPlayToggle?.(song)}
                tabIndex={-1}
              >
                {pressed ? <IconPause24 /> : <IconPlay24 />}

            </button>
            
            <span className="index-number">{idx + 1}</span>
          </div>
        </div>

        {/* Title */}
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
              </div>
            )}
          </div>
        </div>

        {/* Album */}
        <div className="cell album" role="gridcell" aria-colindex={3}>
          {song.album ? (
            <a className="standalone-ellipsis-one-line" tabIndex={-1}>{song.album}</a>
          ) : (
            <span className="standalone-ellipsis-one-line">—</span>
          )}
        </div>

        {/* Date added (hidden in picker, keeps column space) */}
        <div
          className="cell added"
          role="gridcell"
          aria-colindex={4}
          aria-hidden={isPicker}
        >
          {!isPicker && (
            <span className="subdued standalone-ellipsis-one-line">
              {formatAdded(song.addedAt)}
            </span>
          )}
        </div>

        {/* Right column */}
        <div className="cell duration" role="gridcell" aria-colindex={5} aria-label="Duration">
          {isPicker ? (
            <>
              <button
                className="btn-icon add-btn"
                aria-label={isInStation ? 'Already in playlist' : 'Add to playlist'}
                disabled={isInStation}
                aria-disabled={isInStation}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isInStation) onAdd?.(song)
                }}
                tabIndex={-1}
              >
                <IconAddCircle24 />
              </button>
              {song.durationMs ? (
                <div className="duration-text">{formatDuration(song.durationMs)}</div>
              ) : (
                <div className="duration-text"> </div>
              )}
            </>
          ) : (
            <>
              <div className="duration-text">{formatDuration(song.durationMs)}</div>
              <button
                className="btn-icon more-btn"
                aria-haspopup="menu"
                aria-label={`More options for ${song.title}${song.artists ? ` by ${song.artists}` : ''}`}
                tabIndex={-1}
              >
                <IconKebab16 />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export const SongRow = React.memo(SongRowBase, (prev, next) =>
  prev.idx === next.idx &&
  prev.song.id === next.song.id &&
  prev.isActive === next.isActive &&
  prev.isPlaying === next.isPlaying &&
  prev.variant === next.variant &&
  prev.isInStation === next.isInStation
)
