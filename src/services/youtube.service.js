import axios from 'axios'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const searchCache = new Map()

export const youtubeService = {
    searchSongs,
    // searchVideos
}

export const searchVideos = async (query, maxResults) => {
    const response = await axios.get(`${BASE_URL}/search`, {
        params: {
            part: 'snippet',
            q: query,
            key: API_KEY,
            type: 'video',


            maxResults: maxResults
        }
    })
    return response.data.items
}

async function searchSongs(query) {
    const cacheKey = query.toLowerCase().trim()

    if (searchCache.has(cacheKey)) {
        console.log('Serving from cache:', cacheKey)
        return searchCache.get(cacheKey)
    }

    console.log('Fetching from API:', cacheKey)
    try {
        const searchResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                type: 'video',
                maxResults: 10
            }
        })

        const videoIds = searchResponse.data.items
            .map(item => item.id.videoId)
            .join(',')

        if (!videoIds) return []

        const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,contentDetails',
                id: videoIds,
                key: API_KEY
            }
        })

        const detailsMap = detailsResponse.data.items.reduce((acc, item) => {
            acc[item.id] = item
            return acc
        }, {})

        const songs = searchResponse.data.items.map(item => {
            const videoId = item.id.videoId
            const details = detailsMap[videoId]

            const durationMs = details
                ? parseISO8601Duration(details.contentDetails.duration) * 1000
                : 0

            // Clean the title and extract proper artist/song info
            const { title: cleanTitle, artist: cleanArtist } = cleanYouTubeTitle(
                item.snippet.title, 
                item.snippet.channelTitle
            )
            
            // Get album information
            const album = detectAlbum(
                item.snippet.title, 
                item.snippet.description || '', 
                item.snippet.channelTitle
            )
            
            // Get genre with enhanced detection
            const genre = detectGenre(
                item.snippet.title, 
                item.snippet.description || '', 
                item.snippet.channelTitle
            )

            return {
                id: videoId,
                title: cleanTitle,
                artist: cleanArtist,
                artists: cleanArtist, // Keep both for compatibility
                album: album,
                genre: genre,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                youtubeVideoId: videoId,
                isYouTube: true,
                imgUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                addedBy: 'u100',
                likedBy: [],
                addedAt: Date.now(),
                durationMs: durationMs,
                // Additional Spotify-like metadata
                explicit: false, // YouTube doesn't provide this, default to false
                popularity: Math.floor(Math.random() * 100), // Simulate popularity score
                previewUrl: null, // YouTube doesn't provide 30-second previews
                // Keep original data for reference
                _original: {
                    title: item.snippet.title,
                    channelTitle: item.snippet.channelTitle,
                    description: item.snippet.description
                }
            }
        })

        searchCache.set(cacheKey, songs)

        return songs

    } catch (err) {
        console.error('Error searching YouTube', err)
        throw err
    }
}

function parseISO8601Duration(isoDuration) {
    // ...
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const matches = isoDuration.match(regex)
    if (!matches) return 0
    const hours = matches[1] ? parseInt(matches[1]) : 0
    const minutes = matches[2] ? parseInt(matches[2]) : 0
    const seconds = matches[3] ? parseInt(matches[3]) : 0
    return (hours * 3600) + (minutes * 60) + seconds
}

// Clean up YouTube video titles to extract proper song and artist names
function cleanYouTubeTitle(title, channelTitle) {
    let cleanTitle = title
    let artist = channelTitle
    
    // Remove common YouTube suffixes/prefixes with regex
    const patterns = [
        /\s*\(Official.*?\)/gi,           // (Official Video), (Official Audio), etc.
        /\s*\[Official.*?\]/gi,           // [Official Video], [Official Audio], etc.
        /\s*\(.*?Video.*?\)/gi,           // (Music Video), (Live Video), etc.
        /\s*\[.*?Video.*?\]/gi,           // [Music Video], [Live Video], etc.
        /\s*\(.*?Audio.*?\)/gi,           // (Audio Only), (High Quality Audio), etc.
        /\s*\[.*?Audio.*?\]/gi,           // [Audio Only], [High Quality Audio], etc.
        /\s*\(HD.*?\)/gi,                 // (HD), (4K), etc.
        /\s*\[HD.*?\]/gi,                 // [HD], [4K], etc.
        /\s*\(.*?Remix.*?\)/gi,           // (Remix), (Club Remix), etc.
        /\s*\[.*?Remix.*?\]/gi,           // [Remix], [Club Remix], etc.
        /\s*\(.*?Edit.*?\)/gi,            // (Radio Edit), (Extended Edit), etc.
        /\s*\[.*?Edit.*?\]/gi,            // [Radio Edit], [Extended Edit], etc.
        /\s*\(.*?Version.*?\)/gi,         // (Album Version), (Single Version), etc.
        /\s*\[.*?Version.*?\]/gi,         // [Album Version], [Single Version], etc.
        /\s*\(.*?Mix.*?\)/gi,             // (Radio Mix), (Club Mix), etc.
        /\s*\[.*?Mix.*?\]/gi,             // [Radio Mix], [Club Mix], etc.
        /\s*\(.*?Live.*?\)/gi,            // (Live), (Live at...), etc.
        /\s*\[.*?Live.*?\]/gi,            // [Live], [Live at...), etc.
        /\s*\(.*?Performance.*?\)/gi,     // (Live Performance), etc.
        /\s*\[.*?Performance.*?\]/gi,     // [Live Performance], etc.
        /\s*\(.*?Cover.*?\)/gi,           // (Cover), (Acoustic Cover), etc.
        /\s*\[.*?Cover.*?\]/gi,           // [Cover], [Acoustic Cover], etc.
        /\s*-\s*Topic$/gi,                // Remove "- Topic" from channel names
        /\s*VEVO$/gi,                     // Remove "VEVO" from channel names
        /\s*Records$/gi,                  // Remove "Records" from channel names
        /\s*Music$/gi                     // Remove "Music" from channel names
    ]
    
    // Apply all cleaning patterns
    patterns.forEach(pattern => {
        cleanTitle = cleanTitle.replace(pattern, '')
    })
    
    // Clean the artist name
    artist = artist.replace(/\s*-\s*Topic$/gi, '')
                  .replace(/\s*VEVO$/gi, '')
                  .replace(/\s*Records$/gi, '')
                  .replace(/\s*Music$/gi, '')
                  .replace(/\s*Official$/gi, '')
    
    // Try to extract artist and song from title patterns
    const artistSongPatterns = [
        /^(.+?)\s*[-–—]\s*(.+)$/,         // "Artist - Song" or "Artist – Song"
        /^(.+?)\s*:\s*(.+)$/,             // "Artist: Song"
        /^(.+?)\s*\|\s*(.+)$/,            // "Artist | Song"
        /^(.+?)\s*by\s+(.+)$/i,           // "Song by Artist"
        /^(.+?)\s*ft\.?\s+(.+)$/i,        // "Artist ft. Other Artist"
        /^(.+?)\s*feat\.?\s+(.+)$/i       // "Artist feat. Other Artist"
    ]
    
    for (const pattern of artistSongPatterns) {
        const match = cleanTitle.match(pattern)
        if (match) {
            if (pattern.source.includes('by')) {
                // "Song by Artist" pattern
                cleanTitle = match[1].trim()
                artist = match[2].trim()
            } else {
                // "Artist - Song" patterns
                artist = match[1].trim()
                cleanTitle = match[2].trim()
            }
            break
        }
    }
    
    // Final cleanup - remove extra whitespace
    cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim()
    artist = artist.replace(/\s+/g, ' ').trim()
    
    // If we couldn't extract artist from title, use channel name
    if (!artist || artist === cleanTitle) {
        artist = channelTitle.replace(/\s*-\s*Topic$/gi, '')
                           .replace(/\s*VEVO$/gi, '')
                           .replace(/\s*Records$/gi, '')
                           .replace(/\s*Music$/gi, '')
                           .trim()
    }
    
    return {
        title: cleanTitle,
        artist: artist
    }
}

// Detect album/compilation from title or description
function detectAlbum(title, description, channelTitle) {
    const albumPatterns = [
        /from\s+(?:the\s+)?album\s+[""'](.+?)[""']/gi,
        /album:\s*[""'](.+?)[""']/gi,
        /taken\s+from\s+[""'](.+?)[""']/gi
    ]
    
    const searchText = `${title} ${description}`.toLowerCase()
    
    for (const pattern of albumPatterns) {
        const match = searchText.match(pattern)
        if (match) {
            return match[1].trim()
        }
    }
    
    // If no album found, check if it's a single
    if (title.toLowerCase().includes('single')) {
        return 'Single'
    }
    
    // Default to YouTube for YouTube content
    return 'YouTube'
}

// Enhanced genre detection with more patterns
function detectGenre(title, description, channelTitle) {
    const text = `${title} ${description} ${channelTitle}`.toLowerCase()
    
    const genrePatterns = {
        'Hip-Hop': [/hip.?hop/i, /\brap\b/i, /drill/i, /trap/i, /gangsta/i],
        'Pop': [/\bpop\b/i, /mainstream/i, /chart/i, /radio/i],
        'Rock': [/\brock\b/i, /metal/i, /punk/i, /grunge/i, /alternative/i],
        'Electronic': [/electronic/i, /edm/i, /techno/i, /house/i, /dubstep/i, /trance/i],
        'R&B': [/\br&b\b/i, /\brnb\b/i, /soul/i, /funk/i, /neo.?soul/i],
        'Jazz': [/jazz/i, /blues/i, /swing/i, /bebop/i],
        'Classical': [/classical/i, /orchestra/i, /symphony/i, /piano/i, /violin/i],
        'Country': [/country/i, /folk/i, /bluegrass/i, /americana/i],
        'Reggae': [/reggae/i, /dancehall/i, /ska/i],
        'Latin': [/latin/i, /salsa/i, /reggaeton/i, /bachata/i, /merengue/i],
        'Indie': [/indie/i, /underground/i, /lo.?fi/i, /chill/i],
        'World': [/world/i, /ethnic/i, /traditional/i]
    }
    
    for (const [genre, patterns] of Object.entries(genrePatterns)) {
        if (patterns.some(pattern => pattern.test(text))) {
            return genre
        }
    }
    
    return 'Pop' // Default genre
}