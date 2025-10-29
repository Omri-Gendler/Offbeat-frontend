export const selectIsSongLiked = (state, songId) => {
  const likedSongs = state.userModule?.likedSongs || [];
  if (!songId) return false;
  return likedSongs.some(s => s.id === songId);
}


const slice = (s) => s.playerModule ?? s.player ?? {}

// Base
export const selectPlayer = (s) => slice(s)
export const selectQueue = (s) => selectPlayer(s).queue ?? []
export const selectIndex = (s) => selectPlayer(s).index ?? 0
export const selectNowPlayingId = (s) => selectPlayer(s).nowPlayingId ?? null
export const selectIsPlaying = (s) => !!selectPlayer(s).isPlaying

export const selectCurrentSong = (s) => {
  const queue = selectQueue(s)
  if (!queue.length) return null

  const id = selectNowPlayingId(s)
  if (id != null) {
    const found = queue.find(t => (t?.id ?? t) === id)
    if (found) return found
  }

  const i = Math.min(Math.max(selectIndex(s), 0), queue.length - 1)
  return queue[i] || null
}

// Back-compat alias
export const selectNowPlaying = selectCurrentSong
