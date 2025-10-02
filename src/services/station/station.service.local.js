
import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'
_createStations()

// const img = '/img/infected.jpg'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg
}
window.cs = stationService


async function query(filterBy = { txt: '' }) {
    var stations = await storageService.query(STORAGE_KEY)
    const { txt, sortField, sortDir } = filterBy
    console.log('stations:', stations)

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stations = stations.filter(station => regex.test(station.name) || regex.test(station.description))
    }

    if (sortField === 'name') {
        stations.sort((station1, station2) =>
            station1[sortField].localeCompare(station2[sortField]) * +sortDir)
    }
    return stations
}

function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
}

function _createStations() {
    let stations = loadFromStorage(STORAGE_KEY)
    if (!stations || !stations.length) {
        stations = [
            {
                _id: 'station001',
                name: '80s Rock Anthems',
                tags: ['Rock', '80s', 'Classic'],
                imgUrl: './img/infected.jpg',
                createdBy: {
                    _id: 'u102',
                    fullname: 'Muki Levi',
                },
                likedByUsers: ['u101', 'u103'],
                songs: [
                    {
                        id: 'lDK9QqIzhwk',
                        title: "Bon Jovi - Livin' On A Prayer",
                        url: 'youtube/song.mp4',
                        addedBy: 'u102',
                        likedBy: ['u101'],
                        addedAt: 162521765262,
                    },
                    {
                        id: '1w7OgIMMRc4',
                        title: "Guns N' Roses - Sweet Child O' Mine",
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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
                imgUrl: './img/infected.jpg',

                createdBy: {
                    _id: 'u103',
                    fullname: 'Shuki Cohen',
                    imgUrl: 'http://some-photo/shuki.jpg',
                },
                likedByUsers: ['u102', 'u104'],
                songs: [
                    {
                        id: '5AEbq6XbSO0',
                        title: 'lofi hip hop radio - beats to relax/study to',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/5AEbq6XbSO0/mqdefault.jpg',
                        addedBy: 'u103',
                        likedBy: ['u102', 'u104'],
                        addedAt: 162541765262,
                    },
                    {
                        id: 'DWcJFNfaw9c',
                        title: 'Affection - Jinsang',
                        url: 'youtube/song.mp4',
                        imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
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

async function save(station) {
    var savedStation
    if (station._id) {
        const stationToSave = {
            _id: station._id,
            name: station.name,
        }
        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            name: station.name,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
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