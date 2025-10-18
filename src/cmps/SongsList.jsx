// import { useDispatch, useSelector } from 'react-redux'
// import { playContext, togglePlay } from '../store/actions/player.actions'
// import { SongRow } from './SongRow.jsx'
// import { selectCurrentSong, selectIsPlaying } from '../store/selectors/player.selectors'


// import { DurationIcon, IconPlay24, IconPause24, IconAddCircle24, IconKebab16 } from './Icon.jsx'

// export function SongsList({ station }) {
//   const dispatch = useDispatch()

//   const nowPlaying = useSelector(selectCurrentSong)
//   const isPlaying = useSelector(selectIsPlaying)
//   const playingId = nowPlaying?.id ?? null

//   if (!station?.songs?.length) return <p className="empty-msg">No songs in this station yet</p>

//   const handleRowPlay = (song) => {
//     if (!song) return
//     if (song.id === playingId) {
//       togglePlay()                             // pause/resume current
//     } else {
//       playContext({                             // start this station at this song
//         contextId: station._id,
//         contextType: 'station',
//         tracks: station.songs,
//         trackId: song.id,
//         autoplay: true
//       })
//     }
//   }

//   function formatDuration(ms) {
//     if (typeof ms !== 'number') return ''
//     const m = Math.floor(ms / 60000)
//     const s = Math.floor((ms % 60000) / 1000)
//     return `${m}:${String(s).padStart(2, '0')}`
//   }

//   function formatAdded(ts, { locale = navigator.language, thresholdWeeks = 3 } = {}) {
//     if (!ts) return ''
//     const d = new Date(ts)
//     const diff = Date.now() - d.getTime()
//     const mins = Math.floor(diff / 60000)
//     const hrs = Math.floor(mins / 60)
//     const days = Math.floor(hrs / 24)
//     const weeks = Math.floor(days / 7)
//     if (weeks > thresholdWeeks) {
//       return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
//     }
//     if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
//     if (days  >= 1) return `${days} day${days > 1 ? 's' : ''} ago`
//     if (hrs   >= 1) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
//     if (mins  >= 1) return `${mins} minute${mins > 1 ? 's' : ''} ago`
//     return 'Just now'
//   }

//   return (
//     <div className="songs-list-content-spacing">
//       <div className="songs-list-container">
//         <div role="grid" className="songs-list-grid" tabIndex={0} data-testid="songs-list" aria-colcount={5}>
//           <div className="songs-list-header-spaceing" role="presentation">
//             <div role="presentation">
//               <div className="songs-list-header" role="row" aria-rowindex={1}>
//                 <div className="index flex" role="columnheader" aria-colindex={1} aria-sort="none" tabIndex={-1}>
//                   <div className="index-icon" data-testid="column-header-context-menu">#</div>
//                 </div>

//                 <div className="title-container flex" role="columnheader" aria-colindex={2} aria-sort="none" tabIndex={-1}>
//                   <div data-testid="column-header-context-menu">
//                     <div className="column-header-item flex">
//                       <span className="header-item standalone-ellipsis-one-line">Title</span>
//                     </div>
//                   </div>
//                   <div className="title-spacer header-item-spacer" />
//                 </div>

//                 <div className="title-container flex" role="columnheader" aria-colindex={3} aria-sort="none" tabIndex={-1}>
//                   <div data-testid="column-header-context-menu">
//                     <div className="column-header-item flex">
//                       <span className="header-item standalone-ellipsis-one-line">Album</span>
//                     </div>
//                   </div>
//                   <div className="album-spacer header-item-spacer" />
//                 </div>

//                 <div className="title-container date-added-container flex" role="columnheader" aria-colindex={4} aria-sort="none" tabIndex={-1}>
//                   <div data-testid="column-header-context-menu">
//                     <div className="column-header-item flex">
//                       <span className="header-item standalone-ellipsis-one-line">Date added</span>
//                     </div>
//                   </div>
//                   <div className="date-added-spacer header-item-spacer" />
//                 </div>

//                 <div className="duration-container title-container flex" role="columnheader" aria-colindex={5} aria-sort="none" tabIndex={-1}>
//                   <div data-testid="column-header-context-menu">
//                     <div className="column-header-item duration flex" aria-label="Duration">
//                       <DurationIcon />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//                <ul className="songs-list" role="rowgroup">
//         {station.songs.map((song, idx) => (
//           <SongRow
//             key={song.id}
//             idx={idx}
//             song={song}
//             isActive={playingId === song.id}
//             isPlaying={isPlaying}
//             onPlayToggle={handleRowPlay}
//           />
//         ))}
//       </ul>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useDispatch, useSelector } from 'react-redux'
import { playContext, togglePlay } from '../store/actions/player.actions'
import { SongRow } from './SongRow.jsx'
import { PickerSongRow } from './PickerSongRow.jsx'
import { selectCurrentSong, selectIsPlaying } from '../store/selectors/player.selectors'
import { DurationIcon } from './Icon.jsx'

export function SongsList({
  station,                 // { _id, songs[] }
  songs: songsOverride,    // optional: override list (e.g., in picker)
  showHeader = true,
  rowVariant = 'station',  // 'station' | 'picker'
  existingIds = new Set(), // for picker
  onAdd,                   // for picker
}) {
  const dispatch = useDispatch()
  const nowPlaying = useSelector(selectCurrentSong)
  const isPlaying = useSelector(selectIsPlaying)
  const playingId = nowPlaying?.id ?? null

  const songs = songsOverride ?? station?.songs ?? []
  if (!songs.length) return <p className="empty-msg">No songs in this station yet</p>

  const handleRowPlay = (song) => {
    if (!song) return
    if (song.id === playingId) {
      togglePlay()
    } else {
      playContext({
        contextId: station?._id,
        contextType: 'station',
        tracks: station?.songs ?? songs,  // fallback if station missing
        trackId: song.id,
        autoplay: true
      })
    }
  }

  return (
    <div className="songs-list-content-spacing">
      <div className="songs-list-container">
        <div
          role="grid"
          className="songs-list-grid"
          tabIndex={0}
          data-testid="songs-list"
          aria-colcount={5}
          aria-rowcount={songs.length + (showHeader ? 1 : 0)}
        >
          {showHeader && (
            <div className="songs-list-header-spaceing" role="presentation">
              <div role="presentation">
                <div className="songs-list-header" role="row" aria-rowindex={1}>
                  <div className="index flex" role="columnheader" aria-colindex={1} tabIndex={-1}>
                    <div className="index-icon" data-testid="column-header-context-menu">#</div>
                  </div>

                  <div className="title-container flex" role="columnheader" aria-colindex={2} tabIndex={-1}>
                    <div data-testid="column-header-context-menu">
                      <div className="column-header-item flex">
                        <span className="header-item standalone-ellipsis-one-line">Title</span>
                      </div>
                    </div>
                    <div className="title-spacer header-item-spacer" />
                  </div>

                  <div className="title-container flex" role="columnheader" aria-colindex={3} tabIndex={-1}>
                    <div data-testid="column-header-context-menu">
                      <div className="column-header-item flex">
                        <span className="header-item standalone-ellipsis-one-line">Album</span>
                      </div>
                    </div>
                    <div className="album-spacer header-item-spacer" />
                  </div>

                  <div className="title-container date-added-container flex" role="columnheader" aria-colindex={4} tabIndex={-1}>
                    <div data-testid="column-header-context-menu">
                      <div className="column-header-item flex">
                        <span className="header-item standalone-ellipsis-one-line">Date added</span>
                      </div>
                    </div>
                    <div className="date-added-spacer header-item-spacer" />
                  </div>

                  <div className="duration-container title-container flex" role="columnheader" aria-colindex={5} tabIndex={-1}>
                    <div data-testid="column-header-context-menu">
                      <div className="column-header-item duration flex" aria-label="Duration">
                        <DurationIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ul className="songs-list" role="rowgroup">
            {songs.map((song, idx) =>
              rowVariant === 'picker' ? (
                <SongRow
                  variant="picker"
                  idx={idx}
                  song={song}
                  isInStation={existingIds.has(song.id)}
                  onAdd={(s) => addSongToStation(stationId, s)}
                />
              ) : (
                <SongRow
                  key={song.id}
                  idx={idx}
                  song={song}
                  isActive={playingId === song.id}
                  isPlaying={isPlaying}
                  onPlayToggle={handleRowPlay}
                />
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

