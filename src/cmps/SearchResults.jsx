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

    const [allSongs, setAllSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [allArtists, setAllArtists] = useState([])
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('All')
    const [displayedArtistsCount, setDisplayedArtistsCount] = useState(6)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const { queue = [], index = 0, isPlaying = false } = useSelector(
        s => s.playerModule || {},
        shallowEqual
    )

    const dispatch = useDispatch()

    const filters = ['All', 'Artists', 'Playlists', 'Songs', 'Albums']

    useEffect(() => {
        if (!searchTerm?.trim()) {
            setAllSongs([])
            setAllArtists([])
            return
        }

        searchSongs()
    }, [searchTerm])

    const displayedArtists = useMemo(() => {
        if (activeFilter === 'All' || activeFilter === 'Artists') {
            return allArtists
        }
        return []
    }, [allArtists, activeFilter, searchTerm])

    const displayedSongs = useMemo(() => {
        if (activeFilter === 'All' || activeFilter === 'Songs') {
            return allSongs
        }
        return []
    }, [allSongs, activeFilter, searchTerm])

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
            setAllArtists(results.artists || [])
            setAllSongs(results.songs || [])
        } catch (err) {
            setError(`Failed to search songs: ${err.message}. Check console for details.`)
        } finally {
            setIsLoading(false)
        }
    }

    async function loadMoreArtists() {
        if (isLoadingMore) return

        try {
            setIsLoadingMore(true)

            // Search for more artists specifically
            const moreResults = await youtubeService.searchArtists(searchTerm, allArtists.length)

            if (moreResults.artists && moreResults.artists.length > 0) {
                setAllArtists(prev => [...prev, ...moreResults.artists])
                setDisplayedArtistsCount(prev => prev + 6)
            }
        } catch (err) {
            console.error('❌ Failed to load more artists:', err)
        } finally {
            setIsLoadingMore(false)
        }
    }

    function handlePlaySong(song, songIndex = 0) {
        if (!song) return

        const context = {
            contextId: `search-${searchTerm}`,
            contextType: 'search',
            tracks: allSongs, // Full search results as queue
            index: songIndex, // Which song in the queue to play
            autoplay: true
        }

        playContext(context)
    }

    const handlePlayPauseClick = (songInList, songIndexInList) => {
        const isThisSongPlaying = currentPlayingSong?.id === songInList.id

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

                {/* Loading Animation */}
                <div className="spotify-loading-container">
                    <div className="spotify-loading-content">
                        <h2>Searching...</h2>
                        <div className="spotify-loading-dots-big">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>

                    {/* Loading Skeleton */}
                    <div className="search-content-grid loading-skeleton">
                        <div className="top-result-skeleton">
                            <h2 className="section-title-youtube">Top result</h2>
                            <div className="skeleton-card">
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-text">
                                    <div className="skeleton-line skeleton-title"></div>
                                    <div className="skeleton-line skeleton-subtitle"></div>
                                </div>
                            </div>
                        </div>

                        <div className="songs-skeleton">
                            <h2 className="section-title">Songs</h2>
                            <div className="skeleton-songs-list">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="skeleton-song-row">
                                        <div className="skeleton-song-img"></div>
                                        <div className="skeleton-song-info">
                                            <div className="skeleton-line skeleton-song-title"></div>
                                            <div className="skeleton-line skeleton-song-artist"></div>
                                        </div>
                                        <div className="skeleton-duration"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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

    const topResultArtist = displayedArtists[0]
    const songsList = displayedSongs.slice(0, 4)
    const featuringList = allSongs.slice(5, 7)

    return (
        <div className="search-container-youtube">
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
                {topResultArtist && (
                    <div className="top-result">
                        {topResultArtist.imgUrl && (
                            <img src={topResultArtist.imgUrl} alt={topResultArtist.title} />
                        )}
                        <h2>{topResultArtist.title}</h2>
                        <p>Artist</p>
                        <button
                            className="play-btn"
                            // aria-label={isPlaying && currentPlayingSong?.id === topResultArtist.id ? "Pause" : "Play"}
                            onClick={() => handlePlayPauseClick(topResultArtist, 0)}
                        >
                            {isPlaying && currentPlayingSong?.id === topResultArtist.id ? (
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
                        {/* <div className="songs-table-header"> */}
                        {/* <div className="col-index">#</div>
                            <div className="col-title">Title</div>
                            <div className="col-album">Album</div>
                            <div className="col-date">Date added</div> */}
                        <div className="col-duration">
                            {/* <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
                                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" fill="currentColor"></path>
                                    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" fill="currentColor"></path>
                                </svg> */}
                        </div>
                        {/* </div> */}

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

            {/* Artists Section */}
            {(() => {
                return displayedArtists.length > 0
            })() && (
                    <div className="artists-section">
                        <h2 className="section-title">Artists</h2>
                        <div className="artists-grid">
                            {displayedArtists.slice(0, displayedArtistsCount).map((artist, index) => (
                                <div key={artist.id} className="artist-card">
                                    <div className="artist-image-container">
                                        {artist.imgUrl && (
                                            <img src={artist.imgUrl} alt={artist.title} />
                                        )}
                                    </div>
                                    <div className="artist-info">
                                        <h3>{artist.title}</h3>
                                        <p>Artist</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {allArtists.length > displayedArtistsCount && (
                            <div className="load-more-container">
                                <button
                                    className="load-more-btn"
                                    onClick={loadMoreArtists}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="mini-spinner"></div>
                                            Loading more...
                                        </>
                                    ) : (
                                        'Show more artists'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

            {/* Featuring Section */}
            {featuringList.length > 0 && (
                <div className="featuring-section">
                    <h2 className="section-title">Featuring {searchTerm}</h2>
                    <div className="featuring-grid">
                        {featuringList.map((item, index) => (
                            <div key={item.id} className="featuring-card">
                                {item.imgUrl && (
                                    <img src={item.imgUrl} alt={item.title} />
                                )}
                                <div className="featuring-card-content">
                                    <h3>{item.title}</h3>
                                    <p>By {item.artists}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}