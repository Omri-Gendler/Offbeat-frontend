import { httpService } from '../http.service'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    addSong,
    removeSong,
    likeStation,
    unlikeStation,
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

async function addSong(stationId, song) {
    const updatedStation = await httpService.post(`station/${stationId}/song`, song)
    return updatedStation
}

async function removeSong(stationId, songId) {
    const updatedStation = await httpService.delete(`station/${stationId}/song/${songId}`)
    return updatedStation
}

async function likeStation(stationId) {
    const updatedStation = await httpService.post(`station/${stationId}/like`)
    return updatedStation
}

async function unlikeStation(stationId) {
    const updatedStation = await httpService.delete(`station/${stationId}/like`)
    return updatedStation
}
// ------------------------------------

