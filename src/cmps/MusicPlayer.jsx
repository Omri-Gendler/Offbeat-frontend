import { useEffect, useRef, useState } from 'react'
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
  setQueueIfChanged,
  setIndex,
  setPlay,
  nextTrack,
  prevTrack,
  togglePlay,
  playContext
  // playContext, // ← uncomment if you prefer seeding via playContext
} from '../store/actions/player.actions'

import { likeSong, unlikeSong } from '../store/actions/station.actions'
import { QueueSidebar } from './QueueSidebar'
import { VolumeControl } from './VolumeControl'
import { IconAddCircle24, IconCheckCircle24 } from './Icon'

const FALLBACK = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function MusicPlayer({ station }) {
  // stations
  const stations = useSelector(s => s.stationModule.stations, shallowEqual)
  const likedStation = stations.find(s => s._id === 'liked-songs-station') || null

  // player (correct slice is playerModule)
  const { queue = [], index = 0, nowPlayingId = null, isPlaying = false } = useSelector(
    s => s.playerModule || {},
    shallowEqual
  )

useEffect(() => {
  const tracks = Array.isArray(station?.songs) ? station.songs : []
  const contextId = station?._id || null
  const contextType = 'station'           // or 'album' | 'mix' | 'playlist' | null
  setQueueIfChanged(tracks, 0, contextId, contextType)
}, [station?._id, station?.songs?.length])

  // Derive current song
  const safeIndex = Math.min(Math.max(index || 0, 0), Math.max(queue.length - 1, 0))
  const currentSong = queue[safeIndex] || (nowPlayingId ? queue.find(t => t?.id === nowPlayingId) : null) || null

  const likedSongs = likedStation?.songs || []
  const isLiked = !!(currentSong && likedSongs.some(s => s.id === currentSong.id))

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  // reflect store isPlaying into <audio>
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) el.play().catch(() => {})
    else el.pause()
  }, [isPlaying, currentSong?.id])

  // visual progress %
  useEffect(() => {
    const pct = duration ? (currentTime / duration) * 100 : 0
    progressBarRef.current?.style.setProperty('--progress-percent', `${pct}%`)
  }, [currentTime, duration])

  // reset timers on track change
  useEffect(() => {
    setCurrentTime(0)
    setDuration(0)
  }, [currentSong?.id])

  // 🔁 Use the STORE toggle (no thunks)
  const handleTogglePlay = () => {
    if (!currentSong && queue.length > 0) {
      setIndex(0)
      setPlay(true)
      return
    }
    togglePlay() // single source of truth
  }

  const onNext = () => nextTrack()
  const onPrev = () => prevTrack()

  const handleSeek = e => {
    const t = Number(e.target.value)
    if (!Number.isFinite(t)) return
    if (audioRef.current) {
      audioRef.current.currentTime = t
      setCurrentTime(t)
    }
  }

  const fmt = s => {
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

  return (
    <footer className="music-player">
      <div className="player-left">
        <img
          src={currentSong?.imgUrl || '/img/unnamed-song.png'}
          alt=""
          className="player-album-cover"
          width={50}
          height={50}
        />
        <div className="player-song-info">
          <span className="song-title">{currentSong?.title || station?.name || '—'}</span>
          <span className="song-artist">{currentSong?.artists || ''}</span>
        </div>
        <button
          type="button"
          className="tertiary-btn"
          aria-label={isLiked ? 'In Your Library' : 'Add to Your Library'}
          aria-pressed={isLiked}
          onClick={handleAddClick}
        >
          {isLiked ? <IconCheckCircle24 className="icon" /> : <IconAddCircle24 className="icon" />}
        </button>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button type="button" className="control-btn" onClick={onPrev} disabled={!currentSong}>
            <SkipPreviousIcon style={{ fontSize: 25, marginLeft: 2 }} />
          </button>
          <button
            type="button"
            className="control-btn play-pause-btn"
            onClick={handleTogglePlay}
            disabled={!currentSong && queue.length === 0}
          >
            {isPlaying ? (
              <PauseIcon style={{ fontSize: 25, marginLeft: 2 }} />
            ) : (
              <PlayArrowIcon style={{ fontSize: 25, marginLeft: 2 }} />
            )}
          </button>
          <button type="button" className="control-btn" onClick={onNext} disabled={!currentSong}>
            <SkipNextIcon style={{ fontSize: 25, marginLeft: 2 }} />
          </button>
        </div>

        <div className="progress-bar-container">
          <span className="time-stamp">{fmt(currentTime)}</span>
          <input
            ref={progressBarRef}
            type="range"
            className="progress-bar"
            value={currentTime}
            max={duration || 0}
            step="0.1"
            onChange={handleSeek}
          />
          <span className="time-stamp">{fmt(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button type="button" style={{ backgroundColor: 'transparent' }}>
          <SlideshowIcon />
        </button>
        <button
          type="button"
          className="queue-btn"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => setIsQueueOpen(p => !p)}
        >
          <QueueMusicIcon />
        </button>
        <button type="button" style={{ backgroundColor: 'transparent' }}>
          <TapAndPlayIcon />
        </button>
        <VolumeControl audioRef={audioRef} />
        <button type="button" style={{ backgroundColor: 'transparent' }}>
          <FullscreenIcon />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentSong?.url || FALLBACK}
        preload="metadata"
        onLoadedMetadata={() => {
          setDuration(audioRef.current?.duration || 0)
          if (isPlaying) audioRef.current?.play().catch(() => {})
        }}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={onNext}
      />

      {isQueueOpen && <QueueSidebar stations={stations} onClose={() => setIsQueueOpen(false)} />}
    </footer>
  )
}
