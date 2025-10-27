// Debug script to test YouTube API
import axios from 'axios'

// Test with environment variable
const API_KEY = process.env.VITE_YOUTUBE_API_KEY || 'AIzaSyC3_GmVger2JGad6Q5vtqUolo1UT7Ck4zI'
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

console.log('Testing YouTube API...')
console.log('API Key exists:', !!API_KEY)
console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10))

async function testYouTubeAPI() {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: 'test music',
                key: API_KEY,
                type: 'video',
                maxResults: 1
            }
        })
        
        console.log('✅ YouTube API working!')
        console.log('Response:', response.data)
    } catch (error) {
        console.error('❌ YouTube API Error:', error.response?.status, error.response?.statusText)
        console.error('Error data:', error.response?.data)
        console.error('Full error:', error.message)
    }
}

testYouTubeAPI()