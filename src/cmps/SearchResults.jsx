import { useState, useEffect, useMemo } from 'react'
import { youtubeService } from '../services/youtube.service'
import { IconPlay24, IconAddCircle24 } from './Icon'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { likeSong, unlikeSong } from '../store/actions/station.actions'
import { selectIsSongLiked } from '../store/selectors/player.selectors'
import { SearchResultSongRow } from './SearchResultSongRow.jsx'
import { playContext, togglePlay } from '../store/actions/player.actions'
import { PlayPauseButton } from './PlayPauseButton'
import PauseIcon from '@mui/icons-material/Pause'

export function SearchResults({ searchTerm }) {
    const [songs, setSongs] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('All')
    const { queue = [], index = 0, isPlaying = false } = useSelector(
        s => s.playerModule || {},
        shallowEqual
    )

    const dispatch = useDispatch()

    const filters = ['All', 'Artists', 'Playlists', 'Songs', 'Albums', 'Profiles', 'Podcasts & Shows']

    useEffect(() => {
        if (!searchTerm?.trim()) {
            setSongs([])
            return
        }

        searchSongs()
    }, [searchTerm])

    const currentPlayingSong = useMemo(() => {
        if (!queue.length) return null
        const i = Math.min(Math.max(index, 0), queue.length - 1)
        return queue[i] || null
    }, [queue, index])

    async function searchSongs() {
        try {
            setIsLoading(true)
            setError(null)
            const results = await youtubeService.searchSongs(searchTerm)
            console.log('Search results:', results)
            setSongs(results)
        } catch (err) {
            console.error('Search failed:', err)
            setError('Failed to search songs. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    function handlePlaySong(song, songIndex = 0) {
        if (!song) return
        console.log('Playing YouTube song:', song.title, 'isYouTube:', song.isYouTube, 'videoId:', song.youtubeVideoId)

        const context = {
            contextId: `search-${searchTerm}`,
            contextType: 'search',
            tracks: songs, // Full search results as queue
            index: songIndex, // Which song in the queue to play
            autoplay: true
        }

        console.log('Dispatching playContext:', context)
        playContext(context)
    }

    const handlePlayPauseClick = (songInList, songIndexInList) => {
        const isThisSongPlaying = currentPlayingSong?.id === songInList.id

        console.log('--- Play/Pause Click ---');
        console.log('Song Clicked ID:', songInList?.id);
        console.log('Current Playing ID:', currentPlayingSong?.id);
        console.log('Is this song playing?', isThisSongPlaying);
        console.log('Is player playing (global)?', isPlaying);

        if (isThisSongPlaying) {
            togglePlay()
        } else {
            handlePlaySong(songInList, songIndexInList);
        }
    }

    function formatDuration(ms) {
        if (!ms) return '0:00'
        const totalSeconds = Math.floor(ms / 1000)
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
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
                        <button
                            className="play-btn"
                            // aria-label={isPlaying && currentPlayingSong?.id === topResult.id ? "Pause" : "Play"}
                            onClick={() => handlePlayPauseClick(topResult, 0)}
                        >
                            {isPlaying && currentPlayingSong?.id === topResult.id ? (
                                <PauseIcon />
                            ) : (
                                <IconPlay24 />
                            )}
                        </button>
                    </div>
                )}

                {/* Songs Section */}
                <div className="songs-section">
                    <h2>Songs</h2>
                    <div className="songs-table">
                        {/* Table Header */}
                        <div className="songs-table-header">
                            <div className="col-index">#</div>
                            <div className="col-title">Title</div>
                            <div className="col-album">Album</div>
                            <div className="col-date">Date added</div>
                            <div className="col-duration">
                                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
                                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" fill="currentColor"></path>
                                    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" fill="currentColor"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="songs-table-body">
                            {songsList.map((song, index) => {
                                const isThisSongPlaying = isPlaying && currentPlayingSong?.id === song.id;

                                return (
                                    <SearchResultSongRow
                                        key={song.id}
                                        song={song}
                                        mapIndex={index} 
                                        isThisSongPlaying={isThisSongPlaying}
                                        handlePlayPauseClick={handlePlayPauseClick}
                                        formatDuration={formatDuration}
                                    />
                                )
                            })}
                        </div>
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