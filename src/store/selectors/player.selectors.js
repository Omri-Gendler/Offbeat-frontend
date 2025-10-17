

export const selectIsSongLiked = (state, songId) => {
  const liked = state.stationModule.stations.find(s => s._id === 'liked-songs-station')
  if (!liked || !songId) return false
  return liked.songs.some(s => s.id === songId)
}



// src/store/selectors/player.selectors.js
const slice = s => s.playerModule || s.player || {}

export const selectQueue        = s => slice(s).queue || []
export const selectIndex        = s => slice(s).index ?? 0
export const selectNowPlayingId = s => slice(s).nowPlayingId ?? null
export const selectIsPlaying    = s => !!slice(s).isPlaying

export const selectCurrentSong  = s => {
  const queue = selectQueue(s)
  if (!queue.length) return null
  const id = selectNowPlayingId(s)
  if (id != null) return queue.find(t => (t?.id ?? t) === id) || null
  const i = Math.min(Math.max(selectIndex(s), 0), queue.length - 1)
  return queue[i] || null
}

// alias to satisfy existing imports
export const selectNowPlaying = selectCurrentSong
