import { ArtistPreview } from './ArtistPreview'

export function ArtistList({ artists, onPlayArtist }) {
    if (!artists || artists.length === 0) {
        return <div className="artist-list-empty">No artists found</div>
    }

    return (
        <div className="artist-list">
            {artists.map(artist => (
                <ArtistPreview
                    key={artist.id}
                    artist={artist}
                    onPlayArtist={onPlayArtist}
                />
            ))}
        </div>
    )
}