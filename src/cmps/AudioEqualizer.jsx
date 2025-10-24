import { useEffect, useRef, useState } from 'react'

export function AudioEqualizer({ audioEl, bars = 16, color = '#1ed760', height = 24 }) {
  const [values, setValues] = useState(() => Array(bars).fill(0))
  const rafRef = useRef()
  const analyserRef = useRef()
  const dataRef = useRef()

  useEffect(() => {
    if (!audioEl) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const src = ctx.createMediaElementSource(audioEl)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64   // small -> fewer bars, smoother
    src.connect(analyser)
    analyser.connect(ctx.destination)
    analyserRef.current = analyser
    dataRef.current = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(dataRef.current)
      // pick evenly spaced bins
      const step = Math.floor(dataRef.current.length / bars) || 1
      const arr = new Array(bars).fill(0).map((_, i) => dataRef.current[i * step] / 255)
      setValues(arr)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(rafRef.current); ctx.close() }
  }, [audioEl, bars])

  return (
    <div className="eq-reactive" style={{ height, '--eq-color': color }}>
      {values.map((v, i) => (
        <span key={i} style={{ height: `${Math.max(8, v * 100)}%` }} />
      ))}
    </div>
  )
}
