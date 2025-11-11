import { stationService } from '../../services/station'
import { userService } from '../../services/user'
import { store } from '../store'
import { ADD_STATION, REMOVE_STATION, SET_STATIONS, SET_STATION, UPDATE_STATION, ADD_STATION_MSG, LIKED_ID } from '../reducers/station.reducer'
import { PLAY_CONTEXT, SET_PLAY } from '../reducers/player.reducer'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { ADD_LIKED_SONG, REMOVE_LIKED_SONG } from '../reducers/user.reducer'
import { getAssetUrl, ASSET_PATHS } from '../../services/asset.service'

export async function loadStations(filterBy) {
  try {
    const stationsFromBackend = await stationService.query(filterBy)
    store.dispatch(getCmdSetStations(stationsFromBackend || []))
  } catch (err) {
    console.log('Cannot load stations', err)
    throw err
  }
}

export async function loadStation(stationId) {
  try {
    if (stationId === LIKED_ID) {
      const likedSongs = store.getState().userModule.likedSongs || []
      const likedStation = {
        _id: LIKED_ID,
        name: 'Liked Songs',
        songs: likedSongs,
        imgUrl: getAssetUrl(ASSET_PATHS.LIKED_SONGS),
        isLikedSongs: true,
        createdBy: { fullname: 'You' }
      }
      store.dispatch(getCmdSetStation(likedStation))
    } else {
      const station = await stationService.getById(stationId)
      store.dispatch(getCmdSetStation(station))
    }
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
    showErrorMsg('Cannot remove station')
    throw err
  }
}

export async function likeSong(song) {
  if (!song?.id) return;
  try {
    store.dispatch({ type: ADD_LIKED_SONG, song })
    await userService.addLikedSong(song)
    showSuccessMsg(`Added "${song.title}" to Liked Songs`)
  } catch (err) {
    console.error('Failed to like song via backend', err)
    showErrorMsg(`Could not like song: ${err.response?.data?.err || err.message || 'Server error'}`)
    store.dispatch({ type: REMOVE_LIKED_SONG, songId: song.id })
    throw err
  }
}

export async function unlikeSong(songId) {
  if (!songId) return
  const songToUnlike = store.getState().userModule.likedSongs.find(s => s.id === songId)
  try {
    store.dispatch({ type: REMOVE_LIKED_SONG, songId })
    await userService.removeLikedSong(songId)
    showSuccessMsg('Removed from Liked Songs')
  } catch (err) {
    console.error('Failed to unlike song via backend', err)
    showErrorMsg(`Could not unlike song: ${err.response?.data?.err || err.message || 'Server error'}`)
    if (songToUnlike) {
      store.dispatch({ type: ADD_LIKED_SONG, song: songToUnlike })
    }
    throw err
  }
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
    console.log(`Attempting to like station ${station._id}`)
    const updatedStation = await stationService.likeStation(station._id)
    store.dispatch(getCmdUpdateStation(updatedStation))
    showSuccessMsg(`Added "${station.name}" to your library`)
    return updatedStation
  } catch (err) {
    console.error('Failed to add station to library (likeStation):', err)
    showErrorMsg(`Could not add to library: ${err.response?.data?.err || err.message || 'Server error'}`)
    throw err
  }
}


export async function removeStationFromLibrary(station) {
  try {
    console.log(`Attempting to unlike station ${station._id}`)
    const updatedStation = await stationService.unlikeStation(station._id)
    store.dispatch(getCmdUpdateStation(updatedStation))
    showSuccessMsg(`Removed "${station.name}" from your library`)
    return updatedStation
  } catch (err) {
    console.error('Failed to remove station from library (unlikeStation):', err)
    showErrorMsg(`Could not remove from library: ${err.response?.data?.err || err.message || 'Server error'}`)
    throw err
  }
}

export async function addSongToStation(stationId, song) {
  try {
    const updatedStation = await stationService.addSong(stationId, song)
    store.dispatch(getCmdUpdateStation(updatedStation))
    showSuccessMsg('Song added to playlist')
    return updatedStation
  } catch (err) {
    console.error('Failed to add song to station via backend', err)
    showErrorMsg(`Could not add song: ${err.response?.data?.err || err.message || 'Server error'}`)
    throw err
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
  try {
    const updatedStation = await stationService.removeSong(stationId, songId)
    store.dispatch(getCmdUpdateStation(updatedStation))
    showSuccessMsg('Song removed from playlist')
    return updatedStation
  } catch (err) {
    console.error('Failed to remove song from station via backend', err)
    showErrorMsg(`Could not remove song: ${err.response?.data?.err || err.message || 'Server error'}`)
    throw err
  }
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