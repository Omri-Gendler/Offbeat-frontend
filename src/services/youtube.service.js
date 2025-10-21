import axios from 'axios'

// שמור את המפתח שלך כאן (או בקובץ .env)
const API_KEY = 'AIzaSyCDWy_HqJcXUmS5rFXxow1hSwWH7ouAK1M'
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
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                imgUrl: item.snippet.thumbnails.high.url,
                addedBy: 'u100', // למשל
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
