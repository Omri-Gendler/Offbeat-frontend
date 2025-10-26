const NUM_STATIONS = 100
const SONGS_PER_STATION = 40

export function initDemoData() {
    const stations = getFromStorage('stationDB')
    const artists = getFromStorage('artistDB')

    if (stations && stations.length > 0 && artists && artists.length > 0) {
        console.log('Demo data already exists in localStorage.')
        // Validate that the data structure is correct
        const hasValidStructure = stations.every(station => station._id && station.name && Array.isArray(station.songs))
        if (hasValidStructure) {
            return
        } else {
            console.log('Invalid data structure detected, regenerating...')
        }
    }

    function _createLikedSongsStation(allStations) {
        const allSongs = allStations.flatMap(station => station.songs)
        return {
            _id: 'liked-songs-station',
            name: 'Liked Songs',
            songs: allSongs.filter(song => song.likedBy && song.likedBy.includes('u100')),
            imgUrl: '/img/liked-songs.jpeg',
            isLikedSongs: true,
            createdBy: {
                fullname: 'You'
            }
        }
    }

    console.log('Generating new demo data...')

    const generatedArtists = _generateDemoArtists()
    saveToStorage('artistDB', generatedArtists)

    // Only create Spotify-based stations (comment out other stations)
    // let generatedStations = _generateDemoStations(generatedArtists)
    // const hardcodedStations = _createHardcodedStations()
    
    // Add Spotify-based stations only
    const spotifyStations = _createSpotifyStations()
    
    let generatedStations = [...spotifyStations]

    const likedStation = _createLikedSongsStation(generatedStations)
    generatedStations.push(likedStation)

    // Save to localStorage
    saveToStorage('stationDB', generatedStations)
    console.log(`Demo data generated and saved! (${generatedStations.length} stations, ${generatedArtists.length} artists)`)
}

// Add a function to force regenerate data
export function clearAndRegenerateDemoData() {
    console.log('Clearing existing data and regenerating...')
    localStorage.removeItem('stationDB')
    localStorage.removeItem('artistDB')
    initDemoData()
}

// Function to get artists from localStorage
export function getArtists() {
    return getFromStorage('artistDB') || []
}

// Utility functions to access Spotify playlist data
export function getSpotifyPlaylistsByCategory(category) {
    return SPOTIFY_PLAYLISTS[category] || []
}

export function getAllSpotifyPlaylists() {
    return SPOTIFY_PLAYLISTS
}

export function getSpotifyPlaylistById(spotifyId) {
    for (const category in SPOTIFY_PLAYLISTS) {
        const playlist = SPOTIFY_PLAYLISTS[category].find(p => p.spotifyId === spotifyId)
        if (playlist) return { ...playlist, category }
    }
    return null
}

// Function to add audio URLs to existing demo data
export function upgradeExistingDemoDataWithAudio() {
    console.log('Upgrading existing demo data with audio URLs...')
    const stations = getFromStorage('stationDB')
    
    if (!stations || stations.length === 0) {
        console.log('No existing data found, generating new data...')
        initDemoData()
        return
    }
    
    // Add audio URLs to existing songs that don't have them
    const updatedStations = stations.map(station => {
        if (station.songs && Array.isArray(station.songs)) {
            const updatedSongs = station.songs.map(song => {
                if (!song.url) {
                    return {
                        ...song,
                        url: getRandomItem(SAMPLE_AUDIO_URLS)
                    }
                }
                return song
            })
            return {
                ...station,
                songs: updatedSongs
            }
        }
        return station
    })
    
    saveToStorage('stationDB', updatedStations)
    console.log('Demo data upgraded with audio URLs!')
}


function _generateDemoArtists() {
    const ARTIST_NAMES = [
        'The Midnight Voyagers', 'Elara', 'Leo & the Lions', 'Cyberia', 'Infected Mushroom',
        'Omer Adam', 'Astra', 'Quantum Pulse', 'Nora Veil', 'Solar Flare', 'Echo & the Void',
        'Starlight Brigade', 'Desert Runners', 'Tidal Wave', 'Crimson Peak', 'Ghost Hardware',
        'The Synthetics', 'Vache', 'Moonlit Sonata', 'Golden Rain', 'Lost Frequencies'
    ];


    return ARTIST_NAMES.map((name, index) => ({
        id: _makeId(10),
        type: 'artist',
        title: name,
        imgUrl: `https://picsum.photos/id/${100 + index}/200`
    }))
}

/**
 * @param {Array} artists 
 */
function _generateDemoStations(artists) {
    const stations = []
    const STATION_NAMES = [
        'Rock Classics', 'Midnight Drive', 'Chill Vibes', 'Workout Mix', '90s Pop Hits',
        'Coffee Shop Jazz', 'Electronic Beats', 'Indie Focus', 'Deep House', 'Summer Grooves'
    ]

    for (let i = 0; i < NUM_STATIONS; i++) {
        const stationName = `${getRandomItem(STATION_NAMES)} #${i + 1}`
        const songCount = getRandomInt(SONGS_PER_STATION - 15, SONGS_PER_STATION + 15)

        stations.push({
            _id: _makeId(12),
            name: stationName,
            description: `A collection of ${songCount} great tracks for your ${getRandomItem(['morning', 'workout', 'commute'])}.`,
            imgUrl: `https://picsum.photos/id/${200 + i}/200`,
            createdBy: {
                _id: 'u100',
                username: 'YOU'
            },
            songs: _generateDemoSongs(songCount, artists),
            likedByUsers: []
        })
    }
    return stations
}

/**
 * Creates stations from Spotify playlist data
 */
function _createSpotifyStations() {
    const stations = []
    let stationIndex = 0

    // Convert each category of playlists to stations
    Object.entries(SPOTIFY_PLAYLISTS).forEach(([category, playlists]) => {
        playlists.forEach((playlist, index) => {
            const station = {
                _id: `spotify_${playlist.spotifyId}`,
                name: playlist.title,
                description: playlist.description,
                imgUrl: playlist.imgUrl.trim(), // Remove any trailing spaces
                createdBy: {
                    _id: 'spotify',
                    username: 'Spotify',
                    fullname: 'Spotify'
                },
                songs: _generateDemoSongsForSpotifyPlaylist(playlist.title, category),
                likedByUsers: [],
                tags: [category, 'spotify', 'curated'],
                spotifyId: playlist.spotifyId,
                isSpotifyPlaylist: true
            }
            stations.push(station)
            stationIndex++
        })
    })

    return stations
}

/**
 * Generate demo songs that fit the playlist theme
 */
function _generateDemoSongsForSpotifyPlaylist(playlistTitle, category) {
    const songCount = getRandomInt(15, 35) // Reasonable playlist size
    const songs = []

    // Create themed songs based on category and playlist title
    const themeWords = _getThemeWords(category, playlistTitle)
    
    for (let i = 0; i < songCount; i++) {
        const songId = _makeId(12)
        const artist = getRandomItem(themeWords.artists)
        
        songs.push({
            id: songId,
            title: `${getRandomItem(themeWords.adjectives)} ${getRandomItem(themeWords.nouns)}`,
            artists: artist,
            album: `${getRandomItem(themeWords.albums)}`,
            durationMs: getRandomInt(150000, 360000),
            imgUrl: `https://picsum.photos/id/${200 + i}/200`,
            addedAt: Date.now() - getRandomInt(0, 31536000000),
            addedBy: 'spotify',
            likedBy: Math.random() > 0.7 ? ['u100'] : [], // 30% chance of being liked
            isYouTube: false,
            youtubeVideoId: songId,
            url: getRandomItem(SAMPLE_AUDIO_URLS),
            isSpotifyTrack: true
        })
    }
    
    return songs
}

/**
 * Get theme-appropriate words based on category and playlist title
 */
function _getThemeWords(category, playlistTitle) {
    const baseThemes = {
        pop: {
            adjectives: ['Electric', 'Bright', 'Golden', 'Shining', 'Sweet', 'Dancing', 'Dreaming', 'Rising'],
            nouns: ['Star', 'Heart', 'Light', 'Dream', 'Song', 'Beat', 'Love', 'Night'],
            artists: ['Pop Star', 'Luna Rose', 'The Bright Lights', 'Golden Hearts', 'Sweet Dreams', 'Dance Floor'],
            albums: ['Pop Perfection', 'Hit Collection', 'Chart Toppers', 'Radio Ready', 'Pop Gems']
        },
        decades: {
            adjectives: ['Classic', 'Vintage', 'Timeless', 'Retro', 'Nostalgic', 'Old School', 'Legendary'],
            nouns: ['Memories', 'Times', 'Groove', 'Soul', 'Rhythm', 'Beat', 'Sound', 'Vibe'],
            artists: ['The Classics', 'Vintage Sound', 'Retro Kings', 'Time Machine', 'Nostalgia Band'],
            albums: ['Greatest Hits', 'Classic Collection', 'Timeless Tracks', 'Vintage Vibes', 'Retro Gold']
        },
        hiphop: {
            adjectives: ['Heavy', 'Hard', 'Raw', 'Street', 'Underground', 'Fierce', 'Bold', 'Real'],
            nouns: ['Beats', 'Flow', 'Rhyme', 'Bass', 'Street', 'Game', 'Life', 'Hustle'],
            artists: ['MC Flow', 'Street Beats', 'Underground Kings', 'Raw Talent', 'Hip Hop Legends'],
            albums: ['Street Chronicles', 'Beat Collection', 'Raw Rhymes', 'Underground Hits', 'Hip Hop Classics']
        },
        latin: {
            adjectives: ['Peaceful', 'Calm', 'Serene', 'Gentle', 'Soft', 'Relaxing', 'Soothing', 'Tranquil'],
            nouns: ['Breeze', 'Waves', 'Peace', 'Calm', 'Rest', 'Breath', 'Quiet', 'Soul'],
            artists: ['Peaceful Vibes', 'Calm Waters', 'Serene Sounds', 'Gentle Waves', 'Quiet Storm'],
            albums: ['Peaceful Moments', 'Calm Collection', 'Relaxation', 'Soft Sounds', 'Tranquil Times']
        }
    }

    return baseThemes[category] || baseThemes.pop
}

/**
 * Creates specific hardcoded stations with guaranteed working audio URLs
 */
function _createHardcodedStations() {
    return [
        {
            _id: "st_chill_vibes",
            name: "Chill Vibes",
            description: "Relaxing tunes for a peaceful mood",
            imgUrl: "https://picsum.photos/id/1/200",
            createdBy: {
                _id: "u100",
                username: "YOU"
            },
            songs: [
                {
                    id: "s_chill_1",
                    title: "Serenity",
                    artists: "Ambient Artist",
                    album: "Peaceful Moments",
                    durationMs: 210000,
                    imgUrl: "https://picsum.photos/id/101/200",
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                },
                {
                    id: "s_chill_2", 
                    title: "Tranquil Waters",
                    artists: "Nature Sounds",
                    album: "Calm Collection",
                    durationMs: 195000,
                    imgUrl: "https://picsum.photos/id/102/200",
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                },
                {
                    id: "s_chill_3",
                    title: "Gentle Breeze",
                    artists: "Relaxation Masters",
                    album: "Wind Songs", 
                    durationMs: 240000,
                    imgUrl: "https://picsum.photos/id/103/200",
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
                }
            ],
            likedByUsers: [],
            tags: ["chill", "ambient", "relaxing"]
        },
        {
            _id: "st_energetic_beats",
            name: "Energetic Beats",
            description: "High-energy music to get you moving",
            imgUrl: "https://picsum.photos/id/2/200",
            createdBy: {
                _id: "u100", 
                username: "YOU"
            },
            songs: [
                {
                    id: "s_energy_1",
                    title: "Power Drive",
                    artists: "Electronic Pulse",
                    album: "High Voltage",
                    durationMs: 180000,
                    imgUrl: "https://picsum.photos/id/201/200",
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
                },
                {
                    id: "s_energy_2",
                    title: "Adrenaline Rush", 
                    artists: "Beat Masters",
                    album: "Pump It Up",
                    durationMs: 220000,
                    imgUrl: "https://picsum.photos/id/202/200",
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
                },
                {
                    id: "s_energy_3",
                    title: "Lightning Strike",
                    artists: "Thunder Wave",
                    album: "Storm Collection",
                    durationMs: 195000,
                    imgUrl: "https://picsum.photos/id/203/200", 
                    addedAt: Date.now(),
                    addedBy: "u100",
                    likedBy: [],
                    isYouTube: false,
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
                }
            ],
            likedByUsers: [],
            tags: ["energetic", "electronic", "workout"]
        }
    ]
}

// Spotify playlist data - hardcoded playlists with real metadata
const SPOTIFY_PLAYLISTS = {
    "pop": [
        {
            "description": "הפלייליסט הכי גדול בישראל, עם השירים הכי חמים של היום ומחר. קאבר: אודיה  ",
            "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DWSYF6geMtQMW",
            "spotifyId": "37i9dQZF1DWSYF6geMtQMW",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f872cdc5fbf95658cf3738e9",
            "title": "הלהיטים הגדולים של ישראל"
        },
        {
            "description": "The hottest 50. Cover: Lady Gaga & Bruno Mars",
            "spotifyId": "37i9dQZF1DXcBWIGoYBM5M",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002ea546f8c6250aa17529644f7 ",
            "title": "Today's Top Hits"
        },
        {
            "description": "כל הפופ היפה והמרגש של ישראל. קאבר: נועם קלינשטיין",
            "spotifyId": "37i9dQZF1DX9sLipKPkV9T",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000228d937470519586350b3deed",
            "title": "פופ ישראלי חדש"
        },
        {
            "description": "The songs with the biggest throwback moments. Cover: Arctic Monkeys",
            "spotifyId": "37i9dQZF1DXdpy4ZQQMZKm",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000266bf3d21138dc703e2d8dced",
            "title": "Top Throwbacks 2023"
        },
        {
            "description": "Set the mood of your day with these happy songs.",
            "spotifyId": "37i9dQZF1DX0UrRvztWcAU",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000026b30471dcc036d254dcc8041",
            "title": "Wake Up Happy"
        },
        {
            "description": "A mega mix of 75 favorites from the last few years! ",
            "spotifyId": "37i9dQZF1DXbYM3nMM0oPk",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000023909428545db5e34677f01f0",
            "title": "Mega Hit Mix"
        },
        {
            "description": "להיטי הפופ הגדולים של ישראל. קאבר: סטטיק ",
            "spotifyId": "37i9dQZF1DX3PGzKQakrnm",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000024a8bbd1eb33945b4bd5042ec",
            "title": "פופ ישראלי: הלהיטים"
        },
        {
            "description": "Warm familiar pop you know and love. Cover: Adele",
            "spotifyId": "37i9dQZF1DWTwnEm1IYyoj",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000242ede53dcaaa172b7bbca101",
            "title": "Soft Pop Hits"
        },
        {
            "description": "Current favorites and exciting new music. Cover: LISA",
            "spotifyId": "37i9dQZF1DXcRXFNfZr7Tp",
            "title": "just hits",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000260ef52a79dac8aca2417ced7"
        },
        {
            "description": "Los éxitos del pop latino con Shakira.",
            "spotifyId": "37i9dQZF1DWSpF87bP6JSF",
            "title": "La Lista Pop",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028a940ca226a8dec9e2e2a90d"
        }
    ],
    "decades": [
        {
            "description": "The biggest songs of the 1980s. Cover: Bruce Springsteen",
            "spotifyId": "37i9dQZF1DX4UtSsGT1Sbe",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d6710ea346fec48e89d77dba",
            "title": "All Out 80s"
        },
        {
            "description": "The biggest songs of the 1990s. Cover: The Cardigans",
            "spotifyId": "37i9dQZF1DXbTxeAdrVG2l",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002b60e6f68fd3a593011380bf8",
            "title": "All Out 90s"
        },
        {
            "description": "Rewind and unwind with sirens of the seventies and eighties.",
            "spotifyId": "37i9dQZF1DX0JKUIfwQSJh",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002ad5378ef4192257d82676b7f",
            "title": "70s & 80s Acoustic"
        },
        {
            "description": "The biggest songs of the 2000s. Cover: The Killers",
            "spotifyId": "37i9dQZF1DX4o1oenSJRJd",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002c900fae23e2a3cf42b0e1556",
            "title": "All Out 2000s"
        },
        {
            "description": "Mellow songs from the 1980s. Cover: Tina Turner",
            "spotifyId": "37i9dQZF1DX4WELsJtFZjZ",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000025dfb78be17a842867ef21a9f",
            "title": "Soft 80s"
        },
        {
            "description": "Mellow songs from the 90s. Cover: Mariah Carey",
            "spotifyId": "37i9dQZF1DX2syo5w7a1cu",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002a2c711a42da1ca15bcc06a77",
            "title": "Soft 90s"
        },
        {
            "description": "The biggest party hits of the 1980s. Cover: Cyndi Lauper",
            "spotifyId": "37i9dQZF1DX6xnkAwJX7tn",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028e6b9a53f7c37210a843ab0a",
            "title": "80s Party"
        },
        {
            "description": "The biggest songs of the 1970s. Cover: ABBA",
            "spotifyId": "37i9dQZF1DWTJ7xPn4vNaz",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000241a94d08ee017512668505a3",
            "title": "All Out 70s"
        },
        {
            "description": "The biggest party hits of the 2000s. Cover: Shakira.",
            "spotifyId": "37i9dQZF1DX7e8TjkFNKWH",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002abf84d549f87ed110df1b750",
            "title": "Party Hits 2000s"
        },
        {
            "description": "Mellow songs from the 2010s. Cover: Adele",
            "spotifyId": "37i9dQZF1DX1uHCeFHcn8X",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f956f931f3f83d5316bda8be",
            "title": "Soft 10s"
        }
    ],
    "hiphop": [
        {
            "description": "Music from Future, Playboi Carti and Real Boston Richey. ",
            "spotifyId": "37i9dQZF1DX0XUsuxWHRQd",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d7f9ab95b206afaa4574f139",
            "title": "RapCaviar"
        },
        {
            "description": "Get your beast mode on!",
            "spotifyId": "37i9dQZF1DX76Wlfdnj7AP",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000021c85876e7d9b8633ec32a8b9",
            "title": "Beast Mode"
        },
        {
            "description": "Fourth quarter, two minutes left .. get locked in. Cover: Napheesa Collier",
            "spotifyId": "37i9dQZF1DWTl4y3vgJOXW",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000024689635e96b960d4b433bff2",
            "title": "Locked In"
        },
        {
            "description": "כל ההיפ הופ הישראלי במקום אחד. עטיפה: ישי סוויסה ומיכאל סוויסה  ",
            "spotifyId": "37i9dQZF1DX7Mc5eu3d1jD",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000284b3d839b1cf94ed8d5588fa",
            "title": "היפ הופ ישראלי"
        },
        {
            "description": "Real rap music from the golden era.",
            "spotifyId": "37i9dQZF1DX186v583rmzp",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028908106e49cde03e6d67073e",
            "title": "I Love My '90s Hip-Hop'"
        },
        {
            "description": "Energy tracks to get your beast mode on.",
            "spotifyId": "37i9dQZF1DX9oh43oAzkyx",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002d2d1cbd94520146a3fecc8fd",
            "title": "Beast Mode Hip-Hop"
        },
        {
            "description": "עשרים שנה של ההיפ הופ והראפ והפאנק הישראלי הכי טוב שיש בפלייליסט אחד",
            "spotifyId": "37i9dQZF1DXcjTanFJgRnM",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000291657aabe73bd125da139953",
            "title": "דור ההיפ הופ"
        },
        {
            "description": "Classic 90s and early 00s Hip-Hop for the ultimate house party. Cover: Missy Elliott",
            "spotifyId": "37i9dQZF1DX30w0JtSIv4j",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002196d7cc59d478e50ff6d8416",
            "title": "Old School Hip-Hop House Party"
        },
        {
            "description": "Laid back cratedigger hip-hop from around the world.",
            "spotifyId": "37i9dQZF1DX8Kgdykz6OKj",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028e709fabcdb701b300bf5684",
            "title": "Jazz Rap"
        },
        {
            "description": "Taking it way back! Cover: Mos Def",
            "spotifyId": "37i9dQZF1DWVA1Gq4XHa6U",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000231918fd3f54b55956da4f2d2",
            "title": "Gold School"
        }
    ],
    "latin": [
        {
            "description": "תורידו הילוך עם שירים ישראליים נעימים ומרגשים. קאבר: ניר כנען",
            "spotifyId": "37i9dQZF1DX5mMspCVmB8S",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002703a3cdf2d9b8e6fe01b26c5",
            "title": "צ'יל ישראלי"
        },
        {
            "description": "מוזיקה רגועה להורדת הלחץ",
            "spotifyId": "37i9dQZF1DXbmiyBesoBFy",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000028d9212333de7cb4e3c23a7b8",
            "title": "נושמים רגע"
        },
        {
            "description": "שירי אהבה יפים 💘",
            "spotifyId": "37i9dQZF1DX439u9DYdMGc",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000203e9ce7f1374059895a0930a",
            "title": "אהבה"
        },
        {
            "description": "להיטים שעושים מצב רוח. באחריות!",
            "spotifyId": "37i9dQZF1DWYbUY40ZDAwb",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000241391070e485ef137bd246a7",
            "title": "להיטים שמחים"
        },
        {
            "description": "Set the mood of your day with these happy songs.",
            "spotifyId": "37i9dQZF1DX0UrRvztWcAU",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000026b30471dcc036d254dcc8041",
            "title": "Wake Up Happy"
        },
        {
            "description": "Peaceful piano to help you slow down, breathe, and relax. ",
            "spotifyId": "37i9dQZF1DX4sWSpwq3LiO",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000283da657fca565320e9311863",
            "title": "Peaceful Piano"
        },
        {
            "description": "The summer needs dance hits 😎☀️",
            "spotifyId": "37i9dQZF1DWZ7eJRBxKzdO",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002c7ea8e62ee86671eaa4c341c",
            "title": "Summer Dance Hits 2024"
        },
        {
            "description": "Feel great with these timelessly fun songs!",
            "spotifyId": "37i9dQZF1DX7KNKjOK0o75",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000021a50f52ecd03dc8bd4efb2e5",
            "title": "Have a Great Day!"
        },
        {
            "description": "Hits to boost your mood and fill you with happiness!",
            "spotifyId": "37i9dQZF1DXdPec7aLTmlC",
            "imgUrl": "https://i.scdn.co/image/ab67706f0000000249a1ed33d2ca64e6a5d0e550",
            "title": "Happy Hits!"
        },
        {
            "description": "Kick back to the best new and recent chill hits.",
            "spotifyId": "37i9dQZF1DX4WYpdgoIcn6",
            "imgUrl": "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a",
            "title": "Chill Hits"
        },
        {
            "description": "Nurse your emotional wounds with these heartbreak tracks.",
            "spotifyId": "37i9dQZF1DXbrUpGvoi3TS",
            "imgUrl": "https://i.scdn.co/image/ab67706f00000002f2c72a29eafebf594195be53",
            "title": "Broken Heart"
        }
    ]
}

// Array of sample audio URLs that can be used for demo songs
const SAMPLE_AUDIO_URLS = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
];

/**
 * @param {number} count 
 * @param {Array} artists
 */
function _generateDemoSongs(count, artists) {
    const songs = [];
    for (let i = 0; i < count; i++) {
        const artist = getRandomItem(artists)
        const songId = _makeId(12)

        songs.push({
            id: songId,
            title: `${getRandomItem(SONG_ADJ)} ${getRandomItem(SONG_NOUN)}`,
            artists: artist.title,
            album: `${getRandomItem(ALBUM_NOUN)} ${getRandomItem(ALBUM_NOUN)}`,
            durationMs: getRandomInt(150000, 360000),
            imgUrl: artist.imgUrl,
            addedAt: Date.now() - getRandomInt(0, 31536000000),
            addedBy: 'u100',
            likedBy: [],
            isYouTube: false,
            youtubeVideoId: songId,
            // Add hard-coded audio URL for playback
            url: getRandomItem(SAMPLE_AUDIO_URLS)
        })
    }
    return songs
}

/**
 * @param {Array} allStations 
 */
function _createLikedSongsStation(allStations) {
    const allSongs = allStations.flatMap(station => station.songs)
    
    const likedSongsSample = []
    for (let i = 0; i < 25; i++) {
        if (allSongs.length > 0) {
            likedSongsSample.push(getRandomItem(allSongs));
        }
    }

    return {
        _id: 'liked-songs-station', 
        name: 'Liked Songs',
        description: 'Your collection of liked songs.',
        imgUrl: `https://picsum.photos/id/10/200`, 
        createdBy: {
            _id: 'u100',
            username: 'YOU'
        },
        songs: likedSongsSample, 
        likedByUsers: []
    };
}



function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getFromStorage(key) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
}

function _makeId(length = 6) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const SONG_ADJ = ['Electric', 'Silent', 'Golden', 'Lost', 'Midnight', 'Crimson', 'Fading', 'Broken', 'Wild', 'Cosmic'];
const SONG_NOUN = ['Echo', 'Stars', 'Night', 'Dream', 'Fire', 'Rain', 'Moment', 'Heart', 'Sun', 'Future'];
const ALBUM_NOUN = ['Chronicles', 'Journey', 'Tapes', 'Horizon', 'Odyssey', 'Letters', 'Memories', 'Spectrum'];