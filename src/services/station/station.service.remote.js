import { httpService } from '../http.service'

const LIKED_SONGS_KEY = 'likedSongsStation'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    addSong,
    removeSong,
    getLikedSongsStation,
}

function getLikedSongsStation() {
    let station = loadFromStorage(LIKED_SONGS_KEY);
    if (!station) {
        // Use the imported template
        station = { ...likedSongsStationTemplate, songs: [] }; // Ensure songs array is present
        saveToStorage(LIKED_SONGS_KEY, station);
    }
    // Ensure songs array exists even if loaded data is malformed
    if (!Array.isArray(station.songs)) {
        station.songs = [];
    }
    return station
}

function saveLikedSongsStation(station) {
    saveToStorage(LIKED_SONGS_KEY, station);
}

async function addSong(stationId, song) {
    const updatedStation = await httpService.post(`station/${stationId}/song`, song)
    return updatedStation
}

async function removeSong(stationId, songId) {
    const updatedStation = await httpService.delete(`station/${stationId}/song/${songId}`)
    return updatedStation
}

async function query(filterBy = { txt: '' }) {
    return httpService.get(`station`, filterBy)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}
async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)
    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const savedMsg = await httpService.post(`station/${stationId}/msg`, { txt })
    return savedMsg
}