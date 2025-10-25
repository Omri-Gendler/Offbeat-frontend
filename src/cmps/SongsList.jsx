import { useDispatch, useSelector } from 'react-redux'
import { playContext, togglePlay } from '../store/actions/player.actions'
import { addSongToStation } from '../store/actions/station.actions'
import { SongRow } from './SongRow.jsx'
import { selectCurrentSong, selectIsPlaying } from '../store/selectors/player.selectors'
import { DurationIcon } from './Icon.jsx'
import { useMemo, useState } from 'react'



function normalize(str = '') {
  return String(str).toLowerCase().trim()
}
function scoreField(text, q, weight) {
  if (!text || !q) return 0
  const t = normalize(text)
  const s = normalize(q)
  if (!s) return 0
  let score = 0
  if (t === s) score += 6
  if (t.startsWith(s)) score += 3
  if (t.includes(s)) score += 1
  // token overlap bonus
  const tokens = s.split(/\s+/).filter(Boolean)
  for (const tok of tokens) if (t.includes(tok)) score += 1
  return score * weight
}
function scoreSong(song, q) {
  return (
    scoreField(song?.title, q, 3) +
    scoreField(song?.artists, q, 2) +
    scoreField(song?.album, q, 1)
  )
}
function getTopMatches(songs, q, maxResults = 5) {
  const query = normalize(q)
  if (!query) return []
  const withScores = songs.map(s => ({ s, sc: scoreSong(s, query) }))
  const filtered = withScores.filter(x => x.sc > 0)
  filtered.sort((a, b) => b.sc - a.sc || normalize(a.s.title).localeCompare(normalize(b.s.title)))
  return filtered.slice(0, maxResults).map(x => x.s)
}

export function SongsList({
  station,
  songs: songsOverride,
  showHeader = true,
  rowVariant = 'station',
  existingIds = new Set(),
  onAdd,
  searchQuery = '',
  maxResults = 5,
  isLiked = false,
  isExternalResults = false  // New prop to indicate external search results (like YouTube)
}) {

  const dispatch = useDispatch()
  const nowPlaying = useSelector(selectCurrentSong)
  const isPlaying = useSelector(selectIsPlaying)
  const playingId = nowPlaying?.id ?? null

  const isPicker = rowVariant === 'picker'
  const songSource = songsOverride ?? station?.songs ?? []
  const allSongs = (isExternalResults && songSource && !Array.isArray(songSource) && Array.isArray(songSource.songs))
    ? songSource.songs
    : songSource;

  const [selectedId, setSelectedId] = useState(null)
  const handleSelectRow = (song) => setSelectedId(song?.id ?? null)


  let songs = allSongs
  let showNothingYet = false
  let noMatches = false

  if (isPicker) {
    const q = normalize(searchQuery)

    if (isExternalResults) {
      // For external results (like YouTube), use them directly without filtering
      songs = allSongs.filter(s => !existingIds.has(s.id))
      showNothingYet = false
      noMatches = songs.length === 0 && q
    } else if (!q) {
      showNothingYet = true
      songs = []
    } else {
      songs = getTopMatches(allSongs, searchQuery, maxResults)
        .filter(s => !existingIds.has(s.id))
      noMatches = songs.length === 0
    }
  }
  if (isPicker && showNothingYet) {
    return (
      <div className="songs-list-content-spacing">
        <div className="songs-list-container">
          <p className="empty-msg">Start typing to search songs…</p>
        </div>
      </div>
    )
  }
  if (!songs.length) {
    return (
      <div className="songs-list-content-spacing">
        <div className="songs-list-container">
          <p className="empty-msg">
            {isPicker && noMatches ? `No results for “${searchQuery}”` : ''}
          </p>
        </div>
      </div>
    )
  }

  const handleRowPlay = (song) => {
    if (!song) return
    if (song.id === playingId) {
      togglePlay()
    } else {
      playContext({
        contextId: station?._id,
        contextType: 'station',
        tracks: station?.songs ?? songs,
        trackId: song.id,
        autoplay: true
      })
    }
  }

  const handleAddToCurrent = async (song) => {
    if (onAdd) return onAdd(song)
    if (!station?._id) return
    try {
      await addSongToStation(station._id, song)
    } catch (err) {
      console.error('Could not add song to current station', err)
    }
  }

  const handleToggleLike = async (song, nextLiked) => {
    try {
      if (onToggleLike) return onToggleLike(song, nextLiked)

      if (nextLiked) await likeSong(song)
      else await unlikeSong(song.id)
    } catch (err) {
      console.error('toggle like failed', err)
    }
  }


  const colCount = isPicker ? 4 : 5

  return (
    <div className="songs-list-container">
      <div
        role="grid"
        className="songs-list-grid"
        tabIndex={0}
        data-testid="songs-list"
        aria-colcount={colCount}
        aria-rowcount={songs.length + (showHeader ? 1 : 0)}
      >
        {showHeader &&!isPicker && (
          <div className="songs-list-header-spaceing" role="presentation">
            <div role="presentation">
              <div className="songs-list-header" role="row" aria-rowindex={1}>
                {/* Index / Play */}
                <div className="index flex" role="columnheader" aria-colindex={1} tabIndex={-1}>
                  <div className="index-icon" data-testid="column-header-context-menu">#</div>
                </div>

                {/* Title */}
                <div className="title-container flex" role="columnheader" aria-colindex={2} tabIndex={-1}>
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span className="header-item standalone-ellipsis-one-line">Title</span>
                    </div>
                  </div>
                  <div className="title-spacer header-item-spacer" />
                </div>

                {/* Album */}
                <div className="title-container flex" role="columnheader" aria-colindex={3} tabIndex={-1}>
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span className="header-item standalone-ellipsis-one-line">Album</span>
                    </div>
                  </div>
                  <div className="album-spacer header-item-spacer" />
                </div>

                {/* Date added */}
                <div className="title-container date-added-container flex" role="columnheader" aria-colindex={4} tabIndex={-1}>
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span className="header-item standalone-ellipsis-one-line">Date added</span>
                    </div>
                  </div>
                  <div className="date-added-spacer header-item-spacer" />
                </div>

                {/* Duration column — hidden in picker */}
                {!isPicker && (
                  <div className="duration-container title-container flex" role="columnheader" aria-colindex={5} tabIndex={-1}>
                    <div data-testid="column-header-context-menu">
                      <div className="column-header-item duration flex" aria-label="Duration">
                        <DurationIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ul className="songs-list" role="rowgroup">
          {songs.map((song, idx) =>
            isPicker ? (
              <SongRow
                variant="picker"
                key={song.id}
                idx={idx}
                song={song}
                onPlayToggle={handleRowPlay}
                isActive={playingId === song.id}
                isPlaying={isPlaying}
                isInStation={existingIds.has(song.id)}
                onAdd={handleAddToCurrent}
              />
            ) : (
              <SongRow
                key={song.id}
                idx={idx}
                song={song}
                variant="station"
                isActive={playingId === song.id}
                isPlaying={isPlaying}
                onPlayToggle={handleRowPlay}
              />
            )
          )}
        </ul>
      </div>
    </div>
  )
}
