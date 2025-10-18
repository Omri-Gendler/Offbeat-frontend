// PickerSongRow.jsx
export function PickerSongRow({ idx, song, isInStation = false, onAdd }) {
  return (
    <li
      className="song-list-row row"     // <-- match your CSS
      role="row"
      aria-rowindex={idx + 2}
    >
      <div className="cell index" role="gridcell" aria-colindex={1}>
        <div className="index-inner">
          <button className="play-btn" aria-label="Play preview" tabIndex={-1}>
            {/* optional icon */}
          </button>
          <span className="index-number">{idx + 1}</span>
        </div>
      </div>

      <div className="cell title" role="gridcell" aria-colindex={2}>
        <img src={song.imgUrl} alt="" width={40} height={40} />
        <div className="song-meta">
          <a className="track-link">
            <span className="title">{song.title}</span>
          </a>
          <div className="artists">
            {song.artists || 'Unknown artist'}{song.album ? ` • ${song.album}` : ''}
          </div>
        </div>
      </div>

      <div className="cell album" role="gridcell" aria-colindex={3}>
        <span>{song.album || '—'}</span>
      </div>


      <div className="cell duration" role="gridcell" aria-colindex={5}>
        <button
          className="btn-add"
          disabled={isInStation}
          aria-disabled={isInStation}
          onClick={(e) => { e.stopPropagation(); if (!isInStation) onAdd?.(song) }}
        >
          {isInStation ? 'Added' : 'Add'}
        </button>
      </div>
    </li>
  )
}
