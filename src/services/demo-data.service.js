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

    let generatedStations = _generateDemoStations(generatedArtists)
    
    // Add some hardcoded stations with guaranteed audio
    const hardcodedStations = _createHardcodedStations()
    generatedStations = [...hardcodedStations, ...generatedStations]

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
// function _createLikedSongsStation(allStations) {
//     const allSongs = allStations.flatMap(station => station.songs)

//     const likedSongsSample = []
//     for (let i = 0; i < 25; i++) {
//         if (allSongs.length > 0) {
//             likedSongsSample.push(getRandomItem(allSongs));
//         }
//     }

//     return {
//         _id: 'liked-songs-station', 
//         name: 'Liked Songs',
//         description: 'Your collection of liked songs.',
//         imgUrl: `https://picsum.photos/id/10/200`, 
//         createdBy: {
//             _id: 'u100',
//             username: 'YOU'
//         },
//         songs: likedSongsSample, 
//         likedByUsers: []
//     };
// }



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