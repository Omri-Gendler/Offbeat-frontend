import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { LikeButtonWithFireworks } from './LikeButtonWithFireworks.jsx'

import {
  setIndex,
  setPlay,
  nextTrack,
  prevTrack,
  togglePlay,
  cycleRepeatMode,
  toggleShuffle,

  // setProgress, // optional if you track progress in Redux
} from '../store/actions/player.actions'

import { selectCurrentSong, selectIsSongLiked } from '../store/selectors/player.selectors'

import { utilService } from '../services/util.service'
import { stationService } from '../services/station'
import { loadStations, setCurrSong } from '../store/actions/station.actions'
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service'
import {
  joinStationRoom,
  leaveStationRoom,
  broadcastPlay,
  broadcastPause
} from '../store/actions/socket.actions'

import { QueueSidebar } from './QueueSidebar'
import { VolumeControl } from './VolumeControl'
import { IconAddCircle24, IconCheckCircle24, IconView16, IconShuffle16, IconPrev16, IconPlay16, IconNext16, IconRepeat16, IconPause16 } from './Icon'
import YouTubePlayer from './YouTubePlayer'
import { showUserMsg } from '../services/event-bus.service'
import { Icon } from '@mui/material'

const FALLBACK = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function MusicPlayer({ station }) {
  const {
    queue = [],
    index = 0,
    isPlaying = false,
    shuffle = false,
    repeat = 'off',
    playOrder = [],
    contextId = null,
    contextType = null,
  } = useSelector(s => s.playerModule || {}, shallowEqual)

  const currentSong = useMemo(() => {
    if (!queue?.length || !playOrder?.length) return null
    const safeIdx = Math.min(Math.max(index, 0), playOrder.length - 1)
    const realIdx = playOrder[safeIdx] ?? safeIdx
    return queue[realIdx] || null
  }, [queue, playOrder, index])

  // Use the same selector as SongRow for consistency
  const isLiked = useSelector(
    state => (currentSong?.id ? selectIsSongLiked(state, currentSong.id) : false)
  )

const likedSongsCount = useSelector(s => s.userModule?.likedSongs?.length || 0)

// …later, only the console.log is conditional
if (currentSong?.title?.includes('Blinding Lights')) {
  console.log(`🎵 MusicPlayer Liked State Debug [${currentSong?.title}]:`, {
    songId: currentSong?.id,
    isLiked,
    likedSongsCount,
  })
}

  const audioRef = useRef(null)
  const ytRef = useRef(null)
  const progressBarRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  // Debug logging for audio playback issues
  useEffect(() => {
    if (currentSong) {
      console.log('🎵 Current Song Debug:')
      console.log('- Title:', currentSong.title)
      console.log('- URL:', currentSong.url)
      console.log('- isYouTube:', currentSong.isYouTube)
      console.log('- Has audioRef:', !!audioRef.current)
      console.log('- Song object:', currentSong)
    }
  }, [currentSong])

  // Join/leave station rooms when context changes
  const lastRoomRef = useRef(null);
  useEffect(() => {
    // Join station room if we're in a station context or if we have station prop
    const isInStationContext = contextType === 'station' || (station && station._id)
    const stationIdToUse = contextType === 'station' ? contextId : station?._id

    if (isInStationContext && stationIdToUse) {
      // Add small delay to avoid conflicts with StationDetails room joining
      const timeoutId = setTimeout(() => {
        console.log(`🎵 MusicPlayer: Joining station room: ${stationIdToUse} (contextType: ${contextType})`)
        if (lastRoomRef.current && lastRoomRef.current !== stationIdToUse) {
          console.log(`🎵 MusicPlayer: Leaving previous room: ${lastRoomRef.current}`)
          leaveStationRoom(lastRoomRef.current)
        }
        joinStationRoom(stationIdToUse)
        lastRoomRef.current = stationIdToUse
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        if (lastRoomRef.current === stationIdToUse) {
          console.log(`🎵 MusicPlayer: Leaving station room: ${stationIdToUse}`)
          leaveStationRoom(stationIdToUse)
          lastRoomRef.current = null
        }

      }
    }
  }, [contextId, contextType, station?._id])

  const emitPlay = useCallback(() => {
    console.log(`🎵 EMIT PLAY CHECK: contextType=${contextType}, contextId=${contextId}, currentSong=${currentSong?.title}, isYouTube=${currentSong?.isYouTube}`)

    // Check if we're in a station context (either directly or through a station song)
    const isInStationContext = contextType === 'station' || (station && station._id)
    const stationIdToUse = contextType === 'station' ? contextId : station?._id

    if (isInStationContext && stationIdToUse && currentSong) {
      // Get current playback position for sync
      let currentPlayTime = 0
      if (currentSong.isYouTube) {
        currentPlayTime = ytRef.current?.getCurrentTime() || 0
      } else {
        currentPlayTime = audioRef.current?.currentTime || 0
      }

      console.log(`Broadcasting play for station ${stationIdToUse}, index: ${index}, song: ${currentSong.title} ${currentSong.isYouTube ? '(YouTube)' : '(Audio)'}, time: ${currentPlayTime}s`)
      broadcastPlay(stationIdToUse, index, currentSong, currentPlayTime)
    } else {
      console.log(`🎵 NOT BROADCASTING: contextType=${contextType}, stationId=${stationIdToUse}, currentSong=${!!currentSong}`)
    }
  }, [contextId, contextType, currentSong, index, station])

  const emitPause = useCallback(() => {
    console.log(`🎵 EMIT PAUSE CHECK: contextType=${contextType}, contextId=${contextId}`)

    // Check if we're in a station context (either directly or through a station song)
    const isInStationContext = contextType === 'station' || (station && station._id)
    const stationIdToUse = contextType === 'station' ? contextId : station?._id

    if (isInStationContext && stationIdToUse) {
      console.log(`Broadcasting pause for station ${stationIdToUse}`)
      broadcastPause(stationIdToUse)
    } else {
      console.log(`🎵 NOT BROADCASTING PAUSE: contextType=${contextType}, stationId=${stationIdToUse}`)
    }
  }, [contextId, contextType, station])

  // Reflect store -> audio or YouTube player
  // On track change: reset and load into the appropriate player
  useEffect(() => {
    setDuration(0)
    setCurrentTime(0)
    if (!currentSong) return

    console.log(`🎵 LOADING NEW SONG: ${currentSong.title}, isPlaying: ${isPlaying}`)

    if (currentSong.isYouTube) {
      try {
        const id = currentSong.youtubeVideoId || currentSong.id
        console.log('🔄 Loading YouTube video:', id)
        ytRef.current?.load(id)

        // For YouTube, start playing immediately if isPlaying is true
        if (isPlaying) {
          console.log('▶️ Auto-playing YouTube video after load')
          // Small delay to ensure video is loaded
          setTimeout(() => {
            ytRef.current?.play()
          }, 300)
        }
      } catch (e) {
        console.warn('YT load failed', e)
      }
    } else {
      const el = audioRef.current
      if (!el) {
        console.log('❌ No audio element reference')
        return
      }
      console.log('🔄 Loading audio:', currentSong.url)
      el.pause()
      el.currentTime = 0
      el.src = currentSong.url // Explicitly set the source
      el.load()

      // Wait for metadata to load before potentially playing
      const onLoadedMetadata = () => {
        const duration = el.duration
        console.log('✅ Audio metadata loaded, duration:', duration)
        if (Number.isFinite(duration) && duration > 0) {
          setDuration(duration)
        }

        if (isPlaying) {
          console.log('▶️ Auto-playing loaded audio')
          el.play().catch((error) => {
            console.error('❌ Audio play failed:', error)
            setPlay(false)
          })
        }
        el.removeEventListener('loadedmetadata', onLoadedMetadata)
      }

      const onCanPlay = () => {
        const duration = el.duration
        console.log('✅ Audio can play, duration:', duration)
        if (Number.isFinite(duration) && duration > 0) {
          setDuration(duration)
        }
        el.removeEventListener('canplay', onCanPlay)
      }

      const onDurationChange = () => {
        const duration = el.duration
        console.log('✅ Audio duration changed:', duration)
        if (Number.isFinite(duration) && duration > 0) {
          setDuration(duration)
        }
      }

      el.addEventListener('loadedmetadata', onLoadedMetadata)
      el.addEventListener('canplay', onCanPlay)
      el.addEventListener('durationchange', onDurationChange)

      // Fallback: if metadata doesn't load within 2 seconds, try to play anyway
      const timeoutId = setTimeout(() => {
        if (isPlaying && el.paused) {
          console.log('⚠️ Metadata timeout, attempting to play anyway')
          el.play().catch((error) => {
            console.error('❌ Fallback audio play failed:', error)
            setPlay(false)
          })
        }
      }, 2000)

      // Cleanup function for this song
      return () => {
        clearTimeout(timeoutId)
        el.removeEventListener('loadedmetadata', onLoadedMetadata)
        el.removeEventListener('canplay', onCanPlay)
        el.removeEventListener('durationchange', onDurationChange)
      }
    }
  }, [currentSong?.id])

  // Sync play/pause to active player
  useEffect(() => {
    if (!currentSong) return

    console.log(`🎵 SYNC PLAYER: isPlaying=${isPlaying}, song=${currentSong.title}, isYouTube=${currentSong.isYouTube}`)

    if (currentSong.isYouTube) {
      try {
        if (isPlaying) {
          console.log(`▶️ Playing YouTube video: ${currentSong.youtubeVideoId || currentSong.id}`)
          ytRef.current?.play()
        } else {
          console.log(`⏸️ Pausing YouTube video: ${currentSong.youtubeVideoId || currentSong.id}`)
          ytRef.current?.pause()
        }
      } catch (e) {
        console.warn('YT play/pause error', e)
      }
    } else {
      const el = audioRef.current
      if (!el) return
      if (isPlaying && currentSong) {
        console.log(`▶️ Playing audio: ${currentSong.url}`)
        el.play().catch(() => setPlay(false))
      } else {
        console.log(`⏸️ Pausing audio: ${currentSong.url}`)
        el.pause()
      }
    }
  }, [isPlaying, currentSong?.id])

  // Broadcast play/pause changes to other users with debouncing
  useEffect(() => {
    if (!currentSong) {
      console.log(`🎵 BROADCAST: No current song, skipping broadcast`)
      return
    }

    console.log(`🎵 BROADCAST: Song changed or play state changed - isPlaying: ${isPlaying}, song: ${currentSong.title}`)

    // Add a small delay to debounce rapid state changes
    const timeoutId = setTimeout(() => {
      if (isPlaying) {
        console.log(`🎵 BROADCAST: Calling emitPlay`)
        emitPlay()
      } else {
        console.log(`🎵 BROADCAST: Calling emitPause`)
        emitPause()
      }
    }, 50) // 50ms debounce

    return () => clearTimeout(timeoutId)
  }, [isPlaying, currentSong?.id, emitPlay, emitPause])

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

  // Socket sync seek events
  useEffect(() => {
    const handleSeekYouTube = (e) => {
      const { time } = e.detail
      console.log(`🎯 Received seekYouTube event: ${time}s`)
      if (currentSong?.isYouTube && ytRef.current) {
        try {
          ytRef.current.seekTo(time)
          setCurrentTime(time)
        } catch (error) {
          console.error('YouTube seek error:', error)
        }
      }
    }

    const handleSeekAudio = (e) => {
      const { time } = e.detail
      console.log(`🎯 Received seekAudio event: ${time}s`)
      if (!currentSong?.isYouTube && audioRef.current) {
        try {
          audioRef.current.currentTime = time
          setCurrentTime(time)
        } catch (error) {
          console.error('Audio seek error:', error)
        }
      }
    }

    window.addEventListener('seekYouTube', handleSeekYouTube)
    window.addEventListener('seekAudio', handleSeekAudio)

    return () => {
      window.removeEventListener('seekYouTube', handleSeekYouTube)
      window.removeEventListener('seekAudio', handleSeekAudio)
    }
  }, [currentSong])

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
      setIndex(0)
      setPlay(true)
    } else {
      togglePlay()
    }
    // Note: Socket broadcasting is now handled by useEffect watching isPlaying changes
  }, [currentSong, queue.length])

  const onNext = useCallback(() => {
    nextTrack()
    // Note: Socket broadcasting is now handled by useEffect watching isPlaying/currentSong changes
  }, [])

  const onPrev = useCallback(() => {
    prevTrack()
    // Note: Socket broadcasting is now handled by useEffect watching isPlaying/currentSong changes  
  }, [])

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

  const fmt = (s) => {
    if (!Number.isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  const onAddToLibrary = useCallback(async () => {
    if (!currentSong?.id) return
    try {
      if (isLiked) {
        await unlikeSong(currentSong.id)
      } else {
        await likeSong(currentSong)
      }
    } catch (err) {
      console.error('toggle like failed in MusicPlayer', err)
    }
  }, [currentSong, isLiked])

  const canControl = !!currentSong
const canGoPrev = canControl && (index > 0 || repeat === 'all')
const canGoNext = canControl && (index < (playOrder?.length || 0) - 1 || repeat === 'all')


  return (
    <div className="music-player" role="region" aria-label="Player controls">
      <div className="player-left">
        <img
          src={currentSong?.imgUrl || getAssetUrl(ASSET_PATHS.UNNAMED_SONG)}
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
        <LikeButtonWithFireworks
          isLiked={isLiked}
          onToggleLike={onAddToLibrary}
          className="tertiary-btn"
          ariaLabel={isLiked ? 'In Your Library' : 'Add to Your Library'}
          disabled={!currentSong}
        />
      </div>
      <div className="player-center">
        <div className="player-controls" role="group" aria-label="Playback">
          <div className='player-controls-left'>
            <button
              className={`shuffle-btn ${shuffle ? 'is-active' : ''}`}
              onClick={() => toggleShuffle()}
              aria-pressed={shuffle}
              aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            >
              <IconShuffle16 />
            </button>
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
          <div className='player-controls-right'>
            <button
              type="button"
              className="control-btn"
              onClick={onNext}
              disabled={!canGoNext}
              aria-label="Next">
              <IconNext16 />
            </button>
            <button
              className={`repeat-btn repeat-${repeat} ${repeat ? 'is-active' : ''}`}
              onClick={() => cycleRepeatMode()}
              aria-pressed={repeat !== 'off'}
              aria-label={`Repeat: ${repeat}`}
            >
              <IconRepeat16 />
            </button>

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
        </button>
        <button type="button" style={{ backgroundColor: 'transparent' }} aria-label="Cast">
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
        </button>
      </div>

      {!currentSong?.isYouTube && (
        <audio
          ref={audioRef}
          src={currentSong?.url || FALLBACK}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const d = e.target.duration || 0
            if (Number.isFinite(d) && d > 0) {
              setDuration(d)
            }
          }}
          onCanPlay={(e) => {
            const d = e.target.duration || 0
            if (Number.isFinite(d) && d > 0) {
              setDuration(d)
            }
          }}
          onDurationChange={(e) => {
            const d = e.target.duration || 0
            if (Number.isFinite(d) && d > 0) {
              setDuration(d)
            }
          }}
          onTimeUpdate={() => {
            const t = audioRef.current?.currentTime || 0
            setCurrentTime(t)
          }}
          onEnded={() => {
            if (repeat === 'one') {
              const el = audioRef.current
              if (el) { el.currentTime = 0; el.play?.().catch(() => setPlay(false)) }
            } else {
              onNext()
            }
          }}
          onError={(e) => {
            if (currentSong?.url !== FALLBACK) {
              // Try fallback URL
              e.target.src = FALLBACK
            }
          }}
          onLoadStart={() => {
            console.log('🔄 Audio load started for:', currentSong?.url)
          }}
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

          onEnded={() => {
            if (repeat === 'one') {
              try { ytRef.current?.seekTo(0); ytRef.current?.play() } catch { }
            } else {
              onNext()
            }
          }}

          onPlayingChange={(playing) => {
            console.log(`🎬 YouTube playing state changed: ${playing}, current isPlaying: ${isPlaying}`)
            // Only update state if it's different and not from a socket event
            if (playing !== isPlaying) {
              console.log(`🎬 Updating isPlaying state to: ${playing}`)
              setPlay(playing)
            }
          }}
        />
      )}

      <QueueSidebar
        id="queue-sidebar"
        stations={queue}
        onClose={() => setIsQueueOpen(false)}
        isOpen={isQueueOpen}
      />
    </div>
  )
}
