import { SongPreview } from './SongPreview.jsx'

export function SongsList({ station }) {
  if (!station?.songs?.length) {
    return <p className="empty-msg">No songs in this station yet</p>
  }

  return (
    <section className="songs-list">
      <ul className="songs-list-content">
        {station.songs.map((song, idx) => (
          <li key={song.id} className="song-row">
            <div className="song-index">{idx + 1}</div>
            <SongPreview song={song} />
          </li>
        ))}
      </ul>
    </section>
  )
}

