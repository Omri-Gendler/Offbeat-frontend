import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { youtubeService } from '../services/youtube.service'
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
  const [accessToken, setAccessToken] = useState('')
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

  // Spotify token
  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'grant_type=client_credentials' +
        '&client_id=' + import.meta.env.VITE_SPOTIFY_API_KEY +
        '&client_secret=' + import.meta.env.VITE_SPOTIFY_API_KEY_SECRET,
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(res => res.json())
      .then(data => {
        console.log('✅ Spotify access token obtained')
        setAccessToken(data.access_token)
      })
      .catch(err => {
        console.error('❌ Error getting Spotify access token:', err)
      })
  }, [])

  // Trigger search
  useEffect(() => {
    if (!searchTerm?.trim()) {
      setAllSongs([])
      setAllArtists([])
      setSpotifyResults({ tracks: [], artists: [] })
      return
    }
    if (accessToken) searchSongs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, accessToken])

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
    if (!accessToken) {
      console.log('⏳ Waiting for Spotify access token...')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      console.log('🔍 Searching Spotify + YouTube:', searchTerm)

      const spotifySearchParams = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }

      const [spotifyTracksResponse, spotifyArtistsResponse, youtubeResults] = await Promise.all([
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=20&market=US`, spotifySearchParams),
        fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist&limit=15`, spotifySearchParams),
        youtubeService.searchSongs(searchTerm).catch(err => {
          console.warn('⚠️ YouTube search failed:', err)
          return { songs: [], artists: [] }
        })
      ])

      const [spotifyTracks, spotifyArtists] = await Promise.all([
        spotifyTracksResponse.json(),
        spotifyArtistsResponse.json()
      ])

      console.log('📊 Spotify tracks:', spotifyTracks.tracks?.items?.length || 0)
      console.log('📊 Spotify artists:', spotifyArtists.artists?.items?.length || 0)
      console.log('📊 YouTube results:', youtubeResults.songs?.length || 0)

      // Map Spotify tracks
      const processedSpotifyTracks = spotifyTracks.tracks?.items?.map(track => ({
        id: track.id,
        type: 'song',
        title: track.name,
        artist: track.artists?.[0]?.name || 'Unknown Artist',
        artists: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
        album: track.album?.name || 'Unknown Album',
        durationMs: track.duration_ms || 0,
        imgUrl: track.album?.images?.[0]?.url || track.album?.images?.[1]?.url,
        url: track.external_urls?.spotify,
        previewUrl: track.preview_url,
        isSpotify: true,
        spotifyId: track.id,
        addedAt: Date.now(),
        youtubeMatch: findBestYouTubeMatch(track, youtubeResults.songs || [])
      })) || []

      // Map Spotify artists
      const processedSpotifyArtists = spotifyArtists.artists?.items?.map(artist => ({
        id: artist.id,
        type: 'artist',
        title: artist.name,
        imgUrl: artist.images?.[0]?.url || artist.images?.[1]?.url,
        followers: artist.followers?.total || 0,
        genres: artist.genres || [],
        popularity: artist.popularity || 0,
        url: artist.external_urls?.spotify,
        isSpotify: true,
        spotifyId: artist.id
      })) || []

      // Build hybrid songs (Spotify metadata + YouTube id)
      const hybridSongs = []
      const usedYouTubeIds = new Set()

      for (const sp of processedSpotifyTracks) {
        if (sp.youtubeMatch) {
          const yt = sp.youtubeMatch
          hybridSongs.push({
            id: yt.id,
            youtubeVideoId: yt.youtubeVideoId || yt.id,
            isYouTube: true,
            url: yt.url,
            type: 'song',

            title: sp.title,
            artist: sp.artist,
            artists: sp.artists,
            album: sp.album,
            imgUrl: sp.imgUrl || yt.imgUrl,
            durationMs: sp.durationMs || yt.durationMs,
            previewUrl: sp.previewUrl,

            isSpotify: true,
            isHybrid: true,
            spotifyId: sp.spotifyId,
            spotifyUrl: sp.url,

            genre: yt.genre,
            _original: yt._original,

            addedAt: Date.now()
          })
          usedYouTubeIds.add(yt.id)
        }
      }

      // Add remaining YouTube-only songs
      const remainingYouTubeSongs = (youtubeResults.songs || []).filter(song => !usedYouTubeIds.has(song.id))
      hybridSongs.push(...remainingYouTubeSongs.map(song => ({
        ...song,
        isHybrid: true,
        isSpotifyEnriched: false
      })))

      // Combine artists (Spotify first, then YouTube uniques)
      const combinedArtists = [
        ...processedSpotifyArtists,
        ...(youtubeResults.artists || []).filter(ytArtist =>
          !processedSpotifyArtists.some(spArtist =>
            spArtist.title.toLowerCase() === ytArtist.title.toLowerCase()
          )
        )
      ]

      // De-dup results by id
      const dedupSongs = uniqBy(hybridSongs, s => s.id)
      const dedupArtists = uniqBy(combinedArtists, a => a.id)

      setSpotifyResults({ tracks: processedSpotifyTracks, artists: processedSpotifyArtists })
      setAllSongs(dedupSongs)
      setAllArtists(dedupArtists)

      console.log('✅ Hybrid search complete:', {
        hybridSongs: dedupSongs.length,
        allArtists: dedupArtists.length,
        displayedSongs: dedupSongs.slice(0, 4).length,
        activeFilter
      })
    } catch (err) {
      console.error('❌ Search failed:', err)
      setError(`Failed to search: ${err.message}. Check console for details.`)
    } finally {
      setIsLoading(false)
    }
  }

  function findBestYouTubeMatch(spotifyTrack, youtubeTracks) {
    const spotifyTitle = (spotifyTrack?.name || '').toLowerCase()
    const spotifyArtist = (spotifyTrack?.artists?.[0]?.name || '').toLowerCase()

    let bestMatch = null
    let bestScore = 0

    for (const yt of youtubeTracks || []) {
      const ytTitle = (yt.title || '').toLowerCase()
      const ytArtistRaw = yt.artist ?? yt.artists ?? ''
      const ytArtist = Array.isArray(ytArtistRaw) ? ytArtistRaw.join(', ') : ytArtistRaw
      const ytArtistLc = (ytArtist || '').toLowerCase()

      let score = 0
      if (ytTitle.includes(spotifyTitle) || spotifyTitle.includes(ytTitle)) score += 50
      if (ytArtistLc.includes(spotifyArtist) || spotifyArtist.includes(ytArtistLc)) score += 30

      const spotifyWords = `${spotifyTitle} ${spotifyArtist}`.split(/\s+/)
      const youtubeWords = `${ytTitle} ${ytArtistLc}`.split(/\s+/)
      const common = spotifyWords.filter(w => w.length > 2 && youtubeWords.some(yw => yw.includes(w) || w.includes(yw)))
      score += common.length * 5

      if (ytTitle.length < 100) score += 10
      const avoid = ['cover','remix','live','acoustic','karaoke']
      if (avoid.some(k => ytTitle.includes(k))) score -= 20

      if (score > bestScore && score > 30) {
        bestScore = score
        bestMatch = yt
      }
    }
    return bestMatch
  }

  async function loadMoreArtists() {
    if (isLoadingMore || !accessToken) return

    try {
      setIsLoadingMore(true)

      const spotifySearchParams = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist&limit=20&offset=${allArtists.filter(a => a.isSpotify).length}`,
        spotifySearchParams
      )
      const data = await response.json()

      if (data.artists?.items?.length > 0) {
        const newArtists = data.artists.items.map(artist => ({
          id: artist.id,
          type: 'artist',
          title: artist.name,
          imgUrl: artist.images?.[0]?.url || artist.images?.[1]?.url,
          followers: artist.followers?.total || 0,
          genres: artist.genres || [],
          popularity: artist.popularity || 0,
          url: artist.external_urls?.spotify,
          isSpotify: true,
          spotifyId: artist.id
        }))

        const existingIds = new Set(allArtists.map(a => a.id))
        const filteredNewArtists = newArtists.filter(a => !existingIds.has(a.id))

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
