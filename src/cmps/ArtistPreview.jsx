import { useNavigate } from 'react-router-dom'
import { IconPlay24 } from './Icon'

export function ArtistPreview({ artist, onPlayArtist }) {
    const navigate = useNavigate()

    function handleArtistClick() {
        // Navigate to search page with the artist name
        const artistName = artist.title || artist.name
        navigate(`/search/${encodeURIComponent(artistName)}`)
        console.log('Navigate to search for artist:', artistName)
    }

    function handlePlayClick(ev) {
        ev.stopPropagation()
        if (onPlayArtist) {
            onPlayArtist(artist)
        }
    }

    return (
        <div className="artist-preview" onClick={handleArtistClick}>
            <div className="artist-img-container">
                <img src={artist.imgUrl} alt={artist.title} className="artist-img" />
                <button
                    className="artist-play-btn"
                    onClick={handlePlayClick}
                    aria-label={`Play ${artist.title}`}
                >
                    <IconPlay24 />
                </button>
            </div>
            <div className="artist-info">
                <h3 className="artist-name">{artist.title}</h3>
                <p className="artist-type">Artist</p>
            </div>
        </div>
    )
}