// Asset service to handle proper image paths in production
export function getAssetUrl(path) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Use Vite base URL for all environments (works for Vercel and GH Pages)
    const baseUrl = import.meta.env.BASE_URL || '/'
    const url = `${baseUrl}${cleanPath}`
    console.log(`🖼️ Asset URL generated: ${path} → ${url}`)
    return url
}

// Common asset paths
export const ASSET_PATHS = {
    UNNAMED_SONG: '/img/unnamed-song.png',
    APP_LOGO: '/img/AppLogo.png',
    SPOTIFY_LOGO: '/img/spotify-white-icon.webp',
    LIKED_SONGS: '/img/liked-songs.jpeg',
    SPOTIFY_MOBILE_1: '/img/spotify1.jpeg',
    SPOTIFY_MOBILE_2: '/img/spotify2.jpeg'
}