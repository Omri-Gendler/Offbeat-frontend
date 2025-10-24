import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SlideshowIcon from '@mui/icons-material/Slideshow'

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
import { IconAddCircle24, IconCheckCircle24, IconView16, IconShuffle16, IconPrev16, IconPlay16, IconNext16, IconRepeat16, IconPause16  } from './Icon'

import YouTubePlayer from './YouTubePlayer'

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
  const ytRef = useRef(null)
  const progressBarRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  // Reflect store -> audio or YouTube player
  // On track change: reset and load into the appropriate player
  useEffect(() => {
    setDuration(0)
    setCurrentTime(0)
    if (!currentSong) return

    if (currentSong.isYouTube) {
      try {
        const id = currentSong.youtubeVideoId || currentSong.id
        ytRef.current?.load(id)
      } catch (e) {
        console.warn('YT load failed', e)
      }
    } else {
      const el = audioRef.current
      if (!el) return
      el.pause()
      el.currentTime = 0
      el.load()
      if (isPlaying) el.play().catch(() => setPlay(false))
    }
  }, [currentSong?.id])

  // Sync play/pause to active player
  useEffect(() => {
    if (!currentSong) return
    if (currentSong.isYouTube) {
      try {
        if (isPlaying) {
          ytRef.current?.play()
        } else {
          ytRef.current?.pause()
        }
      } catch (e) { console.warn('YT play/pause error', e) }
    } else {
      const el = audioRef.current
      if (!el) return
      if (isPlaying && currentSong) el.play().catch(() => setPlay(false))
      else el.pause()
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
      if (typeof d.seekTime === 'number') {
        const seekTime = Math.min(Math.max(d.seekTime, 0), duration || 0)
        if (currentSong?.isYouTube) {
          try {
            ytRef.current?.seekTo(seekTime)
            setCurrentTime(seekTime)
          } catch (e) { console.warn('Media session YouTube seek error', e) }
        } else if (audioRef.current) {
          audioRef.current.currentTime = seekTime
          setCurrentTime(audioRef.current.currentTime)
        }
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
  }, [currentSong, queue.length, isPlaying])

  const onNext = useCallback(() => nextTrack(), [])
  const onPrev = useCallback(() => prevTrack(), [])

  const seekBy = useCallback((delta) => {
    if (!currentSong) return
    if (currentSong.isYouTube) {
      try {
        const cur = ytRef.current?.getCurrentTime() || 0
        const next = Math.min(Math.max(cur + delta, 0), duration || 0)
        ytRef.current?.seekTo(next)
        setCurrentTime(next)
      } catch (e) { console.warn('YT seekBy error', e) }
    } else {
      const el = audioRef.current
      if (!el) return
      const next = Math.min(Math.max((el.currentTime || 0) + delta, 0), duration || 0)
      el.currentTime = next
      setCurrentTime(next)
    }
  }, [duration, currentSong])

  const handleSeek = (e) => {
    const t = Number(e.target.value)
    if (!Number.isFinite(t)) return
    if (!currentSong) return
    if (currentSong.isYouTube) {
      try {
        ytRef.current?.seekTo(t)
        setCurrentTime(t)
      } catch (e) {
        console.warn('YT handleSeek error', e)
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = t
      setCurrentTime(t)
    }
  }

  const addSongToLikedSongs = useCallback(async () => {
    if (!currentSong) return
    await likeSong(currentSong)
  }, [currentSong])

  const removeSongFromLikedSongs = useCallback(async () => {
    if (!currentSong) return
    await unlikeSong(currentSong.id)
  }, [currentSong])

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
    isLiked
      ? removeSongFromLikedSongs()
      : addSongToLikedSongs()
  }

  const canControl = !!currentSong
  const canGoPrev = canControl && index > 0         // Spotify: prev disabled at start (no wrap)
  const canGoNext = canControl && index < queue.length - 1

  return (
    <div className="music-player" role="region" aria-label="Player controls">
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
          <div className='player-controls-left'>
            <button className='shuffle-btn' aria-label="Enable shuffle"><IconShuffle16 /></button>
            <button
              type="button"
              className="control-btn"
              onClick={onPrev} 
              disabled={!canGoPrev} 
              aria-label="Previous">
                <IconPrev16 />
            </button>
          </div>
          <button
            type="button"
            className="control-btn play-pause-btn"
            onClick={handleTogglePlay}
            disabled={!currentSong && queue.length === 0}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <IconPause16 style={{ fontSize: '16px' }} />
            ) : (
              <IconPlay16 style={{ fontSize: '16px' }} />
            )}
          </button>
          <div className='player-conrols-right'>
            <button 
            type="button" 
            className="control-btn" 
            onClick={onNext} 
            disabled={!canGoNext}
            aria-label="Next">
              <IconNext16 />
            </button>
            <button className='repeat-btn' aria-label="Enable repeat"><IconRepeat16 /></button>
          </div>
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
          <IconView16 />
        </button>

        <VolumeControl audioRef={audioRef} ytRef={ytRef} currentSong={currentSong} />
        <button type="button" style={{ backgroundColor: 'transparent' }} aria-label="Fullscreen">
          {/* <FullscreenIcon /> */}
        </button>
      </div>

      {/* Render audio only for non-YouTube tracks */}
      {!currentSong?.isYouTube && (
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
          }}
          onEnded={onNext}
        />
      )}

      {/* YouTube player for YouTube tracks (hidden) */}
      {currentSong?.isYouTube && (
        <YouTubePlayer
          ref={ytRef}
          videoId={currentSong.youtubeVideoId || currentSong.id}
          autoplay={isPlaying}
          onDuration={(d) => {
            setDuration(Number.isFinite(d) ? d : 0)
          }}
          onTimeUpdate={(t) => setCurrentTime(Number.isFinite(t) ? t : 0)}
          onEnded={onNext}
          onPlayingChange={(playing) => {
            if (playing !== isPlaying) {
              setPlay(playing)
            }
          }}
        />
      )}

      {isQueueOpen && (
        <QueueSidebar
          id="queue-sidebar"
          stations={queue}
          onClose={() => setIsQueueOpen(false)}
        />
      )}
    </div>
  )
}
