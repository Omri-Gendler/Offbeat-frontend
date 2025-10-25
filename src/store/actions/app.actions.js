
// src/store/actions/app.actions.js
import { store } from '../store'
import { SET_BG_IMAGE } from '../reducers/app.reducer'

export function setBgImage(bgImageUrl) {
  store.dispatch(getCmdSetBgImage(bgImageUrl || null))
}


export function getCmdSetBgImage(bgImageUrl) {
  return { type: SET_BG_IMAGE, bgImageUrl }
}
