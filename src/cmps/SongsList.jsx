import { SongPreview } from './SongPreview.jsx'

export function SongsList({ station }) {
    return (
        <section className="songs-list">
            <ul className="songs-list">
                {station.songs.map(song =>
                    <li key={song.id}>
                        <SongPreview song={song} /> 
                    </li>
                )}
            </ul>
        </section>
    )
}
