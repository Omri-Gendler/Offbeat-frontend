import { store } from '../store'
import { getCmdSetBgImage, getCmdSetCoverHex ,getCmdSetCoverHue} from '../reducers/app.reducer'


function hexToHsl(hex) {
  hex = (hex || '').replace('#','')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const r = parseInt(hex.slice(0,2),16)/255
  const g = parseInt(hex.slice(2,4),16)/255
  const b = parseInt(hex.slice(4,6),16)/255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > .5 ? d/(2 - max - min) : d/(max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h /= 6
  }
  return { h, s, l }
}
function hslToHex({h,s,l}) {
  const hue2rgb = (p,q,t)=>{ if(t<0)t+=1; if(t>1)t-=1;
    if(t<1/6)return p+(q-p)*6*t;
    if(t<1/2)return q;
    if(t<2/3)return p+(q-p)*(2/3 - t)*6;
    return p; }
  let r,g,b
  if (s === 0) { r=g=b=l }
  else {
    const q = l < .5 ? l*(1+s) : l + s - l*s
    const p = 2*l - q
    r = hue2rgb(p,q,h + 1/3)
    g = hue2rgb(p,q,h)
    b = hue2rgb(p,q,h - 1/3)
  }
  const toHex = x => Math.round(x*255).toString(16).padStart(2,'0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
export function boostVibrancy(hex, {satMul=1.35, minSat=0.45, targetL=0.45, lBlend=0.45} = {}) {
  const { h, s, l } = hexToHsl(hex)
  const s2 = Math.min(1, Math.max(s * satMul, minSat))
  const l2 = l*(1 - lBlend) + targetL*lBlend
  return hslToHex({ h, s: s2, l: Math.max(0, Math.min(1, l2)) })
}
export function hexToHue(hex){
  const { h } = hexToHsl(hex)
  return Math.round((h*360) % 360)
}


export function setBgImage(url) {
  store.dispatch(getCmdSetBgImage(url || null))
}

export function setCoverHex(hex) {
  store.dispatch(getCmdSetCoverHex(hex))
}

export function setCoverHue(hue){
   const val = Number.isFinite(hue) ? ((hue % 360) + 360) % 360 : 0
  store.dispatch(getCmdSetCoverHue(val))
}

export function computeAndSetCoverHex(hexFromFac) {
  const boosted = boostVibrancy(hexFromFac)
  setCoverHex(boosted)              
  return boosted                       
}

export function computeAndSetCoverFromHex(hexFromFac) {
  const boosted = boostVibrancy(hexFromFac)
  setCoverHex(boosted)
  setCoverHue(hexToHue(boosted))
  return { hex: boosted, hue: hexToHue(boosted) }
}