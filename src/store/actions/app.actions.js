import { store } from '../store'
import { getCmdSetBgImage, getCmdSetCoverHex } from '../reducers/app.reducer'

export function setBgImage(url) {
  store.dispatch(getCmdSetBgImage(url || null))
}

export function setCoverHex(hex) {
  store.dispatch(getCmdSetCoverHex(hex || '#1f1f1f'))
}
