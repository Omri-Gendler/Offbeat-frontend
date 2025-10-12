import { SongPreview } from './SongPreview.jsx'
import{ useState} from 'react'

import {DurationIcon, IconPlay24, IconPause24, IconAddCircle24, IconKebab16} from './Icon.jsx'

export function SongsList({ station }) {

  if (!station?.songs?.length) {
    return <p className="empty-msg">No songs in this station yet</p>
  }

  function formatDuration(ms) {
  if (typeof ms !== "number") return "";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatAdded(ts, { locale = navigator.language, thresholdWeeks = 3 } = {}) {
  if (!ts) return "";
  const d = new Date(ts);
  const diffMs = Date.now() - d.getTime();

  const mins  = Math.floor(diffMs / 60000);
  const hrs   = Math.floor(mins / 60);
  const days  = Math.floor(hrs / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > thresholdWeeks) {
    // e.g., "Oct 1, 2025" (locale-aware)
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }

  if (weeks >= 1) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days  >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hrs   >= 1) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (mins  >= 1) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}



  return (
    <section className="songs-list-content-spacing">
      <div className="songs-list-container">
        <div
          role="grid"
          className="songs-list-grid"
          tabIndex={0}
          data-testid="songs-list"
        >
          <div className="songs-list-header-spaceing" role="presentation">
            <div role="presentation">
              <div className="songs-list-header" role="row" aria-rowindex={1}>
                {/* # */}
                <div
                  className="index flex"
                  role="columnheader"
                  aria-colindex={1}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div className='index-icon' data-testid="column-header-context-menu">#</div>
                </div>

                {/* Title */}
                <div
                  className="title-container  flex"
                  role="columnheader"
                  aria-colindex={2}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span className="header-item standalone-ellipsis-one-line">
                        Title
                      </span>
                    </div>
                  </div>
                  <div className="title-spacer header-item-spacer"></div>
                </div>

                {/* Album */}
                <div
                  className="title-container flex"
                  role="columnheader"
                  aria-colindex={3}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span
                        className="header-item standalone-ellipsis-one-line"
                        data-encore-id="text"
                      >
                        Album
                      </span>
                    </div>
                  </div>
                  <div className="album-spacer header-item-spacer"></div>
                </div>

                {/* Date added */}
                <div
                  className="title-container date-added-container flex"
                  role="columnheader"
                  aria-colindex={4}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span
                        className="header-item standalone-ellipsis-one-line"
                        data-encore-id="text"
                      >
                        Date added
                      </span>
                    </div>
                  </div>
                  <div className="date-added-spacer header-item-spacer"></div>
                </div>

                {/* Duration (icon) */}
                <div
                  className="duration-container title-container flex"
                  role="columnheader"
                  aria-colindex={5}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu ">
                    <div className="column-header-item duration flex" aria-label="Duration">
                      <DurationIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
<ul className="songs-list" role="rowgroup">
  {station.songs.map((song, idx) => (
    <li
      key={song.id}
      className="row"
      role="row"
      aria-rowindex={idx + 2} // header is row 1
    >
      <div className="song-list-row">
        {/* # / Play */}
        <div className="cell index flex" role="gridcell" aria-colindex={1}>
          <div className="index-inner">
            <span className="index-number">{idx + 1}</span>
          <button
            className="play-btn"
            onClick={() => playSong(station._id, song.id)}
            aria-pressed={playingId === song.id && isPlaying}  
            aria-label={
              playingId === song.id && isPlaying
                ? `Pause ${song.title}${song.artists ? ` by ${song.artists}` : ""}`
                : `Play ${song.title}${song.artists ? ` by ${song.artists}` : ""}`
            }
            data-playing={playingId === song.id && isPlaying ? "true" : "false"}  
            tabIndex={-1}
          >
            {playingId === song.id && isPlaying ? (
              <IconPause24 />
            ) : (
              <IconPlay24 />
            )}
        </button>
          </div>
        </div>

        {/* Title */}
        <div className="cell title container flex" role="gridcell" aria-colindex={2}>
          {song.imgUrl && (
            <img className="thumb" src={song.imgUrl} alt="" width={40} height={40} draggable={false} loading="eager" />
          )}
          <div className="song-meta">
            <a className="track-link standalone-ellipsis-one-line" tabIndex={-1}>
              <div className="title">{song.title}</div>
            </a>
            {song.artists && (
              <div className="artists standalone-ellipsis-one-line">
                <a draggable tabIndex={-1}>{song.artists}</a>
              </div>
            )}
          </div>
        </div>

        {/* Album */}
        <div className="cell album" role="gridcell" aria-colindex={3}>
          {song.album ? <a className="standalone-ellipsis-one-line" tabIndex={-1}>{song.album}</a> : <span>—</span>}
        </div>

        {/* Date added */}
        <div className="cell added" role="gridcell" aria-colindex={4}>
          <span className="subdued standalone-ellipsis-one-line">{formatAdded(song.addedAt)}</span>
        </div>

        {/* Duration / actions */}
        <div className="cell duration" role="gridcell" aria-colindex={5} aria-label="Duration">
          <button className="btn-icon add-btn" aria-checked="true" aria-label="Add to playlist" tabIndex={-1}>
            <IconAddCircle24/>
          </button>
          <div className="duration-text">{formatDuration(song.durationMs)}</div>
          <button className="btn-icon more-btn" aria-haspopup="menu" aria-label={`More options for ${song.title}${song.artists ? ` by ${song.artists}` : ""}`} tabIndex={-1}>
            <IconKebab16/>
          </button>
        </div>
      </div>
    </li>
  ))}
</ul>

  </div>
        {/* closes .songs-list-grid */}
      </div>
      {/* closes .songs-list-container */}
    </section>
  )

}

{/* <ul className="songs-list">
  {station.songs.map((song, idx) => (
    <li key={song.id} className="song-row">
      <div className="song-index">{idx + 1}</div>
      <SongPreview song={song} />
    </li>
  ))}
</ul> */}
