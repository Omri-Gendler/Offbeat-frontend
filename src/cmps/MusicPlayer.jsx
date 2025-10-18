// import { useEffect, useRef, useState } from 'react'
// import { useSelector, shallowEqual } from 'react-redux'

// import PlayArrowIcon from '@mui/icons-material/PlayArrow'
// import PauseIcon from '@mui/icons-material/Pause'
// import SkipNextIcon from '@mui/icons-material/SkipNext'
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
// import SlideshowIcon from '@mui/icons-material/Slideshow'
// import QueueMusicIcon from '@mui/icons-material/QueueMusic'
// import TapAndPlayIcon from '@mui/icons-material/TapAndPlay'
// import FullscreenIcon from '@mui/icons-material/Fullscreen'

// import {
//   setQueueIfChanged,
//   setIndex,
//   setPlay,
//   nextTrack,
//   prevTrack,
//   togglePlay,
//   playContext
//   // playContext, // ← uncomment if you prefer seeding via playContext
// } from '../store/actions/player.actions'

// import { likeSong, unlikeSong } from '../store/actions/station.actions'
// import { QueueSidebar } from './QueueSidebar'
// import { VolumeControl } from './VolumeControl'
// import { IconAddCircle24, IconCheckCircle24 } from './Icon'

// const FALLBACK = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

// export function MusicPlayer({ station }) {
//   // stations
//   const stations = useSelector(s => s.stationModule.stations, shallowEqual)
//   const likedStation = stations.find(s => s._id === 'liked-songs-station') || null

//   // player (correct slice is playerModule)
//   const { queue = [], index = 0, nowPlayingId = null, isPlaying = false } = useSelector(
//     s => s.playerModule || {},
//     shallowEqual
//   )

// // useEffect(() => {
// //   const tracks = Array.isArray(station?.songs) ? station.songs : []
// //   const contextId = station?._id || null
// //   const contextType = 'station'           // or 'album' | 'mix' | 'playlist' | null
// //   setQueueIfChanged(tracks, 0, contextId, contextType)
// // }, [station?._id, station?.songs?.length])

//   // Derive current song
// //   const safeIndex = Math.min(Math.max(index || 0, 0), Math.max(queue.length - 1, 0))

//   const currentSong = queue.length ? queue[Math.min(Math.max(index, 0), queue.length - 1)] : null

//   const likedSongs = likedStation?.songs || []
//   const isLiked = !!(currentSong && likedSongs.some(s => s.id === currentSong.id))

//   const audioRef = useRef(null)
//   const progressBarRef = useRef(null)

//   const [duration, setDuration] = useState(0)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [isQueueOpen, setIsQueueOpen] = useState(false)

//   // reflect store isPlaying into <audio>
//   useEffect(() => {
//     const el = audioRef.current
//     if (!el) return
//     if (isPlaying) el.play().catch(() => {})
//     else el.pause()
//   }, [isPlaying, currentSong?.id])

//   // visual progress %
//   useEffect(() => {
//     const pct = duration ? (currentTime / duration) * 100 : 0
//     progressBarRef.current?.style.setProperty('--progress-percent', `${pct}%`)
//   }, [currentTime, duration])

//   // reset timers on track change
//   useEffect(() => {
//     setCurrentTime(0)
//     setDuration(0)
//   }, [currentSong?.id])

//   // 🔁 Use the STORE toggle (no thunks)
//   const handleTogglePlay = () => {
//     if (!currentSong && queue.length > 0) {
//       setIndex(0)
//       setPlay(true)
//       return
//     }
//     togglePlay() // single source of truth
//   }

//   const onNext = () => nextTrack()
//   const onPrev = () => prevTrack()

//   const handleSeek = e => {
//     const t = Number(e.target.value)
//     if (!Number.isFinite(t)) return
//     if (audioRef.current) {
//       audioRef.current.currentTime = t
//       setCurrentTime(t)
//     }
//   }

//   const fmt = s => {
//     if (!Number.isFinite(s)) return '0:00'
//     const m = Math.floor(s / 60)
//     const sec = Math.floor(s % 60)
//     return `${m}:${sec < 10 ? '0' : ''}${sec}`
//   }

//   const handleAddClick = async () => {
//     if (!currentSong) return
//     if (isLiked) await unlikeSong(currentSong.id)
//     else await likeSong(currentSong)
//   }

//   return (
//     <footer className="music-player">
//       <div className="player-left">
//         <img
//           src={currentSong?.imgUrl || '/img/unnamed-song.png'}
//           alt=""
//           className="player-album-cover"
//           width={50}
//           height={50}
//         />
//         <div className="player-song-info">
//           <span className="song-title">{currentSong?.title || station?.name || '—'}</span>
//           <span className="song-artist">{currentSong?.artists || ''}</span>
//         </div>
//         <button
//           type="button"
//           className="tertiary-btn"
//           aria-label={isLiked ? 'In Your Library' : 'Add to Your Library'}
//           aria-pressed={isLiked}
//           onClick={handleAddClick}
//         >
//           {isLiked ? <IconCheckCircle24 className="icon" /> : <IconAddCircle24 className="icon" />}
//         </button>
//       </div>

//       <div className="player-center">
//         <div className="player-controls">
//           <button type="button" className="control-btn" onClick={onPrev} disabled={!currentSong}>
//             <SkipPreviousIcon style={{ fontSize: 25, marginLeft: 2 }} />
//           </button>
//           <button
//             type="button"
//             className="control-btn play-pause-btn"
//             onClick={handleTogglePlay}
//             disabled={!currentSong && queue.length === 0}
//           >
//             {isPlaying ? (
//               <PauseIcon style={{ fontSize: 25, marginLeft: 2 }} />
//             ) : (
//               <PlayArrowIcon style={{ fontSize: 25, marginLeft: 2 }} />
//             )}
//           </button>
//           <button type="button" className="control-btn" onClick={onNext} disabled={!currentSong}>
//             <SkipNextIcon style={{ fontSize: 25, marginLeft: 2 }} />
//           </button>
//         </div>

//         <div className="progress-bar-container">
//           <span className="time-stamp">{fmt(currentTime)}</span>
//           <input
//             ref={progressBarRef}
//             type="range"
//             className="progress-bar"
//             value={currentTime}
//             max={duration || 0}
//             step="0.1"
//             onChange={handleSeek}
//           />
//           <span className="time-stamp">{fmt(duration)}</span>
//         </div>
//       </div>

//       <div className="player-right">
//         <button type="button" style={{ backgroundColor: 'transparent' }}>
//           <SlideshowIcon />
//         </button>
//         <button
//           type="button"
//           className="queue-btn"
//           style={{ backgroundColor: 'transparent' }}
//           onClick={() => setIsQueueOpen(p => !p)}
//         >
//           <QueueMusicIcon />
//         </button>
//         <button type="button" style={{ backgroundColor: 'transparent' }}>
//           <TapAndPlayIcon />
//         </button>
//         <VolumeControl audioRef={audioRef} />
//         <button type="button" style={{ backgroundColor: 'transparent' }}>
//           <FullscreenIcon />
//         </button>
//       </div>

//       <audio
//         ref={audioRef}
//         src={currentSong?.url || FALLBACK}
//         preload="metadata"
//         onLoadedMetadata={() => {
//           setDuration(audioRef.current?.duration || 0)
//           if (isPlaying) audioRef.current?.play().catch(() => {})
//         }}
//         onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
//         onEnded={onNext}
//       />

//       {isQueueOpen && <QueueSidebar stations={stations} onClose={() => setIsQueueOpen(false)} />}
//     </footer>
//   )
// }

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

import {
  setIndex,
  setPlay,
  nextTrack,
  prevTrack,
  togglePlay,
  // setProgress, // optional if you track progress in Redux
} from '../store/actions/player.actions'

import { likeSong, unlikeSong } from '../store/actions/station.actions'
import { QueueSidebar } from './QueueSidebar'
import { VolumeControl } from './VolumeControl'
import { IconAddCircle24, IconCheckCircle24 } from './Icon'

const FALLBACK = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function MusicPlayer({ station }) {
  const stations = useSelector(s => s.stationModule.stations, shallowEqual)
  const likedStation = stations.find(s => s._id === 'liked-songs-station') || null

  const { queue = [], index = 0, isPlaying = false } = useSelector(
    s => s.playerModule || {},
    shallowEqual
  )

  // Derive current song strictly from queue/index (Spotify-style, context-agnostic)
  const currentSong = useMemo(() => {
    if (!queue.length) return null
    const i = Math.min(Math.max(index, 0), queue.length - 1)
    return queue[i] || null
  }, [queue, index])

  const likedSongs = likedStation?.songs || []
  const isLiked = !!(currentSong && likedSongs.some(s => s.id === currentSong.id))

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  // Reflect store -> <audio>, resilient to autoplay errors
  // 1) On track change: pause → load → (optionally) play
  useEffect(() => {
    const el = audioRef.current
    if (!el || !currentSong) return

    el.pause()
    el.currentTime = 0
    el.load()                 // <-- forces the new src to be fetched/decoded
    console.log(currentSong)
    if (isPlaying) {
      el.play().catch(() => setPlay(false))
    }

    setDuration(0)
    setCurrentTime(0)
  }, [currentSong?.id])        // <-- only when the song changes

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying && currentSong) {
      el.play().catch(() => setPlay(false))
    } else {
      el.pause()
    }
  }, [isPlaying, currentSong?.id])

  // Keep CSS progress bar in sync
  useEffect(() => {
    const pct = duration ? (currentTime / duration) * 100 : 0
    progressBarRef.current?.style.setProperty('--progress-percent', `${pct}%`)
  }, [currentTime, duration])

  // Reset timing on track change
  useEffect(() => {
    setCurrentTime(0)
    setDuration(0)
  }, [currentSong?.id])

  // Keyboard shortcuts (space/k toggle, j/l seek)
  useEffect(() => {
    const onKey = (e) => {
      // Avoid when typing
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return

      if (e.code === 'Space' || e.key.toLowerCase() === 'k') {
        e.preventDefault()
        handleTogglePlay()
      } else if (e.key.toLowerCase() === 'l') {
        seekBy(10)
      } else if (e.key.toLowerCase() === 'j') {
        seekBy(-10)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentSong, isPlaying])

  // Media Session API (hardware keys / OS controls)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const { mediaSession } = navigator
    if (currentSong) {
      mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.title || '',
        artist: currentSong.artists || '',
        album: station?.name || '',
        artwork: currentSong.imgUrl ? [{ src: currentSong.imgUrl, sizes: '300x300', type: 'image/jpeg' }] : []
      })
    }
    mediaSession.setActionHandler?.('play', () => setPlay(true))
    mediaSession.setActionHandler?.('pause', () => setPlay(false))
    mediaSession.setActionHandler?.('previoustrack', () => prevTrack())
    mediaSession.setActionHandler?.('nexttrack', () => nextTrack())
    mediaSession.setActionHandler?.('seekto', (d) => {
      if (!audioRef.current) return
      if (typeof d.seekTime === 'number') {
        audioRef.current.currentTime = Math.min(Math.max(d.seekTime, 0), duration || 0)
        setCurrentTime(audioRef.current.currentTime)
      }
    })
  }, [currentSong?.id, station?.name, duration])

  const handleTogglePlay = useCallback(() => {
    if (!currentSong && queue.length > 0) {
      setIndex(0)        // first track
      setPlay(true)      // start playback
      return
    }
    togglePlay()
  }, [currentSong, queue.length])

  const onNext = useCallback(() => nextTrack(), [])
  const onPrev = useCallback(() => prevTrack(), [])

  const seekBy = useCallback((delta) => {
    const el = audioRef.current
    if (!el) return
    const next = Math.min(Math.max((el.currentTime || 0) + delta, 0), duration || 0)
    el.currentTime = next
    setCurrentTime(next)
  }, [duration])

  const handleSeek = (e) => {
    const t = Number(e.target.value)
    if (!Number.isFinite(t)) return
    if (audioRef.current) {
      audioRef.current.currentTime = t
      setCurrentTime(t)
      // setProgress?.(t) // optional: keep Redux in sync if you track progress
    }
  }

  const fmt = (s) => {
    if (!Number.isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  const handleAddClick = async () => {
    if (!currentSong) return
    if (isLiked) await unlikeSong(currentSong.id)
    else await likeSong(currentSong)
  }

  const onAddToLibrary = () => {
    if (!station) return
    addStationToLibrary(station)
  }

  const canControl = !!currentSong
  const canGoPrev = canControl && index > 0         // Spotify: prev disabled at start (no wrap)
  const canGoNext = canControl && index < queue.length - 1

  return (
    <footer className="music-player" role="region" aria-label="Player controls">
      <div className="player-left">
        <img
          src={currentSong?.imgUrl || '/img/unnamed-song.png'}
          alt=""
          className="player-album-cover"
          width={50}
          height={50}
        />
        <div className="player-song-info">
          <span className="song-title" title={currentSong?.title || ''}>
            {currentSong?.title || station?.name || '—'}
          </span>
          <span className="song-artist" title={currentSong?.artists || ''}>
            {currentSong?.artists || ''}
          </span>
        </div>
        <button
          type="button"
          className="tertiary-btn"
          aria-label={isLiked ? 'In Your Library' : 'Add to Your Library'}
          aria-pressed={isLiked}
          onClick={onAddToLibrary}
          disabled={!currentSong}
        >
          {isLiked ? <IconCheckCircle24 className="icon" /> : <IconAddCircle24 className="icon" />}
        </button>
      </div>

      <div className="player-center">
        <div className="player-controls" role="group" aria-label="Playback">
          <button type="button" className="control-btn" onClick={onPrev} disabled={!canGoPrev}>
            <SkipPreviousIcon style={{ fontSize: 25, marginLeft: 2 }} />
          </button>
          <button
            type="button"
            className="control-btn play-pause-btn"
            onClick={handleTogglePlay}
            disabled={!currentSong && queue.length === 0}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <PauseIcon style={{ fontSize: 25, marginLeft: 2 }} />
            ) : (
              <PlayArrowIcon style={{ fontSize: 25, marginLeft: 2 }} />
            )}
          </button>
          <button type="button" className="control-btn" onClick={onNext} disabled={!canGoNext}>
            <SkipNextIcon style={{ fontSize: 25, marginLeft: 2 }} />
          </button>
        </div>

        <div className="progress-bar-container">
          <span className="time-stamp" aria-label="Elapsed time">{fmt(currentTime)}</span>
          <input
            ref={progressBarRef}
            type="range"
            className="progress-bar"
            value={currentTime}
            max={duration || 0}
            step="0.1"
            onChange={handleSeek}
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-label="Seek"
            disabled={!currentSong}
          />
          <span className="time-stamp" aria-label="Total duration">{fmt(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button type="button" style={{ backgroundColor: 'transparent' }} aria-label="Picture in Picture">
          {/* <SlideshowIcon /> */}
        </button>
        <button type="button" style={{ backgroundColor: 'transparent' }} aria-label="Cast">
          {/* <TapAndPlayIcon /> */}
        </button>
        <button
          type="button"
          className="queue-btn"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => setIsQueueOpen(p => !p)}
          aria-expanded={isQueueOpen}
          aria-controls="queue-sidebar"
        >
          <QueueMusicIcon />
        </button>

        <VolumeControl audioRef={audioRef} />
        <button type="button" style={{ backgroundColor: 'transparent' }} aria-label="Fullscreen">
          {/* <FullscreenIcon /> */}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentSong?.url}
        preload="metadata"
        onLoadedMetadata={() => {
          const d = audioRef.current?.duration || 0
          setDuration(Number.isFinite(d) ? d : 0)
          if (isPlaying) audioRef.current?.play().catch(() => setPlay(false))
        }}
        onTimeUpdate={() => {
          const t = audioRef.current?.currentTime || 0
          setCurrentTime(t)
          // setProgress?.(t) // optional Redux sync
        }}
        onEnded={onNext}
      />

      {isQueueOpen && (
        <QueueSidebar
          id="queue-sidebar"
          stations={stations}
          onClose={() => setIsQueueOpen(false)}
        />
      )}
    </footer>
  )
}
