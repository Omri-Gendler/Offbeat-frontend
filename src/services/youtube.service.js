import axios from 'axios'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'
const searchCache = new Map()

export const youtubeService = {
    searchSongs,
    searchArtists,
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
        // First search for general content
        const searchResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                type: 'video,channel',
                maxResults: 25
            }
        })

        // Second search specifically for artists/channels
        const artistSearchResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query + ' artist music channel',
                key: API_KEY,
                type: 'channel',
                maxResults: 15,
                order: 'relevance'
            }
        })

        // Third search for related/similar artists
        const relatedSearchResponse = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query + ' similar artists like',
                key: API_KEY,
                type: 'channel',
                maxResults: 10,
                order: 'relevance'
            }
        })

        const generalItems = searchResponse.data.items || []
        const artistItems = artistSearchResponse.data.items || []
        const relatedItems = relatedSearchResponse.data.items || []

        const channels = []
        const videos = []

        // Process general search results  
        generalItems.forEach(item => {
            if (item.id.kind === 'youtube#channel') {
                channels.push(item)
            } else if (item.id.kind === 'youtube#video') {
                videos.push(item)
            }
        })

        // Add artist-specific search results (avoid duplicates)
        artistItems.forEach(item => {
            if (item.id.kind === 'youtube#channel') {
                const exists = channels.some(existing => existing.id.channelId === item.id.channelId)
                if (!exists) {
                    channels.push(item)
                }
            }
        })

        // Add related artist search results (avoid duplicates)
        relatedItems.forEach(item => {
            if (item.id.kind === 'youtube#channel') {
                const exists = channels.some(existing => existing.id.channelId === item.id.channelId)
                if (!exists) {
                    channels.push(item)
                }
            }
        })

        const artists = channels.map(item => {
            const cleanArtistName = item.snippet.channelTitle
                .replace(/\s*-\s*Topic$/gi, '')
                .replace(/\s*VEVO$/gi, '')
                .replace(/\s*Music$/gi, '')
                .replace(/\s*Official$/gi, '')
                .trim()

            return {
                id: item.id.channelId,
                type: 'artist',
                title: cleanArtistName,
                imgUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
            }
        })

        const videoIds = videos.map(item => item.id.videoId).join(',')
        let songs = []

        if (videoIds) {
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

            songs = videos.map(item => {
                const videoId = item.id.videoId
                const details = detailsMap[videoId]
                const durationMs = details ? parseISO8601Duration(details.contentDetails.duration) * 1000 : 0
                const { title: cleanTitle, artist: cleanArtist } = cleanYouTubeTitle(item.snippet.title, item.snippet.channelTitle)

                return {
                    id: videoId,
                    type: 'song',
                    title: cleanTitle,
                    artist: cleanArtist,
                    artists: cleanArtist,
                    album: detectAlbum(item.snippet.title, item.snippet.description || '', item.snippet.channelTitle),
                    genre: detectGenre(item.snippet.title, item.snippet.description || '', item.snippet.channelTitle),
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    youtubeVideoId: videoId,
                    isYouTube: true,
                    imgUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
                    addedAt: Date.now(),
                    durationMs: durationMs,
                    _original: { ...item }
                }
            })
        }

        const results = {
            artists: artists,
            songs: songs
        }

        searchCache.set(cacheKey, results)
        return results

    } catch (err) {
        console.error('Error searching YouTube', err)
        throw err
    }
}

async function searchArtists(query, skip = 0) {
    try {
        // Multiple search strategies to find more artists
        const searches = [
            {
                q: query + ' artist music channel',
                maxResults: 10
            },
            {
                q: query + ' band musician',
                maxResults: 10
            },
            {
                q: query + ' official channel music',
                maxResults: 10
            }
        ]

        const allChannels = []

        for (const searchParams of searches) {
            const searchResponse = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: 'snippet',
                    key: API_KEY,
                    type: 'channel',
                    order: 'relevance',
                    ...searchParams
                }
            })

            const items = searchResponse.data.items || []
            items.forEach(item => {
                const exists = allChannels.some(existing => existing.id.channelId === item.id.channelId)
                if (!exists) {
                    allChannels.push(item)
                }
            })
        }

        const artists = allChannels.map(item => {
            const cleanArtistName = item.snippet.channelTitle
                .replace(/\s*-\s*Topic$/gi, '')
                .replace(/\s*VEVO$/gi, '')
                .replace(/\s*Music$/gi, '')
                .replace(/\s*Official$/gi, '')
                .trim()

            return {
                id: item.id.channelId,
                type: 'artist',
                title: cleanArtistName,
                imgUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
            }
        })

        return {
            artists: artists.slice(skip),
            songs: []
        }

    } catch (err) {
        console.error('Error searching YouTube artists', err)
        throw err
    }
}

/**
 * @param {string} isoDuration 
 * @returns {number} 
 */
function parseISO8601Duration(isoDuration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const matches = isoDuration.match(regex)
    if (!matches) return 0
    const hours = matches[1] ? parseInt(matches[1]) : 0
    const minutes = matches[2] ? parseInt(matches[2]) : 0
    const seconds = matches[3] ? parseInt(matches[3]) : 0
    return (hours * 3600) + (minutes * 60) + seconds
}

/**
 * @param {string} title 
 * @param {string} channelTitle
 * @returns {{title: string, artist: string}}
 */
function cleanYouTubeTitle(title, channelTitle) {
    let cleanTitle = title
    let artist = ""

    let potentialArtist = channelTitle
        .replace(/\s*-\s*Topic$/gi, '')
        .replace(/\s*VEVO$/gi, '')
        .replace(/\s*Records$/gi, '')
        .replace(/\s*Music$/gi, '')
        .replace(/\s*Official$/gi, '')
        .replace(/\s+/g, ' ')
        .trim()

    const junkPatterns = [
        /\s*\(Official.*?\)/gi,      // (Official Video), (Official Audio), etc.
        /\s*\[Official.*?\]/gi,      // [Official Video], [Official Audio], etc.
        /\s*\(.*?Video.*?\)/gi,      // (Music Video), (Live Video), etc.
        /\s*\[.*?Video.*?\]/gi,      // [Music Video], [Live Video], etc.
        /\s*\(.*?Audio.*?\)/gi,      // (Audio Only), (High Quality Audio), etc.
        /\s*\[.*?Audio.*?\]/gi,      // [Audio Only], [High Quality Audio], etc.
        /\s*\(HD.*?\)/gi,            // (HD), (4K), etc.
        /\s*\[HD.*?\]/gi,            // [HD], [4K], etc.
        /\s*\(.*?Remix.*?\)/gi,      // (Remix), (Club Remix), etc.
        /\s*\[.*?Remix.*?\]/gi,      // [Remix], [Club Remix], etc.
        /\s*\(.*?Edit.*?\)/gi,       // (Radio Edit), (Extended Edit), etc.
        /\s*\[.*?Edit.*?\]/gi,       // [Radio Edit], [Extended Edit], etc.
        /\s*\(.*?Version.*?\)/gi,    // (Album Version), (Single Version), etc.
        /\s*\[.*?Version.*?\]/gi,    // [Album Version], [Single Version], etc.
        /\s*\(.*?Mix.*?\)/gi,        // (Radio Mix), (Club Mix), etc.
        /\s*\[.*?Mix.*?\]/gi,        // [Radio Mix], [Club Mix], etc.
        /\s*\(.*?Live.*?\)/gi,       // (Live), (Live at...), etc.
        /\s*\[.*?Live.*?\]/gi,       // [Live], [Live at...), etc.
        /\s*\(.*?Performance.*?\)/gi, // (Live Performance), etc.
        /\s*\[.*?Performance.*?\]/gi, // [Live Performance], etc.
        /\s*\(.*?Cover.*?\)/gi,      // (Cover), (Acoustic Cover), etc.
        /\s*\[.*?Cover.*?\]/gi,      // [Cover], [Acoustic Cover], etc.
        /\s*\(Lyrics?.*?\)/gi,       // (Lyrics), (Lyric Video)
        /\s*\[Lyrics?.*?\]/gi,       // [Lyrics], [Lyric Video]
        /\s*\(Subt(í|i)tulos.*?\)/gi, // (Subtítulos), (Subtitles)
        /\s*\[Subt(í|i)tulos.*?\]/gi, // [Subtítulos], [Subtitles]
        /\s*\(Prod\..*?\)/gi,        // (Prod. by ...)
        /\s*\[Prod\..*?\]/gi,        // [Prod. by ...]
        /(\(|\[).*?(MV|M\/V).*?(\)|\])/gi, // (MV), [M/V]
    ]

    junkPatterns.forEach(pattern => {
        cleanTitle = cleanTitle.replace(pattern, '')
    })

    const artistSongPatterns = [
        /^(.+?)\s*[-–—]\s*(.+)$/,     // "Artist - Song" 
        /^(.+?)\s*:\s*(.+)$/,        // "Artist: Song"
        /^(.+?)\s*\|\s*(.+)$/,        // "Artist | Song"
    ]

    let foundPattern = false
    for (const pattern of artistSongPatterns) {
        const match = cleanTitle.match(pattern)
        if (match) {
            // "Artist - Song"
            artist = match[1].trim()
            cleanTitle = match[2].trim()
            foundPattern = true
            break
        }
    }

    if (!foundPattern) {
        const byPattern = /^(.+?)\s+by\s+(.+)$/i // "Song by Artist"
        const match = cleanTitle.match(byPattern)
        if (match) {
            cleanTitle = match[1].trim()
            artist = match[2].trim()
            foundPattern = true
        }
    }

    if (!artist || artist.length === 0) {
        artist = potentialArtist
    }

    cleanTitle = cleanTitle.replace(/\s+/g, ' ').replace(/[-–—|:]\s*$/, '').trim()
    artist = artist.replace(/\s+/g, ' ').trim()

    if ((!artist || artist === cleanTitle) && potentialArtist) {
        artist = potentialArtist
    }

    return {
        title: cleanTitle,
        artist: artist
    }
}


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

    if (title.toLowerCase().includes('single')) {
        return 'Single'
    }

    return 'YouTube'
}

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

    return 'Pop'
}