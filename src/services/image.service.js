// Image service with fallbacks for GitHub Pages deployment
const FALLBACK_IMAGES = {
    station: '/img/music-note.jpg',
    song: '/img/music-note.jpg',
    artist: '/img/default-artist.jpg',
    album: '/img/default-album.jpg',
    liked: '/img/liked-songs.jpeg'
}

export const imageService = {
    getImageUrl,
    getFallbackUrl,
    preloadImage
}

/**
 * Get image URL with proper base path and fallback
 */
function getImageUrl(url, type = 'song') {
    if (!url) {
        return getFallbackUrl(type)
    }
    
    // If it's already a full URL (http/https), use it as is
    if (url.startsWith('http') || url.startsWith('https')) {
        return url
    }
    
    // If it's a relative path, add the base URL
    const baseUrl = import.meta.env.BASE_URL || '/'
    return baseUrl.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url)
}

/**
 * Get fallback image URL for the given type
 */
function getFallbackUrl(type = 'song') {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const fallbackPath = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.song
    return baseUrl.replace(/\/$/, '') + fallbackPath
}

/**
 * Preload an image and return a promise that resolves when loaded
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => {
            console.warn('Failed to load image:', src)
            resolve(getFallbackUrl()) // Resolve with fallback instead of rejecting
        }
        img.src = src
    })
}

/**
 * Get image with automatic fallback on error
 */
export function getImageWithFallback(url, type = 'song') {
    if (!url) return getFallbackUrl(type)
    
    return new Promise((resolve) => {
        const img = new Image()
        
        img.onload = () => {
            resolve(getImageUrl(url, type))
        }
        
        img.onerror = () => {
            console.warn('Image failed to load, using fallback:', url)
            resolve(getFallbackUrl(type))
        }
        
        img.src = getImageUrl(url, type)
    })
}