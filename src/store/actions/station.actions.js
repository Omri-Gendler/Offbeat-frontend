// import { stationService } from '../../services/station'
import { stationService } from '../../services/station/station.service.local'
import { store } from '../store'
import { ADD_STATION, REMOVE_STATION, SET_STATIONS, SET_STATION, UPDATE_STATION, ADD_STATION_MSG, LIKE_SONG, UNLIKE_SONG, ADD_SONG_TO_STATION, REMOVE_SONG_FROM_STATION } from '../reducers/station.reducer'
import { PLAY_CONTEXT, SET_PLAY } from '../reducers/player.reducer'
import { showSuccessMsg } from '../../services/event-bus.service'
import { Modal } from '@mui/material'




export async function loadStations(filterBy) {
  try {
    const stations = await stationService.query(filterBy)
    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log('Cannot load stations', err)
    throw err
  }
}

export async function loadStation(stationId) {
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
  } catch (err) {
    console.log('Cannot load station', err)
    throw err
  }
}


export async function removeStation(stationId) {
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
    showSuccessMsg('Station removed')
  } catch (err) {
    console.log('Cannot remove station', err)
    showSuccessMsg('Cannot remove station')
    throw err
  }
}

export async function likeSong(song) {
  const likedStation = await stationService.addLikedSong(song)   // must return station
  store.dispatch({ type: UPDATE_STATION, station: likedStation })
  return likedStation
}

export async function unlikeSong(songId) {
  const likedStation = await stationService.removeLikedSong(songId) // must return station
  store.dispatch({ type: UPDATE_STATION, station: likedStation })
  return likedStation
}

export function playSong(song) {
  if (!song) return
  const action = { type: PLAY_CONTEXT, payload: { queue: [song], index: 0, contextId: song.id, contextType: 'song' } }
  store.dispatch(action)
  store.dispatch({ type: SET_PLAY, isPlaying: true })
  return action
}

export async function addStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdAddStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot add station', err)
    throw err
  }
}

export async function addStationToLibrary(station) {
  try {
    const stationToAdd = {
      ...station,
      createdBy: { fullname: 'You' }
    }

    const savedStation = await stationService.save(stationToAdd)

    store.dispatch({
      type: UPDATE_STATION,
      station: savedStation
    })

  } catch (err) {
    console.error('Failed to add station to library:', err)
  }
}




export async function addSongToStation(stationId, song) {
  try {

    const station = await stationService.getById(stationId)

    if (station.songs?.some(s => s.id === song.id)) return station

    const songToAdd = {
      ...song,
      addedAt: Date.now(),
    }

    const updatedStation = {
      ...station,
      songs: [...(station.songs || []), songToAdd],
    }

    const saved = await stationService.save(updatedStation)


    store.dispatch({ type: UPDATE_STATION, station: saved })
    return saved
  } catch (err) {
    console.error('Failed to add song to station', err)
    throw err
  }
}


export async function removeStationFromLibrary(station) {
  try {
    const stationToRemove = {
      ...station,
      createdBy: { fullname: 'General' }
    }

    const savedStation = await stationService.save(stationToRemove)

    store.dispatch({
      type: UPDATE_STATION,
      station: savedStation
    })

  } catch (err) {
    console.error('Failed to remove station from library:', err)
  }
}

export async function updateStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot save station', err)
    throw err
  }
}


export const setUpdatedStation = station => ({ type: UPDATE_STATION, station })


export async function addStationMsg(stationId, txt) {
  try {
    const msg = await stationService.addStationMsg(stationId, txt)
    store.dispatch(getCmdAddStationMsg(msg))
    return msg
  } catch (err) {
    console.log('Cannot add station msg', err)
    throw err
  }
}


export async function removeSongFromStation(stationId, songId) {
  if (typeof stationService.removeSongFromStation === 'function') {
    const updated = await stationService.removeSongFromStation(stationId, songId)
    store.dispatch(getCmdUpdateStation(updated))
    return updated
  }
  const action = getCmdRemoveSongFromStation(stationId, songId)
  store.dispatch(action)
  return action
}


function getCmdSetStations(stations) {
  return { type: SET_STATIONS, stations }
}

function getCmdSetStation(station) {
  return { type: SET_STATION, station }
}

function getCmdAddStation(station) {
  return { type: ADD_STATION, station }
}

function getCmdUpdateStation(station) {
  return { type: UPDATE_STATION, station }
}

function getCmdRemoveStation(stationId) {
  return { type: REMOVE_STATION, stationId }
}

function getCmdAddStationMsg(stationId, msg) {
  return { type: ADD_STATION_MSG, stationId, msg }
}

function getCmdAddSongToStation(stationId, song) {
  return { type: ADD_SONG_TO_STATION, stationId, song }
}

function getCmdRemoveSongFromStation(stationId, songId) {
  return { type: REMOVE_SONG_FROM_STATION, stationId, songId }
}

// unitTestActions()
async function unitTestActions() {
  await loadStations()
  await addStation(stationService.getEmptyStation())
  await updateStation({
    _id: 'm1oC7',
    name: 'Station-Good',
  })
  await removeStation('m1oC7')
  // TODO unit test addStationMsg
}
