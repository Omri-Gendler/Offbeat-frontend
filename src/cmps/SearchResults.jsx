import { useState, useEffect } from 'react'
import { youtubeService } from '../services/youtube.service'
import { IconPlay24, IconAddCircle24 } from './Icon'

export function SearchResults({ searchTerm }) {
    const [songs, setSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('All')

    const filters = ['All', 'Artists', 'Playlists', 'Songs', 'Albums', 'Profiles', 'Podcasts & Shows']

    useEffect(() => {
        if (!searchTerm?.trim()) {
            setSongs([])
            return
        }

        searchSongs()
    }, [searchTerm])

    async function searchSongs() {
        try {
            setIsLoading(true)
            setError(null)
            const results = await youtubeService.searchSongs(searchTerm)
            setSongs(results)
        } catch (err) {
            console.error('Search failed:', err)
            setError('Failed to search songs. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!searchTerm?.trim()) {
        return (
            <div className="search-results empty">
                <h2>Search for music</h2>
                <p>Find songs, artists, and more</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="search-results loading">
                <h2>Searching...</h2>
                <div className="loading-spinner"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="search-results error">
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={searchSongs}>Try again</button>
            </div>
        )
    }

    const topResult = songs[0]
    const songsList = songs.slice(1, 5) // Show top 4 songs
    const featuringList = songs.slice(5, 7) // Show 2 featured items

    return (
        <div className="search-container">
            {/* Filter Tabs */}
            <div className="search-filters">
                {filters.map(filter => (
                    <button
                        key={filter}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Main Search Results */}
            <div className="search-results">
                {/* Top Result */}
                {topResult && (
                    <div className="top-result">
                        {topResult.imgUrl && (
                            <img src={topResult.imgUrl} alt={topResult.title} />
                        )}
                        <h2>{topResult.title}</h2>
                        <p>Artist</p>
                        <button className="play-btn" aria-label="Play">
                            <IconPlay24 />
                        </button>
                    </div>
                )}

                {/* Songs Section */}
                <div className="songs-section">
                    <h2>Songs</h2>
                    <div className="songs-list">
                        {songsList.map((song, index) => (
                            <div key={song.id} className="song-item">
                                {song.imgUrl && (
                                    <img src={song.imgUrl} alt={song.title} />
                                )}
                                <div className="song-info">
                                    <h3 className="song-title">{song.title}</h3>
                                    <p className="song-artist">{song.artists}</p>
                                </div>
                                <div className="song-actions">
                                    <button className="add-btn" aria-label="Add to playlist">
                                        <IconAddCircle24 />
                                    </button>
                                </div>
                                <span className="song-duration">{formatDuration(Math.floor(Math.random() * 240) + 60)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featuring Section */}
            {featuringList.length > 0 && (
                <div className="featuring-section">
                    <h2>Featuring {searchTerm}</h2>
                    <div className="featuring-grid">
                        {featuringList.map((item, index) => (
                            <div key={item.id} className="featuring-card">
                                {item.imgUrl && (
                                    <img src={item.imgUrl} alt={item.title} />
                                )}
                                <h3>{item.title}</h3>
                                <p>By {item.artists}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}