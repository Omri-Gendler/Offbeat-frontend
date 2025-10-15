
import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'
const LIKED_SONGS_KEY = 'likedSongsStation'
_createStations()

// const img = '/img/infected.jpg'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    getLikedSongsStation
}
window.cs = stationService


async function query(filterBy = { txt: '' }) {
    const stationsFromStorage = await storageService.query(STORAGE_KEY)
    const likedStation = getLikedSongsStation()
    const { txt, sortField, sortDir } = filterBy

    let allStations = [likedStation, ...stationsFromStorage]

    if (txt) {
        const regex = new RegExp(txt, 'i')
        allStations = allStations.filter(station => regex.test(station.name) || regex.test(station.description))
    }

    if (sortField === 'name') {
        allStations.sort((station1, station2) =>
            station1[sortField].localeCompare(station2[sortField]) * +sortDir
        )
    }

    return allStations
}



function getById(stationId) {

    if (stationId === 'liked-songs-station') {
        return getLikedSongsStation();
    }
    return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
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
    const station = getLikedSongsStation()
    station.songs.push(song)
    saveLikedSongsStation(station)
}

export async function removeLikedSong(songId) {
    const station = getLikedSongsStation()
    const songIdx = station.songs.findIndex(song => song.id === songId)
    if (songIdx !== -1) {
        station.songs.splice(songIdx, 1)
        saveLikedSongsStation(station)
    }
}

function _createStations() {
    let stations = loadFromStorage(STORAGE_KEY)
    if (!stations || !stations.length) {
        stations = [
            // {
            //     _id: 'station000',
            //     name: 'Liked Songs',
            //     tags: ['Rock', '80s', 'Classic'],
            //     imgUrl: '/img/liked-songs.jpeg',
            //     type: 'station',
            //     createdBy: {
            //         _id: 'u102',
            //         fullname: 'Muki Levi',
            //     },
            //     likedByUsers: ['u101', 'u103'],
            //     songs: [
            //         {
            //             id: 'lDK9QqIzhwk',
            //             title: "Livin' On A Prayer",
            //             artists: 'Bon Jovi',
            //             imgUrl: 'https://picsum.photos/300/300?random=2',
            //             addedBy: 'u102',
            //             likedBy: ['u101'],
            //             addedAt: 162521765262,
            //         },
            //         {
            //             id: '1w7OgIMMRc4',
            //             title: "Sweet Child O' Mine",
            //             artists: "Guns N' Roses",
            //             imgUrl: 'https://picsum.photos/300/300?random=3',
            //             addedBy: 'u101',
            //             likedBy: [],
            //             addedAt: 162531765262,
            //         },
            //     ],
            //     msgs: [{ id: 'm201', from: 'u103', txt: 'Classic!' }],
            // },
            {
                _id: 'station001',
                name: '80s Rock Anthems',
                tags: ['Rock', '80s', 'Classic'],
                imgUrl: 'https://picsum.photos/300/300?random=1',
                type: 'station',
                createdBy: {
                    _id: 'u102',
                    fullname: 'Muki Levi',
                },
                likedByUsers: ['u101', 'u103'],
                songs: [
                    {
                        id: 'lDK9QqIzhwk',
                        title: "Livin' On A Prayer",
                        artists: 'Bon Jovi',
                        imgUrl: 'https://picsum.photos/300/300?random=2',
                        addedBy: 'u102',
                        likedBy: ['u101'],
                        addedAt: 162521765262,
                    },
                    {
                        id: '1w7OgIMMRc4',
                        title: "Sweet Child O' Mine",
                        artists: "Guns N' Roses",
                        imgUrl: 'https://picsum.photos/300/300?random=3',
                        addedBy: 'u101',
                        likedBy: [],
                        addedAt: 162531765262,
                    },
                ],
                msgs: [{ id: 'm201', from: 'u103', txt: 'Classic!' }],
            },
            {
                _id: 'station002',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=2',
                type: 'station',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio',
                        artists: ['beats to relax/study to'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
            {
                _id: 'station003',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=3',
                type: 'station',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio',
                        artists: ['beats to relax/study to'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
            {
                _id: 'station004',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=4',
                type: 'station',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio',
                        artists: ['beats to relax/study to'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
            {
                _id: 'station005',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=5',
                type: 'station',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio',
                        artists: ['beats to relax/study to'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
            {
                _id: 'station006',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=1',
                type: 'station',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'beats to relax/study to',
                        artist: 'lofi hip hop radio',
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
            {
                _id: 'station007',
                name: 'Chill Lo-Fi Beats',
                tags: ['Lo-Fi', 'Chill', 'Study'],
                imgUrl: 'https://picsum.photos/300/300?random=1',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'https://picsum.photos/300/300?random=1',
                    type: 'station',

                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'beats to relax/study to',
                        artist: 'lofi hip hop radio',
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection',
                        artists: ['jinsang'],
                        imgUrl: 'https://picsum.photos/300/300?random=1',
                        addedBy: 'u103',
                        likedBy: [],
                        addedAt: 162551765262,
                    },
                ],
                msgs: [],
            },
        ]
        saveToStorage(STORAGE_KEY, stations)
    }
}

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

async function save(station) {
    let savedStation

    if (station._id) {
        // Include all fields you want to persist (not just name)
        const stationToSave = {
            ...station, // keep name, imgUrl, songs, etc.
        }

        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            name: station.name,
            owner: userService.getLoggedinUser(),
            msgs: [],
            imgUrl: station.imgUrl || '/img/infected.jpg',
        }

        savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }

    return savedStation
}


async function addStationMsg(stationId, txt) {
    // Later, this is all done by the backend
    const station = await getById(stationId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    station.msgs.push(msg)
    await storageService.put(STORAGE_KEY, station)

    return msg
}