// Offline Search Service for GitHub Pages
// Provides local search functionality when external APIs are not available

const demoSongs = [
    {
        id: 'demo_1',
        type: 'song',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        artists: 'The Weeknd',
        album: 'After Hours',
        durationMs: 200040,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273c9b6c7bb3dade2ce0c8c4239',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_2',
        type: 'song',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        artists: 'Ed Sheeran',
        album: '÷ (Divide)',
        durationMs: 233713,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_3',
        type: 'song',
        title: 'Stay',
        artist: 'Rihanna',
        artists: 'Rihanna',
        album: 'Unapologetic',
        durationMs: 240000,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e20e5c366b497518353497b0',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_4',
        type: 'song',
        title: 'Thunder',
        artist: 'Imagine Dragons',
        artists: 'Imagine Dragons',
        album: 'Evolve',
        durationMs: 187000,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273b5cf1d7e7e9c65bbcc365075',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_5',
        type: 'song',
        title: 'Perfect',
        artist: 'Ed Sheeran',
        artists: 'Ed Sheeran',
        album: '÷ (Divide)',
        durationMs: 263400,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_6',
        type: 'song',
        title: 'Someone Like You',
        artist: 'Adele',
        artists: 'Adele',
        album: '21',
        durationMs: 285000,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b2739e2f95ae77cf436017ada9cb',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_7',
        type: 'song',
        title: 'Uptown Funk',
        artist: 'Mark Ronson ft. Bruno Mars',
        artists: 'Mark Ronson, Bruno Mars',
        album: 'Uptown Special',
        durationMs: 269000,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e419ccba0baa8bd3f3d7abf2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        addedAt: Date.now(),
        isDemo: true
    },
    {
        id: 'demo_8',
        type: 'song',
        title: 'Bad Guy',
        artist: 'Billie Eilish',
        artists: 'Billie Eilish',
        album: 'When We All Fall Asleep, Where Do We Go?',
        durationMs: 194000,
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        addedAt: Date.now(),
        isDemo: true
    }
]

const demoArtists = [
    {
        id: 'artist_1',
        type: 'artist',
        title: 'The Weeknd',
        imgUrl: 'https://i.scdn.co/image/ab67616100005174214f3cf1cbe7139c1e26ffbb',
        followers: 45000000,
        genres: ['pop', 'r&b'],
        popularity: 95
    },
    {
        id: 'artist_2', 
        type: 'artist',
        title: 'Ed Sheeran',
        imgUrl: 'https://i.scdn.co/image/ab67616100005174ba025c8f62612b2ca6bfa375',
        followers: 40000000,
        genres: ['pop', 'folk'],
        popularity: 92
    },
    {
        id: 'artist_3',
        type: 'artist',
        title: 'Rihanna',
        imgUrl: 'https://i.scdn.co/image/ab6761610000517499e4fca7c0b7cb166d915789',
        followers: 35000000,
        genres: ['pop', 'r&b'],
        popularity: 88
    }
]

export const offlineSearchService = {
    searchTracks,
    searchArtists, 
    searchAll,
    isOfflineMode
}

function isOfflineMode() {
    return !import.meta.env.VITE_SPOTIFY_API_KEY || 
           !import.meta.env.VITE_SPOTIFY_API_KEY_SECRET ||
           typeof window !== 'undefined' && window.location.hostname.includes('github.io')
}

function searchTracks(query, limit = 20) {
    console.log('🔍 Offline search for tracks:', query)
    
    if (!query || query.trim().length === 0) {
        console.log('📋 No query provided, returning all demo songs')
        return Promise.resolve({
            tracks: demoSongs.slice(0, limit)
        })
    }
    
    const lowerQuery = query.toLowerCase().trim()
    const results = demoSongs.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery)
    ).slice(0, limit)
    
    console.log('🎵 Found', results.length, 'tracks for query:', query)
    
    return Promise.resolve({
        tracks: results
    })
}

function searchArtists(query, limit = 20) {
    console.log('🔍 Offline search for artists:', query)
    
    if (!query || query.trim().length === 0) {
        console.log('📋 No query provided, returning all demo artists')
        return Promise.resolve({
            artists: demoArtists.slice(0, limit)
        })
    }
    
    const lowerQuery = query.toLowerCase().trim()
    const results = demoArtists.filter(artist =>
        artist.title.toLowerCase().includes(lowerQuery)
    ).slice(0, limit)
    
    console.log('🎭 Found', results.length, 'artists for query:', query)
    
    return Promise.resolve({
        artists: results
    })
}

function searchAll(query, limit = 10) {
    console.log('🔍 Offline search for all:', query)
    
    if (!query || query.trim().length === 0) {
        console.log('📋 No query provided, returning sample results')
        return Promise.resolve({
            songs: demoSongs.slice(0, Math.min(limit, 6)),
            artists: demoArtists.slice(0, Math.min(Math.floor(limit / 2), 3)),
            albums: [],
            total: Math.min(limit, 6) + Math.min(Math.floor(limit / 2), 3)
        })
    }
    
    const lowerQuery = query.toLowerCase().trim()
    const trackResults = demoSongs.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery)
    ).slice(0, limit)
    
    const artistResults = demoArtists.filter(artist =>
        artist.title.toLowerCase().includes(lowerQuery)
    ).slice(0, Math.floor(limit / 2))
    
    console.log('🎯 Search results:', trackResults.length, 'songs,', artistResults.length, 'artists')
    
    return Promise.resolve({
        songs: trackResults,
        artists: artistResults,
        albums: [],
        total: trackResults.length + artistResults.length
    })
}