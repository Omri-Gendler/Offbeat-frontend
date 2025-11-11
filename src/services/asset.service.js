// Asset service to handle proper image paths in production
export function getAssetUrl(path) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    
    // In production (GitHub Pages), we need to use the base path
    if (import.meta.env.MODE === 'production') {
        const url = `/Offbeat-frontend/${cleanPath}`
        console.log(`🖼️ Asset URL generated: ${path} → ${url}`)
        return url
    }
    
    // In development, use the path as-is
    return `/${cleanPath}`
}

// Common asset paths
export const ASSET_PATHS = {
    UNNAMED_SONG: '/img/unnamed-song.png',
    APP_LOGO: '/img/AppLogo.png',
    SPOTIFY_LOGO: '/img/spotify-white-icon.webp',
    LIKED_SONGS: '/img/liked-songs.jpeg'
}