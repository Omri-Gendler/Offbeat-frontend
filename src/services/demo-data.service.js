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

    console.log('Generating new demo data...')
    
    const generatedArtists = _generateDemoArtists()
    saveToStorage('artistDB', generatedArtists)

    let generatedStations = _generateDemoStations(generatedArtists)

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
            youtubeVideoId: songId
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