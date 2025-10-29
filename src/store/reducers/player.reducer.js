<<<<<<< HEAD
// action types
=======
// src/store/reducers/player.reducer.js
>>>>>>> 8eb769f (store fix)
export const PLAY_CONTEXT   = 'PLAYER/PLAY_CONTEXT'
export const TOGGLE_PLAY    = 'PLAYER/TOGGLE_PLAY'
export const SET_PROGRESS   = 'PLAYER/SET_PROGRESS'
export const NEXT           = 'PLAYER/NEXT'
export const PREV           = 'PLAYER/PREV'
<<<<<<< HEAD
export const SET_CONTEXT    = 'PLAYER/SET_CONTEXT'   // (optional, not used below)
=======
export const SET_CONTEXT    = 'PLAYER/SET_CONTEXT'
>>>>>>> 8eb769f (store fix)
export const SET_PLAY       = 'PLAYER/SET_PLAY'
export const SET_INDEX      = 'PLAYER/SET_INDEX'
export const RESET          = 'PLAYER/RESET'
export const SET_QUEUE      = 'PLAYER/SET_QUEUE'
export const TOGGLE_SHUFFLE = 'PLAYER/TOGGLE_SHUFFLE'
export const CYCLE_REPEAT   = 'PLAYER/CYCLE_REPEAT'
<<<<<<< HEAD

// helpers
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi)
const linearOrder = (n) => Array.from({ length: n }, (_, i) => i)
=======

const initialState = {
  contextId: null,
  contextType: null,
  queue: [],
  index: 0,               // index into playOrder
  nowPlayingId: null,
  isPlaying: false,
  progressSec: 0,
  shuffle: false,
  repeat: 'off',          // 'off' | 'all' | 'one'
  upNext: [],
  history: [],
  playOrder: [],          // indices into queue
}

/* ---------- helpers ---------- */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}
>>>>>>> 8eb769f (store fix)

function linearOrder(n) {
  return Array.from({ length: n }, (_, i) => i)
}

// Keep a chosen real index first, shuffle the rest
function shuffleExceptFirst(order, keepRealIdx) {
  // order is [0..n-1]
  const first = keepRealIdx
  const rest = order.filter(i => i !== first)
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [first, ...rest]
}

const initialState = {
  contextId: null,
  contextType: null,        // 'station' | 'search' | ...
  queue: [],
  playOrder: [],            // indices into queue
  index: 0,                 // index into playOrder
  nowPlayingId: null,
  isPlaying: false,
  progressSec: 0,
  shuffle: false,
  repeat: 'off',            // 'off' | 'all' | 'one'
  upNext: [],
  history: [],
}

export function playerReducer(state = initialState, action) {
  switch (action.type) {

    case PLAY_CONTEXT: {
      const {
        contextId,
        contextType = 'station',
        tracks = [],
<<<<<<< HEAD
        trackId,
=======
        index,            // preferred by your UI
        trackId,          // also allowed
>>>>>>> 8eb769f (store fix)
        autoplay = true,
      } = action.payload || {}

      const queue = Array.isArray(tracks) ? tracks : []
<<<<<<< HEAD
      const count = queue.length
      const linear = linearOrder(count)

      if (count === 0) {
        return {
          ...state,
          contextId,
          contextType,
          queue: [],
          playOrder: [],
          index: 0,
          nowPlayingId: null,
          isPlaying: false,
          history: [],
        }
      }

      // find clicked track in the new queue (fallback to 0)
      const realIdxRaw = queue.findIndex(t => (t?.id ?? t?._id ?? t) === trackId)
      const realIdx = realIdxRaw >= 0 ? realIdxRaw : 0

      let playOrder, index
      if (state.shuffle && count > 1) {
        playOrder = shuffleExceptFirst(linear, realIdx)
        index = 0
      } else {
        playOrder = linear
        index = realIdx
      }

      const nowPlayingId = queue[realIdx]?.id ?? queue[realIdx]?._id ?? null
=======
      const baseOrder = linearOrder(queue.length)

      // Determine the intended real index from either index or trackId
      let realIdx = typeof index === 'number'
        ? clamp(index, 0, Math.max(queue.length - 1, 0))
        : queue.findIndex(t => (t?.id ?? t?._id ?? t) === trackId)

      if (realIdx < 0) realIdx = 0

      let playOrder
      let newIndex
      if (state.shuffle && queue.length > 1) {
        playOrder = shuffleExceptFirst(baseOrder, realIdx) // put clicked first
        newIndex = 0
      } else {
        playOrder = baseOrder
        newIndex = realIdx
      }

      const nowPlayingId = queue[playOrder[newIndex]]?.id ?? queue[playOrder[newIndex]]?._id ?? null
>>>>>>> 8eb769f (store fix)

      return {
        ...state,
        contextId,
        contextType,
        queue,
        playOrder,
<<<<<<< HEAD
        index,
        nowPlayingId,
        isPlaying: !!autoplay,
        history: [],
        progressSec: 0,
      }
    }

    case TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying }

    case SET_PLAY:
      return { ...state, isPlaying: !!action.isPlaying }

    case SET_PROGRESS:
      return { ...state, progressSec: Math.max(0, Number(action.seconds ?? 0)) }
=======
        index: newIndex,
        nowPlayingId,
        isPlaying: !!autoplay,
      }
    }
>>>>>>> 8eb769f (store fix)

    case SET_QUEUE: {
      const {
        queue = [],
        index = 0,
        contextId = null,
        contextType = 'station',
      } = action.payload || {}

      const playOrder = linearOrder(queue.length)
      const safeIndex = clamp(index, 0, Math.max(playOrder.length - 1, 0))
      const realIdx   = playOrder[safeIndex] ?? safeIndex
      const nowPlayingId = queue[realIdx]?.id ?? queue[realIdx]?._id ?? null

      return {
        ...state,
        queue,
        playOrder,
        index: safeIndex,
        contextId,
        contextType,
        nowPlayingId,
        progressSec: 0,
      }
    }

    case SET_INDEX: {
      const idx = clamp(action.index ?? 0, 0, Math.max((state.playOrder.length || 1) - 1, 0))
      const realIdx = state.playOrder[idx] ?? idx
      const nowPlayingId = state.queue[realIdx]?._id || state.queue[realIdx]?.id || null
<<<<<<< HEAD
      return { ...state, index: idx, nowPlayingId, progressSec: 0 }
    }

    case TOGGLE_SHUFFLE: {
      const { queue, playOrder, index, shuffle } = state
      if (queue.length <= 1) return { ...state, shuffle: !shuffle } // visual toggle

=======
      return { ...state, index: idx, nowPlayingId }
    }

    case SET_PLAY:
      return { ...state, isPlaying: !!action.isPlaying }

    case TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying }

    case TOGGLE_SHUFFLE: {
      const { queue, playOrder, index, shuffle } = state
      if (queue.length <= 1) return { ...state, shuffle: !shuffle } // visual only
>>>>>>> 8eb769f (store fix)
      const currentReal = playOrder[index] ?? index

      if (shuffle) {
<<<<<<< HEAD
        // -> OFF: linear, same real track/position
=======
        // turn OFF -> linear; keep same real track
>>>>>>> 8eb769f (store fix)
        const linear = linearOrder(queue.length)
        const newIndex = currentReal // because linear[i] === i
        const nowPlayingId = queue[currentReal]?.id ?? queue[currentReal]?._id ?? null
        return { ...state, shuffle: false, playOrder: linear, index: newIndex, nowPlayingId }
      } else {
<<<<<<< HEAD
        // -> ON: keep current first, shuffle rest
=======
        // turn ON -> keep current first, shuffle rest
>>>>>>> 8eb769f (store fix)
        const linear = linearOrder(queue.length)
        const shuffled = shuffleExceptFirst(linear, currentReal)
        const nowPlayingId = queue[currentReal]?.id ?? queue[currentReal]?._id ?? null
        return { ...state, shuffle: true, playOrder: shuffled, index: 0, nowPlayingId }
      }
    }

    case CYCLE_REPEAT: {
      const map = { off: 'all', all: 'one', one: 'off' }
      return { ...state, repeat: map[state.repeat] ?? 'off' }
    }

    case NEXT: {
      const { playOrder, index, repeat, queue, history } = state
      if (!playOrder.length) return state
      if (repeat === 'one') return state

      const atEnd = index >= playOrder.length - 1
      if (atEnd) {
        if (repeat === 'all') {
          const newIndex = 0
          const realIdx = playOrder[newIndex]
          const nowPlayingId = queue[realIdx]?.id ?? queue[realIdx]?._id ?? null
<<<<<<< HEAD
          return { ...state, index: newIndex, nowPlayingId, progressSec: 0 }
=======
          return { ...state, index: newIndex, nowPlayingId }
>>>>>>> 8eb769f (store fix)
        }
        return { ...state, isPlaying: false }
      }

      const curReal = playOrder[index]
      const nextIndex = index + 1
      const nextReal = playOrder[nextIndex]
      const nowPlayingId = queue[nextReal]?.id ?? queue[nextReal]?._id ?? null
<<<<<<< HEAD
      return {
        ...state,
        index: nextIndex,
        nowPlayingId,
        progressSec: 0,
        history: curReal != null ? [...history, curReal] : history,
      }
=======
      return { ...state, index: nextIndex, nowPlayingId, history: curReal != null ? [...history, curReal] : history }
>>>>>>> 8eb769f (store fix)
    }

    case PREV: {
      const { playOrder, index, repeat, queue, history } = state
      if (!playOrder.length) return state
      if (repeat === 'one') return state
      if (index <= 0) return state

      const prevIndex = index - 1
      const prevReal = playOrder[prevIndex]
      const nowPlayingId = queue[prevReal]?.id ?? queue[prevReal]?._id ?? null
      const newHistory = history.length ? history.slice(0, -1) : history

      return {
        ...state,
        index: prevIndex,
        nowPlayingId,
        progressSec: 0,
        history: newHistory,
      }
    }

    case RESET:
      return { ...initialState }

    default:
      return state
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 8eb769f (store fix)
