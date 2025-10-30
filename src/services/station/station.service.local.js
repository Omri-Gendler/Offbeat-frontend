
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
    addSong,                // Add this function
    removeSong,             // Add this function  
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

async function addSong(stationId, song) {
    console.log(`🎵 LOCAL SERVICE: Adding song to station ${stationId}`, song)
    
    if (!song?.id) {
        throw new Error('Song must have an id')
    }
    
    // Handle liked songs station separately
    if (stationId === 'liked-songs-station') {
        return await addLikedSong(song)
    }
    
    try {
        const station = await getById(stationId)
        if (!station) {
            throw new Error(`Station with id ${stationId} not found`)
        }
        
        // Check if song already exists
        const exists = station.songs?.some(s => s.id === song.id)
        if (exists) {
            console.log(`Song ${song.title} already exists in station ${station.name}`)
            return station // Return station as-is if song already exists
        }
        
        // Add song to station
        const updatedStation = {
            ...station,
            songs: [
                ...(station.songs || []),
                {
                    ...song,
                    addedAt: song.addedAt || Date.now()
                }
            ]
        }
        
        // Save updated station
        const savedStation = await save(updatedStation)
        console.log(`✅ Song "${song.title}" added to station "${station.name}"`)
        return savedStation
        
    } catch (err) {
        console.error(`Failed to add song to station ${stationId}:`, err)
        throw err
    }
}

async function removeSong(stationId, songId) {
    console.log(`🎵 LOCAL SERVICE: Removing song ${songId} from station ${stationId}`)
    
    // Handle liked songs station separately
    if (stationId === 'liked-songs-station') {
        return await removeLikedSong(songId)
    }
    
    try {
        const station = await getById(stationId)
        if (!station) {
            throw new Error(`Station with id ${stationId} not found`)
        }
        
        // Find and remove song
        const songIndex = station.songs?.findIndex(s => s.id === songId)
        if (songIndex === -1) {
            console.log(`Song ${songId} not found in station ${station.name}`)
            return station // Return station as-is if song doesn't exist
        }
        
        // Remove song from station
        const updatedStation = {
            ...station,
            songs: [
                ...station.songs.slice(0, songIndex),
                ...station.songs.slice(songIndex + 1)
            ]
        }
        
        // Save updated station
        const savedStation = await save(updatedStation)
        console.log(`✅ Song removed from station "${station.name}"`)
        return savedStation
        
    } catch (err) {
        console.error(`Failed to remove song from station ${stationId}:`, err)
        throw err
    }
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

