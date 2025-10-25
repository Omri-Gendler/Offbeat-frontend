export const SET_BG_IMAGE  = 'SET_BG_IMAGE'
export const SET_COVER_HEX = 'SET_COVER_HEX'
export const SET_COVER_HUE = 'SET_COVER_HUE'

const initialState = {
  bgImageUrl: null,
  coverHex: '#1f1f1f',
  coverHue: 0
}

export function appReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BG_IMAGE:
      return { ...state, bgImageUrl: action.bgImageUrl || null }
    case SET_COVER_HEX:
      return { ...state, coverHex: action.coverHex || '#1f1f1f' }
    case SET_COVER_HUE:
      return { ...state, coverHue: Number.isFinite(action.coverHue) ? action.coverHue : 0 }
    default:
      return state
  }
}

export const getCmdSetCoverHue = (coverHue) => ({ type: SET_COVER_HUE, coverHue })
export const getCmdSetBgImage = (bgImageUrl) => ({ type: SET_BG_IMAGE, bgImageUrl }) 
export const getCmdSetCoverHex = (coverHex) => ({ type: SET_COVER_HEX, coverHex }) 
