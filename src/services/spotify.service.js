let accessToken = null
let tokenExpiry = null

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_API_KEY
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_API_KEY_SECRET

export const spotifyService = {
    searchTracks,
    searchArtists,
    searchAlbums,
    searchAll,
    getAccessToken,
    isTokenValid
}

/**
 * Get or refresh Spotify access token
 */
async function getAccessToken() {
    // Check if current token is still valid (with 5 minute buffer)
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
        return accessToken
    }

    try {
        const authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
        }

        const response = await fetch('https://accounts.spotify.com/api/token', authParameters)
        const data = await response.json()

        if (data.access_token) {
            accessToken = data.access_token
            tokenExpiry = Date.now() + (data.expires_in * 1000) // Convert to milliseconds
            console.log('✅ Spotify access token obtained')
            return accessToken
        } else {
            throw new Error('Failed to obtain access token: ' + JSON.stringify(data))
        }
    } catch (error) {
        console.error('❌ Error getting Spotify access token:', error)
        throw error
    }
}

/**
 * Check if current token is valid
 */
function isTokenValid() {
    return accessToken && tokenExpiry && Date.now() < tokenExpiry - 300000
}

/**
 * Make authenticated request to Spotify API
 */
async function makeSpotifyRequest(url) {
    const token = await getAccessToken()
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Spotify API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return response.json()
}

/**
 * Search for tracks on Spotify
 */
async function searchTracks(query, limit = 20, offset = 0) {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${limit}&offset=${offset}&market=US`
        
        const data = await makeSpotifyRequest(url)
        
        return {
            tracks: data.tracks?.items?.map(track => ({
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
                _original: track
            })) || []
        }
    } catch (error) {
        console.error('❌ Error searching Spotify tracks:', error)
        throw error
    }
}

/**
 * Search for artists on Spotify  
 */
async function searchArtists(query, limit = 20, offset = 0) {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=artist&limit=${limit}&offset=${offset}`
        
        const data = await makeSpotifyRequest(url)
        
        return {
            artists: data.artists?.items?.map(artist => ({
                id: artist.id,
                type: 'artist',
                title: artist.name,
                imgUrl: artist.images?.[0]?.url || artist.images?.[1]?.url,
                followers: artist.followers?.total || 0,
                genres: artist.genres || [],
                popularity: artist.popularity || 0,
                url: artist.external_urls?.spotify,
                isSpotify: true,
                spotifyId: artist.id,
                _original: artist
            })) || []
        }
    } catch (error) {
        console.error('❌ Error searching Spotify artists:', error)
        throw error
    }
}

/**
 * Search for albums on Spotify
 */
async function searchAlbums(query, limit = 20, offset = 0) {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=${limit}&offset=${offset}&market=US`
        
        const data = await makeSpotifyRequest(url)
        
        return {
            albums: data.albums?.items?.map(album => ({
                id: album.id,
                type: 'album',
                title: album.name,
                artist: album.artists?.[0]?.name || 'Unknown Artist',
                artists: album.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
                imgUrl: album.images?.[0]?.url || album.images?.[1]?.url,
                releaseDate: album.release_date,
                totalTracks: album.total_tracks || 0,
                url: album.external_urls?.spotify,
                isSpotify: true,
                spotifyId: album.id,
                _original: album
            })) || []
        }
    } catch (error) {
        console.error('❌ Error searching Spotify albums:', error)
        throw error
    }
}

/**
 * Search all types (tracks, artists, albums) on Spotify
 */
async function searchAll(query, limit = 10) {
    try {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track,artist,album&limit=${limit}&market=US`
        
        const data = await makeSpotifyRequest(url)
        
        // Process tracks
        const tracks = data.tracks?.items?.map(track => ({
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
            _original: track
        })) || []

        // Process artists
        const artists = data.artists?.items?.map(artist => ({
            id: artist.id,
            type: 'artist',
            title: artist.name,
            imgUrl: artist.images?.[0]?.url || artist.images?.[1]?.url,
            followers: artist.followers?.total || 0,
            genres: artist.genres || [],
            popularity: artist.popularity || 0,
            url: artist.external_urls?.spotify,
            isSpotify: true,
            spotifyId: artist.id,
            _original: artist
        })) || []

        // Process albums
        const albums = data.albums?.items?.map(album => ({
            id: album.id,
            type: 'album',
            title: album.name,
            artist: album.artists?.[0]?.name || 'Unknown Artist',
            artists: album.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
            imgUrl: album.images?.[0]?.url || album.images?.[1]?.url,
            releaseDate: album.release_date,
            totalTracks: album.total_tracks || 0,
            url: album.external_urls?.spotify,
            isSpotify: true,
            spotifyId: album.id,
            _original: album
        })) || []

        return {
            songs: tracks,
            artists: artists,
            albums: albums,
            total: tracks.length + artists.length + albums.length
        }
    } catch (error) {
        console.error('❌ Error searching Spotify (all types):', error)
        throw error
    }
}