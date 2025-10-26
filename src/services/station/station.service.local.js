
import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stationDB'
const LIKED_SONGS_KEY = 'likedSongsStation'
// _createStations()

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
async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
}

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
    
    try {
        // First try to get from our stationDB
        const stations = loadFromStorage(STORAGE_KEY) || []
        const station = stations.find(s => s._id === stationId)
        if (station) {
            return Promise.resolve(station)
        }
        
        // If not found, try the async storage service as fallback
        return storageService.get('stationDB', stationId)
    } catch (err) {
        console.error(`Cannot find station with id: ${stationId}`, err)
        throw new Error(`Get failed, cannot find entity with id: ${stationId} in: stationDB`)
    }
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

