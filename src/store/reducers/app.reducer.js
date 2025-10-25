
export const SET_BG_IMAGE = 'SET_BG_IMAGE'

const initialState = {
  bgImageUrl: null,
}

export function appReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BG_IMAGE:
      return { ...state, bgImageUrl: action.bgImageUrl || null }
    default:
      return state
  }
}


