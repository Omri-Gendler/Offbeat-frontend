
export const PLAY_SONG = 'player/PLAY_SONG';
export const PAUSE_SONG = 'player/PAUSE_SONG';
export const RESUME_SONG = 'player/RESUME_SONG';
export const TOGGLE_SONG = 'player/TOGGLE_SONG';
export const STOP_SONG = 'player/STOP_SONG';
export const SEEK_SONG = 'player/SEEK_SONG';

const initialState = {
  stationId: null,
  songId: null,
  isPlaying: false,
  positionMs: 0,
};

export function songReducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAY_SONG: {
      const { stationId, songId, positionMs = 0 } = action.payload;
      return { stationId, songId, isPlaying: true, positionMs };
    }
    case PAUSE_SONG:
      if (!state.songId) return state;
      return { ...state, isPlaying: false };
    case RESUME_SONG:
      if (!state.songId) return state;
      return { ...state, isPlaying: true };
    case TOGGLE_SONG: {
      const { stationId, songId } = action.payload || {};
      if (songId && songId !== state.songId) {
        return { stationId: stationId ?? state.stationId, songId, isPlaying: true, positionMs: 0 };
      }
      if (!state.songId) return state;
      return { ...state, isPlaying: !state.isPlaying };
    }
    case STOP_SONG:
      return initialState;
    case SEEK_SONG: {
      if (!state.songId) return state;
      const { positionMs } = action.payload;
      return { ...state, positionMs };
    }
    default:
      return state;
  }
}
