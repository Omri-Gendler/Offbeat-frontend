import { useState, useEffect } from 'react'
import { youtubeService } from '../services/youtube.service'
import { SongRow } from './SongRow'

export function SearchResults({ searchTerm }) {
    const [songs, setSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

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

    return (
        <div className="search-results">
            <div className="results-header">
                <h2>Search results for "{searchTerm}"</h2>
                <p>{songs.length} songs found</p>
            </div>

            <div className="songs-grid">
                {songs.map((song, index) => (
                    <SongRow 
                        key={song.id} 
                        song={song} 
                        index={index}
                        showGenre={true}
                    />
                ))}
            </div>
        </div>
    )
}