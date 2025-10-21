import axios from 'axios'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'

export const youtubeService = {
    searchSongs
}

async function searchSongs(query) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                type: 'video',
                maxResults: 10
            }
        })

        const songs = response.data.items.map(item => {
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                artists: item.snippet.channelTitle,
                genre: detectGenre(item.snippet.title, item.snippet.description || '', item.snippet.channelTitle),
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                imgUrl: item.snippet.thumbnails.high.url,
                addedBy: 'u100',
                likedBy: [],
                addedAt: Date.now()
            }
        })

        return songs

    } catch (err) {
        console.error('Error searching YouTube', err)
        throw err
    }
}

function detectGenre(title, description, channel) {
    const text = `${title} ${description} ${channel}`.toLowerCase()

    // Genre detection based on keywords
    if (text.includes('hip hop') || text.includes('rap') || text.includes('hip-hop')) return 'Hip-Hop'
    if (text.includes('rock') || text.includes('metal') || text.includes('punk')) return 'Rock'
    if (text.includes('pop') || text.includes('chart') || text.includes('hit')) return 'Pop'
    if (text.includes('jazz') || text.includes('blues')) return 'Jazz'
    if (text.includes('classical') || text.includes('orchestra') || text.includes('symphony')) return 'Classical'
    if (text.includes('electronic') || text.includes('edm') || text.includes('techno') || text.includes('house')) return 'Electronic'
    if (text.includes('country') || text.includes('folk')) return 'Country'
    if (text.includes('reggae') || text.includes('ska')) return 'Reggae'
    if (text.includes('latin') || text.includes('salsa') || text.includes('bachata')) return 'Latin'
    if (text.includes('indie') || text.includes('alternative')) return 'Indie'
    if (text.includes('chill') || text.includes('lofi') || text.includes('lo-fi') || text.includes('ambient')) return 'Chill'
    if (text.includes('workout') || text.includes('gym') || text.includes('fitness')) return 'Workout'

    // Default genre
    return 'Pop'
}
