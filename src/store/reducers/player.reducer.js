
export const PLAY_CONTEXT  = 'PLAYER/PLAY_CONTEXT'
export const TOGGLE_PLAY   = 'PLAYER/TOGGLE_PLAY'
export const SET_PROGRESS  = 'PLAYER/SET_PROGRESS'
export const NEXT          = 'PLAYER/NEXT'
export const PREV          = 'PLAYER/PREV'
export const SET_CONTEXT   = 'PLAYER/SET_CONTEXT'
export const SET_PLAY      = 'PLAYER/SET_PLAY'
export const SET_INDEX     = 'PLAYER/SET_INDEX'
export const RESET         = 'PLAYER/RESET'
export const SET_QUEUE     = 'PLAYER/SET_QUEUE' 
export const TOGGLE_SHUFFLE = 'PLAYER/TOGGLE_SHUFFLE'
export const CYCLE_REPEAT   = 'PLAYER/CYCLE_REPEAT'  


// Optional: if you still want a raw queue setter (not recommended since PLAY_CONTEXT exists)



const initialState = {
  contextId: null,
  contextType: null,
  queue: [],
  index: 0,                 // index into playOrder
  nowPlayingId: null,
  isPlaying: false,
  progressSec: 0,
  shuffle: false,
  repeat: 'off',            // 'off' | 'all' | 'one'
  repeat: 'off',            // 'off' | 'all' | 'one'
  upNext: [],
  history: [],
  playOrder: [],            // indices into queue
}

const linearOrder = (n) => Array.from({ length: n }, (_, i) => i)

function shuffleExceptFirst(order, keepAt) {
  const rest = order.filter(i => i !== keepAt)
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [keepAt, ...rest]
}

export function playerReducer(state = initialState, action) {
  switch (action.type) {
case PLAY_CONTEXT: {
  const {
    contextId,
    contextType = 'station',
    tracks = [],
    trackId,
    autoplay = true,
  } = action.payload || {}

  const queue = Array.isArray(tracks) ? tracks : []
  const linear = linearOrder(queue.length)

  // find clicked track in the new queue
  const realIdx = Math.max(0, queue.findIndex(t => (t?.id ?? t) === trackId))

  // Respect current shuffle setting:
  // - if shuffle is ON: keep the clicked song first, shuffle the rest, index -> 0
  // - if shuffle is OFF: linear order, index -> realIdx
  let playOrder
  let index
  if (state.shuffle && queue.length > 1) {
    playOrder = shuffleExceptFirst(linear, realIdx)
    index = 0
  } else {
    playOrder = linear
    index = realIdx
  }

  const nowPlayingId = queue[realIdx]?.id ?? queue[realIdx]?._id ?? null

  return {
    ...state,
    contextId,
    contextType,
    queue,
    playOrder,
    index,
    nowPlayingId,
    isPlaying: !!autoplay,
  }
}
case TOGGLE_PLAY:
  return { ...state, isPlaying: !state.isPlaying }

    case SET_QUEUE: {
      const { queue = [], index = 0, contextId = null, contextType = 'station' } =
        action.payload || {}
      const playOrder = linearOrder(queue.length)
      const safeIndex = clamp(index, 0, Math.max(playOrder.length - 1, 0))
      const realIdx = playOrder[safeIndex] ?? safeIndex
      const nowPlayingId = queue[realIdx]?.id ?? queue[realIdx]?._id ?? null
      return {
        ...state,
        queue,
        playOrder,
        index: safeIndex,
        queue,
        playOrder,
        index: safeIndex,
        contextId,
        contextType,
        nowPlayingId,
      }
    }


    case SET_INDEX: {
      const index = Math.max(0, Math.min(action.index ?? 0, (state.playOrder.length || 1) - 1))
      const realIdx = state.playOrder[index] ?? index
      const nowPlayingId = state.queue[realIdx]?._id || state.queue[realIdx]?.id || null
      return { ...state, index, nowPlayingId }
    }

    case SET_PLAY:
      return { ...state, isPlaying: !!action.isPlaying }

    case TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying }


    case TOGGLE_SHUFFLE: {
      const { queue, playOrder, index, shuffle } = state
      if (queue.length <= 1) return { ...state, shuffle: !shuffle } // visual toggle only
      const currentReal = playOrder[index] ?? index
      if (shuffle) {
        // -> OFF: linear path, same real track
        const linear = linearOrder(queue.length)
        const newIndex = currentReal // linear[i] === i
        const nowPlayingId = queue[currentReal]?.id ?? queue[currentReal]?._id ?? null
        return { ...state, shuffle: false, playOrder: linear, index: newIndex, nowPlayingId }
      } else {
        // -> ON: keep current first, shuffle rest, index -> 0
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
      return { ...state, index: newIndex, nowPlayingId }
    }

    return { ...state, isPlaying: false }
  }

  const curReal = playOrder[index]
  const nextIndex = index + 1
  const nextReal = playOrder[nextIndex]
  const nowPlayingId = queue[nextReal]?.id ?? queue[nextReal]?._id ?? null
  return { ...state, index: nextIndex, nowPlayingId, history: curReal != null ? [...history, curReal] : history }
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
      return { ...state, index: prevIndex, nowPlayingId, history: newHistory }
    }

    case RESET:
      return { ...initialState }
      return { ...initialState }

    default:
      return state
  }
}

// export const toggleShuffle   = () => ({ type: TOGGLE_SHUFFLE })
// export const cycleRepeatMode = () => ({ type: CYCLE_REPEAT })
// export const setQueue        = (queue) => ({ type: SET_QUEUE, queue })
// export const setIndex        = (index) => ({ type: SET_INDEX, index })
// export const setPlay         = (isPlaying) => ({ type: SET_PLAY, isPlaying })
// export const togglePlay      = () => ({ type: TOGGLE_PLAY })
// export const nextTrack       = () => ({ type: NEXT })
// export const prevTrack       = () => ({ type: PREV })
