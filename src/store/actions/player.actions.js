// src/store/actions/player.actions.js
import { store } from '../store'
import {
  SET_INDEX,
  SET_PLAY,
  SET_CONTEXT,
  PLAY_CONTEXT,
  TOGGLE_PLAY,
  SET_QUEUE,
  NEXT,
  PREV,
  RESET,
  TOGGLE_SHUFFLE,
  CYCLE_REPEAT,
} from '../reducers/player.reducer'


export function setIndex(index) {
  const action = { type: SET_INDEX, index }
  store.dispatch(action)
  return action
}


export function setPlay(isPlaying) {
  const action = { type: SET_PLAY, isPlaying }
  store.dispatch(action)
  return action
}

export function toggleShuffle() {
  const action = { type: TOGGLE_SHUFFLE }
  store.dispatch(action)
  return action
}

export function cycleRepeatMode() {
  const action = { type: CYCLE_REPEAT }
  store.dispatch(action)
  return action
}


export function playContext(payload) {
  const action = { type: PLAY_CONTEXT, payload }
  store.dispatch(action)
  return action
}

export function togglePlay() {
  const action = { type: TOGGLE_PLAY }
  store.dispatch(action)
  return action
}

export function nextTrack() {
  const action = { type: NEXT }
  store.dispatch(action)
  return action
}

export function prevTrack() {
  const action = { type: PREV }
  store.dispatch(action)
  return action
}
export function setContext(meta) {
  store.dispatch({ type: SET_CONTEXT, ...meta })
}

export function resetPlayer() {
  const action = { type: RESET }
  store.dispatch(action)
  return action
}

// optional: only dispatch when really different (prevents selector warnings)
const idsEqual = (a, b) => {
  if (a === b) return true
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const aid = a[i]?.id ?? a[i]
    const bid = b[i]?.id ?? b[i]
    if (aid !== bid) return false
  }
  return true
}




export function setQueueIfChanged(queue = [], startIndex = 0, contextId = null, contextType = 'station') {
  const state = store.getState().playerModule
  const sameContext = state.contextId === contextId && state.contextType === contextType
  const sameLen = Array.isArray(state.queue) && state.queue.length === queue.length
  const sameIds = sameLen && state.queue.every((t, i) => (t?.id ?? t) === (queue[i]?.id ?? queue[i]))
  if (sameContext && sameIds) return

  store.dispatch({
    type: SET_QUEUE,
    payload: {
      queue,
      index: startIndex,
      contextId,
      contextType, 
      preserveCurrent: true,
    },
  })
}

export const selectCurrentSong = (s) => {
  const { queue = [], playOrder = [], index = 0 } = s.playerModule || {}
  if (!queue.length || !playOrder.length) return null
  const safeIdx = Math.max(0, Math.min(index, playOrder.length - 1))
  return queue[playOrder[safeIdx]] || null
}
