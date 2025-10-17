
export const PLAY_CONTEXT  = 'PLAYER/PLAY_CONTEXT'
export const TOGGLE_PLAY   = 'PLAYER/TOGGLE_PLAY'
export const SET_PROGRESS  = 'PLAYER/SET_PROGRESS'
export const NEXT          = 'PLAYER/NEXT'
export const PREV          = 'PLAYER/PREV'
export const SET_CONTEXT   = 'PLAYER/SET_CONTEXT'
export const SET_PLAY      = 'PLAYER/SET_PLAY'
export const SET_INDEX     = 'PLAYER/SET_INDEX'
export const RESET         = 'PLAYER/RESET'
export const SET_QUEUE     = 'PLAYER/SET_QUEUE'   // ← fix string


// Optional: if you still want a raw queue setter (not recommended since PLAY_CONTEXT exists)



const initialState = {
  contextId: null,        // any id: stationId/albumId/mixId/custom
  contextType: null,      // 'station' | 'album' | 'mix' | 'playlist' | 'ad-hoc' | ...
  queue: [],
  index: 0,
  nowPlayingId: null,
  isPlaying: false,
  progressSec: 0,
  shuffle: false,
  repeat: 'off',
  upNext: [],
  history: [],
}

export function playerReducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAY_CONTEXT: {
      const {
        contextId,
        contextType,
        tracks = [],
        trackId = null,
        index: wantedIndex = 0,
        autoplay = true,
      } = action.payload || {}

      const len = Array.isArray(tracks) ? tracks.length : 0
      const byId = trackId != null
        ? tracks.findIndex(t => (t?.id ?? t) === trackId)
        : -1

      const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
      const idx = len === 0
        ? -1
        : (byId !== -1
            ? byId
            : clamp(Number.isInteger(wantedIndex) ? wantedIndex : 0, 0, len - 1))

      const nowPlayingId = (idx >= 0 && len) ? (tracks[idx]?.id ?? null) : null

      return {
        ...state,
        contextId,
        contextType,
        queue: len ? tracks : [],
        index: idx >= 0 ? idx : 0,
        nowPlayingId,
        isPlaying: !!autoplay && nowPlayingId != null,
        progressSec: 0,
      }
    }

    // Generic queue setter (no autoplay)
    case SET_QUEUE: {
      const { queue = [], index = 0, contextId = null, contextType = null } = action.payload || {}
      const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
      const idx = clamp(index, 0, Math.max(queue.length - 1, 0))
      return {
        ...state,
        contextId,
        contextType,
        queue,
        index: idx,
        nowPlayingId: queue[idx]?.id ?? null,
        // keep current play/pause; reset progress if index changed
        isPlaying: state.isPlaying,
        progressSec: idx !== state.index ? 0 : state.progressSec,
      }
    }

    case SET_INDEX: {
      const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
      const idx = clamp(action.index ?? 0, 0, Math.max(state.queue.length - 1, 0))
      return {
        ...state,
        index: idx,
        nowPlayingId: state.queue[idx]?.id ?? null,
        progressSec: 0,
      }
    }

    case SET_PLAY:
      return { ...state, isPlaying: !!action.isPlaying }

    case TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying }

    case SET_PROGRESS:
      return { ...state, progressSec: Math.max(0, action.seconds || 0) }

    case NEXT: {
      const len = state.queue.length
      if (!len) return state
      const idx = Math.min(state.index + 1, len - 1) // no wrap (match your logic)
      return { ...state, index: idx, nowPlayingId: state.queue[idx]?.id ?? null, progressSec: 0 }
    }

    case PREV: {
      const len = state.queue.length
      if (!len) return state
      const idx = Math.max(state.index - 1, 0)
      return { ...state, index: idx, nowPlayingId: state.queue[idx]?.id ?? null, progressSec: 0 }
    }

    case SET_CONTEXT:
      return {
        ...state,
        contextId: action.contextId ?? state.contextId,
        contextType: action.contextType ?? state.contextType,
      }

    case RESET:
      return initialState

    default:
      return state
  }
}