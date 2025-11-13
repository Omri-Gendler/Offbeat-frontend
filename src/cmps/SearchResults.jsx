import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { spotifyService } from '../services/spotify.service'
import { offlineSearchService } from '../services/offline-search.service'
import { IconPlay24, IconPause24 } from './Icon'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { SearchResultSongRow } from './SearchResultSongRow.jsx'
import { playContext, togglePlay } from '../store/actions/player.actions'
import { selectCurrentSong } from '../store/selectors/player.selectors'

export function SearchResults({ searchTerm }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Normalize query -> stable context id for this screen
  const normalizedQuery = useMemo(
    () => (searchTerm || '').trim().toLowerCase(),
    [searchTerm]
  )
  const searchContextId = useMemo(
    () => `search:${normalizedQuery}`,
    [normalizedQuery]
  )

  const [allSongs, setAllSongs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [allArtists, setAllArtists] = useState([])
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [displayedArtistsCount, setDisplayedArtistsCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [spotifyResults, setSpotifyResults] = useState({ tracks: [], artists: [] })

  const currentPlayingSong = useSelector(selectCurrentSong)
  const { isPlaying = false, contextId, contextType } =
    useSelector(s => s.playerModule || {}, shallowEqual)

  const isCurrentSearchContext =
    contextType === 'search' && contextId === searchContextId

  const getAllSongsIndex = useCallback(
    (song) => allSongs.findIndex(s => s.id === song.id),
    [allSongs]
  )

  const filters = ['All', 'Artists', 'Playlists', 'Songs', 'Albums']

  // Trigger search when search term changes
  useEffect(() => {
    console.log('🔄 Search effect triggered. searchTerm:', searchTerm)
    if (!searchTerm?.trim()) {
      console.log('🔍 No search term, showing default results')
      // Show some default results instead of empty
      loadDefaultResults()
      return
    }
    searchSongs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  async function loadDefaultResults() {
    try {
      setIsLoading(true)
      console.log('📦 Loading default results...')
      
      // Get some default content to show
      const defaultResults = await offlineSearchService.searchAll('', 8)
      
      setAllSongs(defaultResults.songs || [])
      setAllArtists(defaultResults.artists || [])
      setSpotifyResults({ tracks: [], artists: [] })
      
      console.log('✅ Default results loaded:', {
        songs: defaultResults.songs?.length || 0,
        artists: defaultResults.artists?.length || 0
      })
    } catch (err) {
      console.error('❌ Failed to load default results:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const displayedArtists = useMemo(() => {
    if (activeFilter === 'All' || activeFilter === 'Artists') return allArtists
    return []
  }, [allArtists, activeFilter])

  const displayedSongs = useMemo(() => {
    if (activeFilter === 'All' || activeFilter === 'Songs') return allSongs
    return []
  }, [allSongs, activeFilter])

  // Helper: uniq by key
  const uniqBy = (arr, keyFn) => {
    const seen = new Set()
    return arr.filter(item => {
      const k = keyFn(item)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }

  async function searchSongs() {
    try {
      setIsLoading(true)
      setError(null)
      console.log('🔍 Searching with offline-capable services:', searchTerm)
      
      // Check if we're in offline mode
      const isOffline = offlineSearchService.isOfflineMode()
      console.log('🌐 Offline mode:', isOffline)

      // Use our offline-capable services
      const [spotifyResults, offlineResults] = await Promise.all([
        spotifyService.searchAll(searchTerm, 20).catch(err => {
          console.warn('⚠️ Spotify search failed, using offline fallback:', err.message)
          return { songs: [], artists: [] }
        }),
        offlineSearchService.searchAll(searchTerm, 10).catch(err => {
          console.warn('⚠️ Offline search failed:', err.message)
          return { songs: [], artists: [] }
        })
      ])

      console.log('📊 Search results breakdown:')
      console.log('   - Spotify:', spotifyResults.songs?.length || 0, 'songs,', spotifyResults.artists?.length || 0, 'artists')
      console.log('   - Offline:', offlineResults.songs?.length || 0, 'songs,', offlineResults.artists?.length || 0, 'artists')

      // Combine and deduplicate results
      const allSongsFound = [
        ...(spotifyResults.songs || []),
        ...(offlineResults.songs || [])
      ]

      const allArtistsFound = [
        ...(spotifyResults.artists || []),
        ...(offlineResults.artists || [])
      ]

      console.log('📦 Before deduplication:', allSongsFound.length, 'songs,', allArtistsFound.length, 'artists')

      // De-dup results by id and title
      const dedupSongs = uniqBy(allSongsFound, s => s.id)
      const dedupArtists = uniqBy(allArtistsFound, a => a.id || a.title?.toLowerCase())

      console.log('📦 After deduplication:', dedupSongs.length, 'songs,', dedupArtists.length, 'artists')

      setSpotifyResults({ 
        tracks: spotifyResults.songs || [], 
        artists: spotifyResults.artists || [] 
      })
      setAllSongs(dedupSongs)
      setAllArtists(dedupArtists)

      console.log('✅ Search complete:', {
        totalSongs: dedupSongs.length,
        totalArtists: dedupArtists.length,
        activeFilter,
        displayedSongs: dedupSongs.slice(0, 4).length
      })
    } catch (err) {
      console.error('❌ Search failed:', err)
      setError(`Search failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }



  async function loadMoreArtists() {
    if (isLoadingMore) return

    try {
      setIsLoadingMore(true)

      // Try to load more from our services
      const results = await spotifyService.searchArtists(searchTerm, 20, allArtists.filter(a => a.isSpotify).length)
        .catch(() => offlineSearchService.searchArtists(searchTerm, 20))

      if (results.artists?.length > 0) {
        const existingIds = new Set(allArtists.map(a => a.id))
        const filteredNewArtists = results.artists.filter(a => !existingIds.has(a.id))

        if (filteredNewArtists.length > 0) {
          setAllArtists(prev => [...prev, ...filteredNewArtists])
          setDisplayedArtistsCount(prev => prev + 6)
        }
      }
    } catch (err) {
      console.error('❌ Failed to load more artists:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const getRepSongForArtist = useCallback((artist) => {
    if (!artist) return null
    const name = (artist.title || artist.name || '').toLowerCase()
    return allSongs.find(s =>
      (s.artist || s.artists || '').toLowerCase().includes(name)
    ) || null
  }, [allSongs])

  function handlePlaySong(song) {
    if (!song) return
    const indexToPlay = Math.max(0, getAllSongsIndex(song))
    const context = {
      contextId: searchContextId,     // must match our context checks
      contextType: 'search',
      tracks: allSongs,
      index: indexToPlay,
      autoplay: true
    }
    // If your actions self-dispatch, this is fine; otherwise use: dispatch(playContext(context))
    playContext(context)
  }

  const handlePlayPauseClick = (song) => {
    const isThisSongPlaying =
      !!(currentPlayingSong && currentPlayingSong.id === song.id) &&
      isCurrentSearchContext
    if (isThisSongPlaying) togglePlay()
    else handlePlaySong(song)
  }

  function formatDuration(ms) {
    if (!ms) return '0:00'
    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function handleArtistClick(artist) {
    const artistName = artist.title || artist.name
    navigate(`/search/${encodeURIComponent(artistName)}`)
    console.log('Navigate to search for artist:', artistName)
  }

  // Show default content when no search term
  if (!searchTerm?.trim()) {
    if (isLoading) {
      return (
        <div className="search-results loading">
          <h2>Loading music...</h2>
          <div className="spotify-loading-dots-big">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )
    }
    
    // Show default results if we have any
    if (allSongs.length > 0 || allArtists.length > 0) {
      // Fall through to show the normal results
    } else {
      return (
        <div className="search-results empty">
          <h2>Discover Music</h2>
          <p>Search for songs, artists, and albums</p>
          <p className="search-hint">Try searching for "The Weeknd", "Shape of You", or any artist name</p>
        </div>
      )
    }
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

        {/* Loading UI */}
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
        {topResultArtist && (() => {
          const repSong = getRepSongForArtist(topResultArtist)
          const isThisPlaying = !!(
            repSong &&
            isPlaying &&
            isCurrentSearchContext &&
            currentPlayingSong?.id === repSong.id
          )

          return (
            <div className="top-result-section">
              <div className="top-result-header-section">
                <span className="section-title-youtube">Top result</span>
              </div>

              <div
                className="top-result"
                onClick={() => handleArtistClick(topResultArtist)}
                style={{ cursor: 'pointer' }}
              >
                {topResultArtist.imgUrl && (
                  <img src={topResultArtist.imgUrl} alt={topResultArtist.title} />
                )}
                <div className='artist-title-results'>{topResultArtist.title}</div>
                <p>Artist</p>

                <button
                  className="play-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!repSong) return
                    handlePlayPauseClick(repSong)   // pass a SONG
                  }}
                  aria-label={isThisPlaying ? 'Pause' : 'Play'}
                >
                  {isThisPlaying ? <IconPause24 /> : <IconPlay24 />}
                </button>
              </div>
            </div>
          )
        })()}

        {/* Songs Section */}
        {displayedSongs.length > 0 && (
          <div className="songs-section">
            <h2>Songs</h2>
            <div className="songs-table">
              <div className="songs-table-body">
                {songsList.map((song, index) => {
                  const isThisSongPlaying =
                    isPlaying &&
                    isCurrentSearchContext &&
                    currentPlayingSong?.id === song.id

                  return (
                    <SearchResultSongRow
                      key={`song-${searchContextId}-${song.id}-${index}`}
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
        )}
      </div>

      {/* Artists Section */}
      {displayedArtists.length > 0 && (
        <div className="artists-section">
          <h2 className="section-title">Artists</h2>
          <div className="artists-grid">
            {displayedArtists.slice(0, displayedArtistsCount).map((artist, index) => (
              <div
                key={`artist-${searchContextId}-${artist.id}-${index}`}
                className="artist-card"
                onClick={() => handleArtistClick(artist)}
                style={{ cursor: 'pointer' }}
              >
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
          <span className="section-title">Featuring {searchTerm}</span>
          <div className="featuring-grid">
            {featuringList.map((item, index) => (
              <div key={`feat-${searchContextId}-${item.id}-${index}`} className="featuring-card">
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
