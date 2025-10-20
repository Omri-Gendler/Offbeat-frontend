
import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'
const LIKED_SONGS_KEY = 'likedSongsStation'
_createStations()

// const img = '/img/infected.jpg'

// export const stationService = {
//     query,
//     getById,
//     save,
//     remove,
//     addStationMsg,
//     getLikedSongsStation
// }
// window.cs = stationService


// async function query(filterBy = { txt: '' }) {
//     const stationsFromStorage = await storageService.query(STORAGE_KEY)
//     const likedStation = getLikedSongsStation()
//     const { txt, sortField, sortDir } = filterBy

//     let allStations = [likedStation, ...stationsFromStorage]

//     if (txt) {
//         const regex = new RegExp(txt, 'i')
//         allStations = allStations.filter(station => regex.test(station.name) || regex.test(station.description))
//     }

//     if (sortField === 'name') {
//         allStations.sort((station1, station2) =>
//             station1[sortField].localeCompare(station2[sortField]) * +sortDir
//         )
//     }

//     return allStations
// }



// function getById(stationId) {

//     if (stationId === 'liked-songs-station') {
//         return getLikedSongsStation();
//     }
//     return storageService.get(STORAGE_KEY, stationId)
// }

async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
}

// function getLikedSongsStation() {
//     let station = loadFromStorage(LIKED_SONGS_KEY)
//     if (!station) {
//         station = { ...likedSongsStationTemplate }
//         saveToStorage(LIKED_SONGS_KEY, station)
//     }
//     return station
// }

// function saveLikedSongsStation(station) {
//     saveToStorage(LIKED_SONGS_KEY, station)
// }

// export async function addLikedSong(song) {
//     const station = getLikedSongsStation()
//     station.songs.push(song)
//     saveLikedSongsStation(station)
// }

// export async function removeLikedSong(songId) {
//     const station = getLikedSongsStation()
//     const songIdx = station.songs.findIndex(song => song.id === songId)
//     if (songIdx !== -1) {
//         station.songs.splice(songIdx, 1)
//         saveLikedSongsStation(station)
//     }
// }

// function _createStations() {
//     let stations = loadFromStorage(STORAGE_KEY)
//     if (!stations || !stations.length) {
//         stations = [
//             // {
//             //     _id: 'station000',
//             //     name: 'Liked Songs',
//             //     tags: ['Rock', '80s', 'Classic'],
//             //     imgUrl: '/img/liked-songs.jpeg',
//             //     type: 'station',
//             //     createdBy: {
//             //         _id: 'u102',
//             //         fullname: 'Muki Levi',
//             //     },
//             //     likedByUsers: ['u101', 'u103'],
//             //     songs: [
//             //         {
//             //             id: 'lDK9QqIzhwk',
//             //             title: "Livin' On A Prayer",
//             //             artists: 'Bon Jovi',
//             //             imgUrl: 'https://picsum.photos/300/300?random=2',
//             //             addedBy: 'u102',
//             //             likedBy: ['u101'],
//             //             addedAt: 162521765262,
//             //         },
//             //         {
//             //             id: '1w7OgIMMRc4',
//             //             title: "Sweet Child O' Mine",
//             //             artists: "Guns N' Roses",
//             //             imgUrl: 'https://picsum.photos/300/300?random=3',
//             //             addedBy: 'u101',
//             //             likedBy: [],
//             //             addedAt: 162531765262,
//             //         },
//             //     ],
//             //     msgs: [{ id: 'm201', from: 'u103', txt: 'Classic!' }],
//             // },
//             {
//                 _id: 'station001',
//                 name: '80s Rock Anthems',
//                 tags: ['Rock', '80s', 'Classic'],
//                 imgUrl: 'https://picsum.photos/300/300?random=1',
//                 type: 'station',
//                 createdBy: {
//                     _id: 'u102',
//                     fullname: 'Muki Levi',
//                 },
//                 likedByUsers: ['u101', 'u103'],
//                 songs: [
//                     {
//                         id: 'lDK9QqIzhwk',
//                         title: "Livin' On A Prayer",
//                         artists: 'Bon Jovi',
//                         imgUrl: 'https://picsum.photos/300/300?random=2',
//                         addedBy: 'u102',
//                         likedBy: ['u101'],
//                         addedAt: 162521765262,
//                     },
//                     {
//                         id: '1w7OgIMMRc4',
//                         title: "Sweet Child O' Mine",
//                         artists: "Guns N' Roses",
//                         imgUrl: 'https://picsum.photos/300/300?random=3',
//                         addedBy: 'u101',
//                         likedBy: [],
//                         addedAt: 162531765262,
//                     },
//                 ],
//                 msgs: [{ id: 'm201', from: 'u103', txt: 'Classic!' }],
//             },
//             {
//                 _id: 'station002',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=2',
//                 type: 'station',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'lofi hip hop radio',
//                         artists: ['beats to relax/study to'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//             {
//                 _id: 'station003',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=3',
//                 type: 'station',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'lofi hip hop radio',
//                         artists: ['beats to relax/study to'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//             {
//                 _id: 'station004',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=4',
//                 type: 'station',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'lofi hip hop radio',
//                         artists: ['beats to relax/study to'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//             {
//                 _id: 'station005',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=5',
//                 type: 'station',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'lofi hip hop radio',
//                         artists: ['beats to relax/study to'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//             {
//                 _id: 'station006',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=1',
//                 type: 'station',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'beats to relax/study to',
//                         artist: 'lofi hip hop radio',
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//             {
//                 _id: 'station007',
//                 name: 'Chill Lo-Fi Beats',
//                 tags: ['Lo-Fi', 'Chill', 'Study'],
//                 imgUrl: 'https://picsum.photos/300/300?random=1',

//                 createdBy: {
//                     _id: 'u103',
//                     fullname: 'Shuki Cohen',
//                     imgUrl: 'https://picsum.photos/300/300?random=1',
//                     type: 'station',

//                 },
//                 likedByUsers: ['u102', 'u104'],
//                 songs: [
//                     {
//                         id: '5AEbq6XbSO0',
//                         title: 'beats to relax/study to',
//                         artist: 'lofi hip hop radio',
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: ['u102', 'u104'],
//                         addedAt: 162541765262,
//                     },
//                     {
//                         id: 'DWcJFNfaw9c',
//                         title: 'Affection',
//                         artists: ['jinsang'],
//                         imgUrl: 'https://picsum.photos/300/300?random=1',
//                         addedBy: 'u103',
//                         likedBy: [],
//                         addedAt: 162551765262,
//                     },
//                 ],
//                 msgs: [],
//             },
//         ]
//         saveToStorage(STORAGE_KEY, stations)
//     }
// }

export const likedSongsStationTemplate = {
    _id: 'liked-songs-station',
    name: 'Liked Songs',
    songs: [],
    imgUrl: '/img/liked-songs.jpeg',
    isLikedSongs: true,
    createdBy: {
        fullname: 'You'
    }
}

// async function save(station) {
//     let savedStation

//     if (station._id) {
//         // Include all fields you want to persist (not just name)
//         const stationToSave = {
//             ...station, // keep name, imgUrl, songs, etc.
//         }

//         savedStation = await storageService.put(STORAGE_KEY, stationToSave)
//     } else {
//         const stationToSave = {
//             name: station.name,
//             owner: userService.getLoggedinUser(),
//             msgs: [],
//             imgUrl: station.imgUrl || '/img/infected.jpg',
//         }

//         savedStation = await storageService.post(STORAGE_KEY, stationToSave)
//     }

//     return savedStation
// }


// async function addStationMsg(stationId, txt) {
//     // Later, this is all done by the backend
//     const station = await getById(stationId)

//     const msg = {
//         id: makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     station.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, station)

//     return msg
// }

export const stationService = {
    query,
    getById,
    save,
    remove,
    getLikedSongsStation,
    addLikedSong,           // expose
    removeLikedSong         // expose
}

async function query(filterBy = { txt: '' }) {
    const stationsFromStorage = await storageService.query(STORAGE_KEY)
    const likedStation = getLikedSongsStation()
    const { txt, sortField, sortDir } = filterBy || {}

    let allStations = [likedStation, ...stationsFromStorage]

    if (txt) {
        const regex = new RegExp(txt, 'i')
        allStations = allStations.filter(station =>
            regex.test(station.name || '') ||
            regex.test(station.description || '')
        )
    }

    if (sortField === 'name') {
        const dir = +sortDir || 1
        allStations.sort((a, b) => (a.name || '').localeCompare(b.name || '') * dir)
    }

    return allStations
}

async function getById(stationId) {
    if (stationId === 'liked-songs-station') {
        // return a Promise to keep the API shape consistent
        return Promise.resolve(getLikedSongsStation())
    }
    return storageService.get(STORAGE_KEY, stationId)
}

function getLikedSongsStation() {
    let station = loadFromStorage(LIKED_SONGS_KEY)
    if (!station) {
        station = { ...likedSongsStationTemplate }
        saveToStorage(LIKED_SONGS_KEY, station)
    }
    return station
}

function saveLikedSongsStation(station) {
    saveToStorage(LIKED_SONGS_KEY, station)
}

export async function addLikedSong(song) {
    if (!song?.id) return
    const station = getLikedSongsStation()
    const exists = station.songs.some(s => s.id === song.id)
    if (!exists) {
        station.songs.push({
            ...song,
            addedAt: song.addedAt || Date.now()
        })
        saveLikedSongsStation(station)
    }
    return { ...station }
}

export async function removeLikedSong(songId) {
    const station = getLikedSongsStation()
    const idx = station.songs.findIndex(song => song.id === songId)
    if (idx !== -1) {
        station.songs.splice(idx, 1)
        saveLikedSongsStation(station)
    }
    return { ...station }
}

async function save(station) {
    // Handle the special Liked Songs doc separately
    if (station._id === 'liked-songs-station') {
        const merged = { ...getLikedSongsStation(), ...station }
        saveLikedSongsStation(merged)
        return merged
    }

    let savedStation
    if (station._id) {
        const stationToSave = { ...station }
        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            ...station,
            name: station.name,
            owner: userService.getLoggedinUser(),
            msgs: [],
            imgUrl: station.imgUrl || '/img/infected.jpg'
        }
        savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }
    return savedStation
}

function _createStations() {
    let stations = loadFromStorage(STORAGE_KEY)
    if (!stations || !stations.length) {
        stations = [

            {
                "_id": "liked-songs-station",
                "name": "Pop Hits",
                "tags": ["Pop", "Hits", "Charts"],
                "imgUrl": "https://picsum.photos/300/300?random=101",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song101",
                        "title": "Electric Dream",
                        "artists": "The Voyagers",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1001",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680000100000
                    },
                    {
                        "id": "song102",
                        "title": "Midnight Echo",
                        "artists": "Echo Chamber",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1002",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680000200000
                    },
                    {
                        "id": "song103",
                        "title": "Cosmic Moment",
                        "artists": "Starlight Drive",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1003",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u103"],
                        "addedAt": 1680000300000
                    }
                ],
                "msgs": [{ "id": "m101", "from": "u101", "txt": "Love this station!" }]
            },
            {
                "_id": "s101",
                "name": "Pop Hits",
                "tags": ["Pop", "Hits", "Charts"],
                "imgUrl": "https://picsum.photos/300/300?random=101",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song101",
                        "title": "Electric Dream",
                        "artists": "The Voyagers",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1001",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680000100000
                    },
                    {
                        "id": "song102",
                        "title": "Midnight Echo",
                        "artists": "Echo Chamber",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1002",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680000200000
                    },
                    {
                        "id": "song103",
                        "title": "Cosmic Moment",
                        "artists": "Starlight Drive",
                        "genre": "Pop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1003",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u103"],
                        "addedAt": 1680000300000
                    }
                ],
                "msgs": [{ "id": "m101", "from": "u101", "txt": "Love this station!" }]
            },
            {
                "_id": "s102",
                "name": "Rock Classics",
                "tags": ["Rock", "Classic", "70s", "80s"],
                "imgUrl": "https://picsum.photos/300/300?random=102",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u104"],
                "songs": [
                    {
                        "id": "song104",
                        "title": "Lost Fire",
                        "artists": "Lost Frequencies",
                        "genre": "Rock",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1004",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680000400000
                    },
                    {
                        "id": "song105",
                        "title": "Golden Rain",
                        "artists": "Solar Flare",
                        "genre": "Rock",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1005",
                        "addedBy": "u102",
                        "likedBy": ["u100", "u104"],
                        "addedAt": 1680000500000
                    },
                    {
                        "id": "song106",
                        "title": "Silent Star",
                        "artists": "Moonlit Sonata",
                        "genre": "Rock",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1006",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680000600000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s103",
                "name": "Hip-Hop Throwback",
                "tags": ["Hip-Hop", "90s", "Rap"],
                "imgUrl": "https://picsum.photos/300/300?random=103",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u102", "u103"],
                "songs": [
                    {
                        "id": "song107",
                        "title": "Blue Sun",
                        "artists": "Neon Ghosts",
                        "genre": "Hip-Hop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1007",
                        "addedBy": "u102",
                        "likedBy": ["u101"],
                        "addedAt": 1680000700000
                    },
                    {
                        "id": "song108",
                        "title": "Red Moon",
                        "artists": "River's End",
                        "genre": "Hip-Hop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1008",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680000800000
                    },
                    {
                        "id": "song109",
                        "title": "Happy Road",
                        "artists": "The Wanderers",
                        "genre": "Hip-Hop",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1009",
                        "addedBy": "u103",
                        "likedBy": ["u100", "u101", "u102"],
                        "addedAt": 1680000900000
                    }
                ],
                "msgs": [{ "id": "m103", "from": "u103", "txt": "Old school!" }]
            },
            {
                "_id": "s104",
                "name": "Chill Beats",
                "tags": ["Chill", "Lofi", "Beats", "Relax"],
                "imgUrl": "https://picsum.photos/300/300?random=104",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u104", "u105"],
                "songs": [
                    {
                        "id": "song110",
                        "title": "Sad Home",
                        "artists": "Midnight Collective",
                        "genre": "Chill",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1010",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680001000000
                    },
                    {
                        "id": "song111",
                        "title": "Lonely Ghost",
                        "artists": "Crystal Caves",
                        "genre": "Chill",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1011",
                        "addedBy": "u104",
                        "likedBy": ["u105"],
                        "addedAt": 1680001100000
                    },
                    {
                        "id": "song112",
                        "title": "Fast Wave",
                        "artists": "Shadow Runners",
                        "genre": "Chill",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1012",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680001200000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s105",
                "name": "Workout Power",
                "tags": ["Workout", "Electronic", "Energy"],
                "imgUrl": "https://picsum.photos/300/300?random=105",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u102", "u105"],
                "songs": [
                    {
                        "id": "song113",
                        "title": "Slow Sky",
                        "artists": "Horizon Line",
                        "genre": "Workout",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1013",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u102", "u105"],
                        "addedAt": 1680001300000
                    },
                    {
                        "id": "song114",
                        "title": "Bright River",
                        "artists": "Future Past",
                        "genre": "Workout",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1014",
                        "addedBy": "u102",
                        "likedBy": ["u101"],
                        "addedAt": 1680001400000
                    },
                    {
                        "id": "song115",
                        "title": "Dark Heart",
                        "artists": "Empty Space",
                        "genre": "Workout",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1015",
                        "addedBy": "u100",
                        "likedBy": ["u105"],
                        "addedAt": 1680001500000
                    }
                ],
                "msgs": [{ "id": "m105", "from": "u102", "txt": "Pumps me up!" }]
            },
            {
                "_id": "s106",
                "name": "Indie Folk",
                "tags": ["Indie", "Folk", "Acoustic"],
                "imgUrl": "https://picsum.photos/300/300?random=106",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u103", "u104"],
                "songs": [
                    {
                        "id": "song116",
                        "title": "Empty Whisper",
                        "artists": "The Voyagers",
                        "genre": "Indie",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1016",
                        "addedBy": "u103",
                        "likedBy": ["u104"],
                        "addedAt": 1680001600000
                    },
                    {
                        "id": "song117",
                        "title": "Crystal Shadow",
                        "artists": "Echo Chamber",
                        "genre": "Indie",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1017",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680001700000
                    },
                    {
                        "id": "song118",
                        "title": "Forgotten Horizon",
                        "artists": "Starlight Drive",
                        "genre": "Indie",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1018",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680001800000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s107",
                "name": "Jazz Cafe",
                "tags": ["Jazz", "Cafe", "Relax"],
                "imgUrl": "https://picsum.photos/300/300?random=107",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u105", "u106"],
                "songs": [
                    {
                        "id": "song119",
                        "title": "Stolen Memory",
                        "artists": "Lost Frequencies",
                        "genre": "Jazz",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1019",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u105"],
                        "addedAt": 1680001900000
                    },
                    {
                        "id": "song120",
                        "title": "Future Future",
                        "artists": "Solar Flare",
                        "genre": "Jazz",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1020",
                        "addedBy": "u100",
                        "likedBy": ["u106"],
                        "addedAt": 1680002000000
                    },
                    {
                        "id": "song121",
                        "title": "Electric Dream 2",
                        "artists": "Moonlit Sonata",
                        "genre": "Jazz",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1021",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680002100000
                    }
                ],
                "msgs": [{ "id": "m107", "from": "u106", "txt": "Perfect for coffee." }]
            },
            {
                "_id": "s108",
                "name": "Classical Focus",
                "tags": ["Classical", "Focus", "Study"],
                "imgUrl": "https://picsum.photos/300/300?random=108",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102"],
                "songs": [
                    {
                        "id": "song122",
                        "title": "Midnight Echo 2",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1022",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680002200000
                    },
                    {
                        "id": "song123",
                        "title": "Cosmic Moment 2",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1023",
                        "addedBy": "u102",
                        "likedBy": [],
                        "addedAt": 1680002300000
                    },
                    {
                        "id": "song124",
                        "title": "Lost Fire 2",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1024",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680002400000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s109",
                "name": "Country Roads",
                "tags": ["Country", "Road Trip"],
                "imgUrl": "https://picsum.photos/300/300?random=109",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u104"],
                "songs": [
                    {
                        "id": "song125",
                        "title": "Golden Rain 2",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1025",
                        "addedBy": "u101",
                        "likedBy": ["u104"],
                        "addedAt": 1680002500000
                    },
                    {
                        "id": "song126",
                        "title": "Silent Star 2",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1026",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680002600000
                    },
                    {
                        "id": "song127",
                        "title": "Blue Sun 2",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1027",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680002700000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s110",
                "name": "Reggae Vibes",
                "tags": ["Reggae", "Chill", "Vibes"],
                "imgUrl": "https://picsum.photos/300/300?random=110",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u103", "u106"],
                "songs": [
                    {
                        "id": "song128",
                        "title": "Red Moon 2",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1028",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u103"],
                        "addedAt": 1680002800000
                    },
                    {
                        "id": "song129",
                        "title": "Happy Road 2",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1029",
                        "addedBy": "u103",
                        "likedBy": ["u106"],
                        "addedAt": 1680002900000
                    },
                    {
                        "id": "song130",
                        "title": "Sad Home 2",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1030",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680003000000
                    }
                ],
                "msgs": [{ "id": "m110", "from": "u103", "txt": "Nice vibes" }]
            },
            {
                "_id": "s111",
                "name": "Heavy Metal",
                "tags": ["Metal", "Heavy", "Rock"],
                "imgUrl": "https://picsum.photos/300/300?random=111",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102"],
                "songs": [
                    {
                        "id": "song131",
                        "title": "Lonely Ghost 2",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1031",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680003100000
                    },
                    {
                        "id": "song132",
                        "title": "Fast Wave 2",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1032",
                        "addedBy": "u102",
                        "likedBy": [],
                        "addedAt": 1680003200000
                    },
                    {
                        "id": "song133",
                        "title": "Slow Sky 2",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1033",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680003300000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s112",
                "name": "Punk Anthems",
                "tags": ["Punk", "Rock", "70s"],
                "imgUrl": "https://picsum.photos/300/300?random=112",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u104"],
                "songs": [
                    {
                        "id": "song134",
                        "title": "Bright River 2",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1034",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680003400000
                    },
                    {
                        "id": "song135",
                        "title": "Dark Heart 2",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1035",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680003500000
                    },
                    {
                        "id": "song136",
                        "title": "Empty Whisper 2",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1036",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680003600000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s113",
                "name": "Funk & Soul",
                "tags": ["Funk", "Soul", "70s"],
                "imgUrl": "https://picsum.photos/300/300?random=113",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103", "u105"],
                "songs": [
                    {
                        "id": "song137",
                        "title": "Crystal Shadow 2",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1037",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u103"],
                        "addedAt": 1680003700000
                    },
                    {
                        "id": "song138",
                        "title": "Forgotten Horizon 2",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1038",
                        "addedBy": "u103",
                        "likedBy": ["u105"],
                        "addedAt": 1680003800000
                    },
                    {
                        "id": "song139",
                        "title": "Stolen Memory 2",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1039",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680003900000
                    }
                ],
                "msgs": [{ "id": "m113", "from": "u105", "txt": "Groovy" }]
            },
            {
                "_id": "s114",
                "name": "R&B Jams",
                "tags": ["R&B", "90s", "Slow Jams"],
                "imgUrl": "https://picsum.photos/300/300?random=114",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u106"],
                "songs": [
                    {
                        "id": "song140",
                        "title": "Future Future 2",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1040",
                        "addedBy": "u100",
                        "likedBy": ["u106"],
                        "addedAt": 1680004000000
                    },
                    {
                        "id": "song141",
                        "title": "Electric Sky",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1041",
                        "addedBy": "u101",
                        "likedBy": ["u100"],
                        "addedAt": 1680004100000
                    },
                    {
                        "id": "song142",
                        "title": "Midnight River",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1042",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680004200000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s115",
                "name": "Latin Fiesta",
                "tags": ["Latin", "Party", "Dance"],
                "imgUrl": "https://picsum.photos/300/300?random=115",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u103", "u104"],
                "songs": [
                    {
                        "id": "song143",
                        "title": "Cosmic Heart",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1043",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u103"],
                        "addedAt": 1680004300000
                    },
                    {
                        "id": "song144",
                        "title": "Lost Whisper",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1044",
                        "addedBy": "u103",
                        "likedBy": ["u104"],
                        "addedAt": 1680004400000
                    },
                    {
                        "id": "song145",
                        "title": "Golden Shadow",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1045",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680004500000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s116",
                "name": "K-Pop Stars",
                "tags": ["K-Pop", "Pop", "Korean"],
                "imgUrl": "https://picsum.photos/300/300?random=116",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u105"],
                "songs": [
                    {
                        "id": "song146",
                        "title": "Silent Horizon",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1046",
                        "addedBy": "u101",
                        "likedBy": ["u105"],
                        "addedAt": 1680004600000
                    },
                    {
                        "id": "song147",
                        "title": "Blue Memory",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1047",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680004700000
                    },
                    {
                        "id": "song148",
                        "title": "Red Future",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1048",
                        "addedBy": "u105",
                        "likedBy": ["u100", "u101"],
                        "addedAt": 1680004800000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s117",
                "name": "Ambient Sleep",
                "tags": ["Ambient", "Sleep", "Relax"],
                "imgUrl": "https://picsum.photos/300/300?random=117",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u103", "u106"],
                "songs": [
                    {
                        "id": "song149",
                        "title": "Happy Dream",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1049",
                        "addedBy": "u100",
                        "likedBy": ["u103", "u106"],
                        "addedAt": 1680004900000
                    },
                    {
                        "id": "song150",
                        "title": "Sad Echo",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1050",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680005000000
                    },
                    {
                        "id": "song151",
                        "title": "Lonely Moment",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1051",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680005100000
                    }
                ],
                "msgs": [{ "id": "m117", "from": "u106", "txt": "Good night" }]
            },
            {
                "_id": "s118",
                "name": "Techno Bunker",
                "tags": ["Techno", "Electronic", "Party"],
                "imgUrl": "https://picsum.photos/300/300?random=118",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u105"],
                "songs": [
                    {
                        "id": "song152",
                        "title": "Fast Fire",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1052",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680005200000
                    },
                    {
                        "id": "song153",
                        "title": "Slow Rain",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1053",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680005300000
                    },
                    {
                        "id": "song154",
                        "title": "Bright Star",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1054",
                        "addedBy": "u100",
                        "likedBy": ["u105"],
                        "addedAt": 1680005400000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s119",
                "name": "House Grooves",
                "tags": ["House", "Electronic", "Dance"],
                "imgUrl": "https://picsum.photos/300/300?random=119",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song155",
                        "title": "Dark Sun",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1055",
                        "addedBy": "u101",
                        "likedBy": ["u103"],
                        "addedAt": 1680005500000
                    },
                    {
                        "id": "song156",
                        "title": "Empty Moon",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1056",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680005600000
                    },
                    {
                        "id": "song157",
                        "title": "Crystal Road",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1057",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680005700000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s120",
                "name": "Acoustic Mornings",
                "tags": ["Acoustic", "Morning", "Chill"],
                "imgUrl": "https://picsum.photos/300/300?random=120",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u104", "u106"],
                "songs": [
                    {
                        "id": "song158",
                        "title": "Forgotten Home",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1058",
                        "addedBy": "u100",
                        "likedBy": ["u104", "u106"],
                        "addedAt": 1680005800000
                    },
                    {
                        "id": "song159",
                        "title": "Stolen Ghost",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1059",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680005900000
                    },
                    {
                        "id": "song160",
                        "title": "Future Wave",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1060",
                        "addedBy": "u106",
                        "likedBy": [],
                        "addedAt": 1680006000000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s121",
                "name": "Sad Songs",
                "tags": ["Sad", "Chill", "Ballads"],
                "imgUrl": "https://picsum.photos/300/300?random=121",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101"],
                "songs": [
                    {
                        "id": "song161",
                        "title": "Electric Sky",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1061",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680006100000
                    },
                    {
                        "id": "song162",
                        "title": "Midnight River",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1062",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680006200000
                    },
                    {
                        "id": "song163",
                        "title": "Cosmic Heart",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1063",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680006300000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s122",
                "name": "Happy Vibes",
                "tags": ["Happy", "Pop", "Uplifting"],
                "imgUrl": "https://picsum.photos/300/300?random=122",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u103", "u104"],
                "songs": [
                    {
                        "id": "song164",
                        "title": "Lost Whisper",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1064",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u103"],
                        "addedAt": 1680006400000
                    },
                    {
                        "id": "song165",
                        "title": "Golden Shadow",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1065",
                        "addedBy": "u102",
                        "likedBy": ["u104"],
                        "addedAt": 1680006500000
                    },
                    {
                        "id": "song166",
                        "title": "Silent Horizon",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1066",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680006600000
                    }
                ],
                "msgs": [{ "id": "m122", "from": "u103", "txt": "Good vibes only" }]
            },
            {
                "_id": "s123",
                "name": "Gaming Soundtrack",
                "tags": ["Gaming", "Focus", "Electronic"],
                "imgUrl": "https://picsum.photos/300/300?random=123",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u105", "u106"],
                "songs": [
                    {
                        "id": "song167",
                        "title": "Blue Memory",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1067",
                        "addedBy": "u100",
                        "likedBy": ["u105"],
                        "addedAt": 1680006700000
                    },
                    {
                        "id": "song168",
                        "title": "Red Future",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1068",
                        "addedBy": "u105",
                        "likedBy": ["u106"],
                        "addedAt": 1680006800000
                    },
                    {
                        "id": "song169",
                        "title": "Happy Dream",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1069",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680006900000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s124",
                "name": "Travel Diary",
                "tags": ["Travel", "Indie", "Pop"],
                "imgUrl": "https://picsum.photos/300/300?random=124",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song170",
                        "title": "Sad Echo",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1070",
                        "addedBy": "u103",
                        "likedBy": ["u101"],
                        "addedAt": 1680007000000
                    },
                    {
                        "id": "song171",
                        "title": "Lonely Moment",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1071",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680007100000
                    },
                    {
                        "id": "song172",
                        "title": "Fast Fire",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1072",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680007200000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s125",
                "name": "Love Ballads",
                "tags": ["Love", "Pop", "R&B"],
                "imgUrl": "https://picsum.photos/300/300?random=125",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u104", "u105"],
                "songs": [
                    {
                        "id": "song173",
                        "title": "Slow Rain",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1073",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u104"],
                        "addedAt": 1680007300000
                    },
                    {
                        "id": "song174",
                        "title": "Bright Star",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1074",
                        "addedBy": "u100",
                        "likedBy": ["u105"],
                        "addedAt": 1680007400000
                    },
                    {
                        "id": "song175",
                        "title": "Dark Sun",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1075",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680007500000
                    }
                ],
                "msgs": [{ "id": "m125", "from": "u101", "txt": "So romantic" }]
            },
            {
                "_id": "s126",
                "name": "80s Flashback",
                "tags": ["80s", "Pop", "Rock"],
                "imgUrl": "https://picsum.photos/300/300?random=126",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u106"],
                "songs": [
                    {
                        "id": "song176",
                        "title": "Empty Moon",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1076",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680007600000
                    },
                    {
                        "id": "song177",
                        "title": "Crystal Road",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1077",
                        "addedBy": "u106",
                        "likedBy": [],
                        "addedAt": 1680007700000
                    },
                    {
                        "id": "song178",
                        "title": "Forgotten Home",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1078",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u106"],
                        "addedAt": 1680007800000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s127",
                "name": "90s Nostalgia",
                "tags": ["90s", "Pop", "Hip-Hop"],
                "imgUrl": "https://picsum.photos/300/300?random=127",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103", "u104"],
                "songs": [
                    {
                        "id": "song179",
                        "title": "Stolen Ghost",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1079",
                        "addedBy": "u103",
                        "likedBy": ["u101"],
                        "addedAt": 1680007900000
                    },
                    {
                        "id": "song180",
                        "title": "Future Wave",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1080",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680008000000
                    },
                    {
                        "id": "song181",
                        "title": "Electric Dream 3",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1081",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680008100000
                    }
                ],
                "msgs": [{ "id": "m127", "from": "u104", "txt": "Takes me back" }]
            },
            {
                "_id": "s128",
                "name": "2000s Hits",
                "tags": ["2000s", "Pop", "R&B"],
                "imgUrl": "https://picsum.photos/300/300?random=128",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u105"],
                "songs": [
                    {
                        "id": "song182",
                        "title": "Midnight Echo 3",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1082",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u105"],
                        "addedAt": 1680008200000
                    },
                    {
                        "id": "song183",
                        "title": "Cosmic Moment 3",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1083",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680008300000
                    },
                    {
                        "id": "song184",
                        "title": "Lost Fire 3",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1084",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680008400000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s129",
                "name": "New Releases",
                "tags": ["New", "Pop", "Hits"],
                "imgUrl": "https://picsum.photos/300/300?random=129",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song185",
                        "title": "Golden Rain 3",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1085",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u103"],
                        "addedAt": 1680008500000
                    },
                    {
                        "id": "song186",
                        "title": "Silent Star 3",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1086",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680008600000
                    },
                    {
                        "id": "song187",
                        "title": "Blue Sun 3",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1087",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680008700000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s130",
                "name": "Top 50 Global",
                "tags": ["Charts", "Hits", "Global"],
                "imgUrl": "https://picsum.photos/300/300?random=130",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u102", "u103", "u104"],
                "songs": [
                    {
                        "id": "song188",
                        "title": "Red Moon 3",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1088",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u102"],
                        "addedAt": 1680008800000
                    },
                    {
                        "id": "song189",
                        "title": "Happy Road 3",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1089",
                        "addedBy": "u102",
                        "likedBy": ["u103", "u104"],
                        "addedAt": 1680008900000
                    },
                    {
                        "id": "song190",
                        "title": "Sad Home 3",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1090",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680009000000
                    }
                ],
                "msgs": [{ "id": "m130", "from": "u104", "txt": "All the hits!" }]
            },
            {
                "_id": "s131",
                "name": "Coffee Shop Blend",
                "tags": ["Acoustic", "Chill", "Cafe"],
                "imgUrl": "https://picsum.photos/300/300?random=131",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u103", "u105"],
                "songs": [
                    {
                        "id": "song191",
                        "title": "Lonely Ghost 3",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1091",
                        "addedBy": "u100",
                        "likedBy": ["u103", "u105"],
                        "addedAt": 1680009100000
                    },
                    {
                        "id": "song192",
                        "title": "Fast Wave 3",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1092",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680009200000
                    },
                    {
                        "id": "song193",
                        "title": "Slow Sky 3",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1093",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680009300000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s132",
                "name": "Rainy Day Mood",
                "tags": ["Chill", "Sad", "Acoustic"],
                "imgUrl": "https://picsum.photos/300/300?random=132",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u106"],
                "songs": [
                    {
                        "id": "song194",
                        "title": "Bright River 3",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1094",
                        "addedBy": "u101",
                        "likedBy": ["u106"],
                        "addedAt": 1680009400000
                    },
                    {
                        "id": "song195",
                        "title": "Dark Heart 3",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1095",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680009500000
                    },
                    {
                        "id": "song196",
                        "title": "Empty Whisper 3",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1096",
                        "addedBy": "u106",
                        "likedBy": [],
                        "addedAt": 1680009600000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s133",
                "name": "Midnight Drive",
                "tags": ["Electronic", "Vibes", "Drive"],
                "imgUrl": "https://picsum.photos/300/300?random=133",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u104"],
                "songs": [
                    {
                        "id": "song197",
                        "title": "Crystal Shadow 3",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1097",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u104"],
                        "addedAt": 1680009700000
                    },
                    {
                        "id": "song198",
                        "title": "Forgotten Horizon 3",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1098",
                        "addedBy": "u102",
                        "likedBy": [],
                        "addedAt": 1680009800000
                    },
                    {
                        "id": "song199",
                        "title": "Stolen Memory 3",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1099",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680009900000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s134",
                "name": "Morning Commute",
                "tags": ["Pop", "Podcast", "Morning"],
                "imgUrl": "https://picsum.photos/300/300?random=134",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101"],
                "songs": [
                    {
                        "id": "song200",
                        "title": "Future Future 3",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1100",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680010000000
                    },
                    {
                        "id": "song201",
                        "title": "Electric Dream 4",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1101",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680010100000
                    },
                    {
                        "id": "song202",
                        "title": "Midnight Echo 4",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1102",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680010200000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s135",
                "name": "Evening Unwind",
                "tags": ["Chill", "Jazz", "Relax"],
                "imgUrl": "https://picsum.photos/300/300?random=135",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u103", "u104", "u106"],
                "songs": [
                    {
                        "id": "song203",
                        "title": "Cosmic Moment 4",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1103",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680010300000
                    },
                    {
                        "id": "song204",
                        "title": "Lost Fire 4",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1104",
                        "addedBy": "u104",
                        "likedBy": ["u106"],
                        "addedAt": 1680010400000
                    },
                    {
                        "id": "song205",
                        "title": "Golden Rain 4",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1105",
                        "addedBy": "u100",
                        "likedBy": ["u103", "u104"],
                        "addedAt": 1680010500000
                    }
                ],
                "msgs": [{ "id": "m135", "from": "u106", "txt": "Perfect way to end the day" }]
            },
            {
                "_id": "s136",
                "name": "Party Playlist",
                "tags": ["Party", "Dance", "Pop", "Hip-Hop"],
                "imgUrl": "https://picsum.photos/300/300?random=136",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u102", "u105"],
                "songs": [
                    {
                        "id": "song206",
                        "title": "Silent Star 4",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1106",
                        "addedBy": "u102",
                        "likedBy": ["u101", "u105"],
                        "addedAt": 1680010600000
                    },
                    {
                        "id": "song207",
                        "title": "Blue Sun 4",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1107",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680010700000
                    },
                    {
                        "id": "song208",
                        "title": "Red Moon 4",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1108",
                        "addedBy": "u105",
                        "likedBy": ["u102"],
                        "addedAt": 1680010800000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s137",
                "name": "Breakup Anthems",
                "tags": ["Breakup", "Sad", "Pop"],
                "imgUrl": "https://picsum.photos/300/300?random=137",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101"],
                "songs": [
                    {
                        "id": "song209",
                        "title": "Happy Road 4",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1109",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680010900000
                    },
                    {
                        "id": "song210",
                        "title": "Sad Home 4",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1110",
                        "addedBy": "u101",
                        "likedBy": [],
                        "addedAt": 1680011000000
                    },
                    {
                        "id": "song211",
                        "title": "Lonely Ghost 4",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1111",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680011100000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s138",
                "name": "Blues Bar",
                "tags": ["Blues", "Classic", "Guitar"],
                "imgUrl": "https://picsum.photos/300/300?random=138",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u106"],
                "songs": [
                    {
                        "id": "song212",
                        "title": "Fast Wave 4",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1112",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u106"],
                        "addedAt": 1680011200000
                    },
                    {
                        "id": "song213",
                        "title": "Slow Sky 4",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1113",
                        "addedBy": "u102",
                        "likedBy": [],
                        "addedAt": 1680011300000
                    },
                    {
                        "id": "song214",
                        "title": "Bright River 4",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1114",
                        "addedBy": "u100",
                        "likedBy": ["u106"],
                        "addedAt": 1680011400000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s139",
                "name": "J-Rock",
                "tags": ["J-Rock", "Rock", "Japanese"],
                "imgUrl": "https://picsum.photos/300/300?random=139",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u105"],
                "songs": [
                    {
                        "id": "song215",
                        "title": "Dark Heart 4",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1115",
                        "addedBy": "u100",
                        "likedBy": ["u105"],
                        "addedAt": 1680011500000
                    },
                    {
                        "id": "song216",
                        "title": "Empty Whisper 4",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1116",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680011600000
                    },
                    {
                        "id": "song217",
                        "title": "Crystal Shadow 4",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1117",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680011700000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s140",
                "name": "Trance Energy",
                "tags": ["Trance", "Electronic", "Energy"],
                "imgUrl": "https://picsum.photos/300/300?random=140",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u104"],
                "songs": [
                    {
                        "id": "song218",
                        "title": "Forgotten Horizon 4",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1118",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680011800000
                    },
                    {
                        "id": "song219",
                        "title": "Stolen Memory 4",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1119",
                        "addedBy": "u104",
                        "likedBy": ["u100"],
                        "addedAt": 1680011900000
                    },
                    {
                        "id": "song220",
                        "title": "Future Future 4",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1120",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u104"],
                        "addedAt": 1680012000000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s141",
                "name": "Drum & Bass",
                "tags": ["DnB", "Electronic", "Fast"],
                "imgUrl": "https://picsum.photos/300/300?random=141",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102"],
                "songs": [
                    {
                        "id": "song221",
                        "title": "Electric Sky 2",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1121",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680012100000
                    },
                    {
                        "id": "song222",
                        "title": "Midnight River 2",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1122",
                        "addedBy": "u102",
                        "likedBy": [],
                        "addedAt": 1680012200000
                    },
                    {
                        "id": "song223",
                        "title": "Cosmic Heart 2",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1123",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680012300000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s142",
                "name": "Gospel Greats",
                "tags": ["Gospel", "Uplifting", "Soul"],
                "imgUrl": "https://picsum.photos/300/300?random=142",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u103"],
                "songs": [
                    {
                        "id": "song224",
                        "title": "Lost Whisper 2",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1124",
                        "addedBy": "u101",
                        "likedBy": ["u103"],
                        "addedAt": 1680012400000
                    },
                    {
                        "id": "song225",
                        "title": "Golden Shadow 2",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1125",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680012500000
                    },
                    {
                        "id": "song226",
                        "title": "Silent Horizon 2",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1126",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680012600000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s143",
                "name": "Movie Soundtracks",
                "tags": ["Soundtrack", "Movie", "Classical"],
                "imgUrl": "https://picsum.photos/300/300?random=143",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u104", "u105"],
                "songs": [
                    {
                        "id": "song227",
                        "title": "Blue Memory 2",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1127",
                        "addedBy": "u100",
                        "likedBy": ["u104", "u105"],
                        "addedAt": 1680012700000
                    },
                    {
                        "id": "song228",
                        "title": "Red Future 2",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1128",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680012800000
                    },
                    {
                        "id": "song229",
                        "title": "Happy Dream 2",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1129",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680012900000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s144",
                "name": "Broadway Hits",
                "tags": ["Broadway", "Showtunes", "Musicals"],
                "imgUrl": "https://picsum.photos/300/300?random=144",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u106"],
                "songs": [
                    {
                        "id": "song230",
                        "title": "Sad Echo 2",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1130",
                        "addedBy": "u100",
                        "likedBy": ["u101"],
                        "addedAt": 1680013000000
                    },
                    {
                        "id": "song231",
                        "title": "Lonely Moment 2",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1131",
                        "addedBy": "u101",
                        "likedBy": ["u106"],
                        "addedAt": 1680013100000
                    },
                    {
                        "id": "song232",
                        "title": "Fast Fire 2",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1132",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680013200000
                    }
                ],
                "msgs": [{ "id": "m144", "from": "u101", "txt": "Love musicals!" }]
            },
            {
                "_id": "s145",
                "name": "Spoken Word",
                "tags": ["Podcast", "Spoken Word", "Talk"],
                "imgUrl": "https://picsum.photos/300/300?random=145",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u103"],
                "songs": [
                    {
                        "id": "song233",
                        "title": "Slow Rain 2",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1133",
                        "addedBy": "u100",
                        "likedBy": ["u103"],
                        "addedAt": 1680013300000
                    },
                    {
                        "id": "song234",
                        "title": "Bright Star 2",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1134",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680013400000
                    },
                    {
                        "id": "song235",
                        "title": "Dark Sun 2",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1135",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680013500000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s146",
                "name": "Yoga & Meditation",
                "tags": ["Meditation", "Yoga", "Ambient", "Relax"],
                "imgUrl": "https://picsum.photos/300/300?random=146",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u104", "u106"],
                "songs": [
                    {
                        "id": "song236",
                        "title": "Empty Moon 2",
                        "artists": "The Voyagers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1136",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u104"],
                        "addedAt": 1680013600000
                    },
                    {
                        "id": "song237",
                        "title": "Crystal Road 2",
                        "artists": "Echo Chamber",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1137",
                        "addedBy": "u104",
                        "likedBy": ["u106"],
                        "addedAt": 1680013700000
                    },
                    {
                        "id": "song238",
                        "title": "Forgotten Home 2",
                        "artists": "Starlight Drive",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1138",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680013800000
                    }
                ],
                "msgs": [{ "id": "m146", "from": "u104", "txt": "Namaste" }]
            },
            {
                "_id": "s147",
                "name": "Afrobeats",
                "tags": ["Afrobeats", "Dance", "Party"],
                "imgUrl": "https://picsum.photos/300/300?random=147",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u103"],
                "songs": [
                    {
                        "id": "song239",
                        "title": "Stolen Ghost 2",
                        "artists": "Lost Frequencies",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1139",
                        "addedBy": "u102",
                        "likedBy": ["u103"],
                        "addedAt": 1680013900000
                    },
                    {
                        "id": "song240",
                        "title": "Future Wave 2",
                        "artists": "Solar Flare",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1140",
                        "addedBy": "u100",
                        "likedBy": ["u102"],
                        "addedAt": 1680014000000
                    },
                    {
                        "id": "song241",
                        "title": "Electric Sky 3",
                        "artists": "Moonlit Sonata",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1141",
                        "addedBy": "u103",
                        "likedBy": [],
                        "addedAt": 1680014100000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s148",
                "name": "Desert Rock",
                "tags": ["Rock", "Stoner", "Desert"],
                "imgUrl": "https://picsum.photos/300/300?random=148",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u102", "u105"],
                "songs": [
                    {
                        "id": "song242",
                        "title": "Midnight River 3",
                        "artists": "Neon Ghosts",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1142",
                        "addedBy": "u100",
                        "likedBy": ["u102", "u105"],
                        "addedAt": 1680014200000
                    },
                    {
                        "id": "song243",
                        "title": "Cosmic Heart 3",
                        "artists": "River's End",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1143",
                        "addedBy": "u105",
                        "likedBy": [],
                        "addedAt": 1680014300000
                    },
                    {
                        "id": "song244",
                        "title": "Lost Whisper 3",
                        "artists": "The Wanderers",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1144",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680014400000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s149",
                "name": "Synthwave",
                "tags": ["Synthwave", "80s", "Electronic", "Retro"],
                "imgUrl": "https://picsum.photos/300/300?random=149",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u104"],
                "songs": [
                    {
                        "id": "song245",
                        "title": "Golden Shadow 3",
                        "artists": "Midnight Collective",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1145",
                        "addedBy": "u100",
                        "likedBy": ["u104"],
                        "addedAt": 1680014500000
                    },
                    {
                        "id": "song246",
                        "title": "Silent Horizon 3",
                        "artists": "Crystal Caves",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1146",
                        "addedBy": "u104",
                        "likedBy": [],
                        "addedAt": 1680014600000
                    },
                    {
                        "id": "song247",
                        "title": "Blue Memory 3",
                        "artists": "Shadow Runners",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1147",
                        "addedBy": "u100",
                        "likedBy": [],
                        "addedAt": 1680014700000
                    }
                ],
                "msgs": []
            },
            {
                "_id": "s150",
                "name": "Lo-Fi Study",
                "tags": ["Lofi", "Study", "Focus", "Beats"],
                "imgUrl": "https://picsum.photos/300/300?random=150",
                "type": "station",
                "createdBy": { "_id": "u100", "fullname": "YOU" },
                "likedByUsers": ["u101", "u102", "u103", "u104", "u105", "u106"],
                "songs": [
                    {
                        "id": "song248",
                        "title": "Red Future 3",
                        "artists": "Horizon Line",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1148",
                        "addedBy": "u100",
                        "likedBy": ["u101", "u102"],
                        "addedAt": 1680014800000
                    },
                    {
                        "id": "song249",
                        "title": "Happy Dream 3",
                        "artists": "Future Past",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1149",
                        "addedBy": "u103",
                        "likedBy": ["u104", "u105"],
                        "addedAt": 1680014900000
                    },
                    {
                        "id": "song250",
                        "title": "Sad Echo 3",
                        "artists": "Empty Space",
                        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                        "imgUrl": "https://picsum.photos/300/300?random=1150",
                        "addedBy": "u100",
                        "likedBy": ["u106"],
                        "addedAt": 1680015000000
                    }
                ],
                "msgs": [{ "id": "m150", "from": "u102", "txt": "Helps me focus." }]
            }
        ]

        saveToStorage(STORAGE_KEY, stations)
    }
}
