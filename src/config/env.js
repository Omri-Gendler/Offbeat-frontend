// Environment validation script
console.log('🔍 Build Environment Check')
console.log('==========================')
console.log('Mode:', import.meta.env.MODE)
console.log('YouTube API Key:', import.meta.env.VITE_YOUTUBE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Spotify API Key:', import.meta.env.VITE_SPOTIFY_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Spotify Secret:', import.meta.env.VITE_SPOTIFY_API_KEY_SECRET ? '✅ Set' : '❌ Missing')

if (import.meta.env.MODE === 'production') {
    console.log('🚀 Production Build')
    if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
        console.error('❌ CRITICAL: YouTube API key missing in production!')
        console.error('Add VITE_YOUTUBE_API_KEY to Render environment variables')
    }
} else {
    console.log('🛠️ Development Build')
}

export const envConfig = {
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
    youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
    spotifyApiKey: import.meta.env.VITE_SPOTIFY_API_KEY,
    spotifySecret: import.meta.env.VITE_SPOTIFY_API_KEY_SECRET,
}