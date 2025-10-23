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

            return {
                id: videoId,
                title: item.snippet.title,
                artists: item.snippet.channelTitle,
                genre: detectGenre(item.snippet.title),
                url: `https://www.youtube.com/watch?v=${videoId}`,
                youtubeVideoId: videoId, // Add YouTube video ID
                isYouTube: true, // Flag for YouTube content
                imgUrl: item.snippet.thumbnails.high.url,
                addedBy: 'u100',
                likedBy: [],
                addedAt: Date.now(),
                durationMs: durationMs
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

function detectGenre(title) {
    // ...
    const text = title.toLowerCase()
    if (text.includes('hip hop') || text.includes('rap')) return 'Hip-Hop'
    if (text.includes('rock') || text.includes('metal')) return 'Rock'
    if (text.includes('pop') || text.includes('chart')) return 'Pop'
    if (text.includes('electronic') || text.includes('edm') || text.includes('techno')) return 'Electronic'
    if (text.includes('chill') || text.includes('lofi')) return 'Chill'
    return 'Pop'
}