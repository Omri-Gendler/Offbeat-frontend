// ——— Liked helper ———
export const selectIsSongLiked = (state, songId) => {
  const liked = state.stationModule.stations.find(s => s._id === 'liked-songs-station')
  if (!liked || !songId) return false
  return liked.songs.some(s => s.id === songId)
}

// ——— Player slice ———
const slice = (s) => s.playerModule ?? s.player ?? {}

export const selectPlayer       = (s) => slice(s)
export const selectQueue        = (s) => slice(s).queue ?? []
export const selectPlayOrder    = (s) => slice(s).playOrder ?? []
export const selectIndex        = (s) => slice(s).index ?? 0
export const selectNowPlayingId = (s) => slice(s).nowPlayingId ?? null
export const selectIsPlaying    = (s) => !!slice(s).isPlaying
export const selectShuffle      = (s) => !!slice(s).shuffle
export const selectRepeat       = (s) => slice(s).repeat ?? 'off'

// Canonical current song selector (shuffle-aware, back-compat fallbacks)
export const selectCurrentSong = (s) => {
  const queue = selectQueue(s)
  if (!queue.length) return null

  const order = selectPlayOrder(s)
  if (order.length) {
    const i = Math.max(0, Math.min(selectIndex(s), order.length - 1))
    const realIdx = order[i] ?? i
    return queue[realIdx] ?? null
  }

  const id = selectNowPlayingId(s)
  if (id != null) {
    const found = queue.find(t => (t?.id ?? t) === id)
    if (found) return found
  }

  const i = Math.max(0, Math.min(selectIndex(s), queue.length - 1))
  return queue[i] ?? null
}

// Optional: real index into queue (useful for guards/UI)
export const selectCurrentRealIndex = (s) => {
  const queue = selectQueue(s)
  if (!queue.length) return -1
  const order = selectPlayOrder(s)
  if (!order.length) {
    return Math.max(0, Math.min(selectIndex(s), queue.length - 1))
  }
  const i = Math.max(0, Math.min(selectIndex(s), order.length - 1))
  return order[i] ?? i
}

// Back-compat alias
export const selectNowPlaying = selectCurrentSong

function shuffleExceptFirst(order, keepAt) {
  const rest = order.filter(i => i !== keepAt)
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j], rest[i]]
  }
  return [keepAt, ...rest]
}