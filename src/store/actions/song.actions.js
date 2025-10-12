import { store } from '../store';
import {
  PLAY_SONG, PAUSE_SONG, RESUME_SONG, TOGGLE_SONG, STOP_SONG, SEEK_SONG,
} from '../reducers/song.reducer';

// Public API (like your stations actions)
export function playSong(stationId, songId, positionMs = 0) {
  store.dispatch(getCmdPlaySong({ stationId, songId, positionMs }));
}
export function pauseSong() {
  store.dispatch(getCmdPauseSong())
}
export function resumeSong() {
  store.dispatch(getCmdResumeSong())
}
export function toggleSong(stationId = null, songId = null) {
  store.dispatch(getCmdToggleSong({ stationId, songId }))
}
export function stopSong() {
  store.dispatch(getCmdStopSong())
}
export function seekSong(positionMs) {
  store.dispatch(getCmdSeekSong({ positionMs }))
}

function getCmdPlaySong(payload) {
  return { type: PLAY_SONG, payload }
}
function getCmdPauseSong() {
  return { type: PAUSE_SONG }
}
function getCmdResumeSong() {
  return { type: RESUME_SONG }
}
function getCmdToggleSong(payload) {
  return { type: TOGGLE_SONG, payload }
}
function getCmdStopSong() {
  return { type: STOP_SONG }
}
function getCmdSeekSong(payload) {
  return { type: SEEK_SONG, payload }
}
