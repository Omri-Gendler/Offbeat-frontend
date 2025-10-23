import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import YouTube from 'react-youtube'

// Exposes an imperative API via ref: { load(videoId), play(), pause(), seekTo(seconds), getDuration(), getCurrentTime() }
export const YouTubePlayer = forwardRef(function YouTubePlayer(props, ref) {
  const { videoId, autoplay = false, onReady: userOnReady, onStateChange: userOnStateChange, onError: userOnError, onDuration, onTimeUpdate, onEnded, onPlay, onPause } = props
  const playerRef = useRef(null)
  const intervalRef = useRef(null)

  useImperativeHandle(ref, () => ({
    load: (id) => {
      if (!playerRef.current) return
      try {
        playerRef.current.cueVideoById(id)
        console.log('YouTube video loaded:', id)
      } catch (e) {
        console.error('YouTube load error:', e)
      }
    },
    play: () => {
      console.log('YouTubePlayer.play() called, playerRef:', !!playerRef.current)
      if (!playerRef.current) return
      try {
        playerRef.current.playVideo()
        console.log('YouTube playVideo() executed')
      } catch (e) {
        console.error('YouTube play error:', e)
      }
    },
    pause: () => {
      console.log('YouTubePlayer.pause() called, playerRef:', !!playerRef.current)
      if (!playerRef.current) return
      try {
        playerRef.current.pauseVideo()
        console.log('YouTube pauseVideo() executed')
      } catch (e) {
        console.error('YouTube pause error:', e)
      }
    },
    seekTo: (sec) => {
      if (!playerRef.current) return
      try {
        playerRef.current.seekTo(sec, true)
        console.log('YouTube seekTo:', sec)
      } catch (e) {
        console.error('YouTube seekTo error:', e)
      }
    },
    getDuration: () => {
      if (!playerRef.current) return 0
      try {
        return playerRef.current.getDuration() || 0
      } catch (e) {
        return 0
      }
    },
    getCurrentTime: () => {
      if (!playerRef.current) return 0
      try {
        return playerRef.current.getCurrentTime() || 0
      } catch (e) {
        return 0
      }
    },
    setVolume: (volume) => {
      console.log('YouTubePlayer.setVolume() called:', volume)
      if (!playerRef.current) return
      try {
        // YouTube expects volume as 0-100, not 0-1
        const ytVolume = Math.round(volume * 100)
        playerRef.current.setVolume(ytVolume)
        console.log('YouTube volume set to:', ytVolume)
      } catch (e) {
        console.error('YouTube setVolume error:', e)
      }
    },
    getVolume: () => {
      if (!playerRef.current) return 0
      try {
        // YouTube returns volume as 0-100, convert to 0-1
        const ytVolume = playerRef.current.getVolume() || 0
        return ytVolume / 100
      } catch (e) {
        return 0
      }
    }
  }), [])

  useEffect(() => {
    // cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const onReady = (event) => {
    console.log('YouTube player ready! VideoId:', videoId, 'autoplay:', autoplay)
    playerRef.current = event.target
    
    let durationSet = false
    
    // start polling time every 500ms to forward to parent
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return
      try {
        const t = playerRef.current.getCurrentTime()
        onTimeUpdate?.(t)
        
        // Only set duration once when it becomes available
        if (!durationSet) {
          const dur = playerRef.current.getDuration()
          if (dur > 0) {
            console.log('YouTube video duration:', dur)
            onDuration?.(dur)
            durationSet = true
          }
        }
      } catch (err) {}
    }, 500)
    
    userOnReady?.(event)

    if (autoplay) {
      // small timeout to allow YouTube to properly start
      console.log('Auto-playing YouTube video')
      setTimeout(() => {
        try { 
          playerRef.current.playVideo()
          console.log('YouTube autoplay executed')
        } catch (e) {
          console.error('YouTube autoplay error:', e)
        }
      }, 100)
    }
  }

  const onStateChange = (event) => {
    const YT = {
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5
    }
    console.log('YouTube state change:', event.data, 'videoId:', videoId)
    if (event.data === YT.PLAYING) {
      console.log('YouTube is now PLAYING')
      // Notify parent that playback started
      props.onPlayingChange?.(true)
    }
    if (event.data === YT.PAUSED) {
      console.log('YouTube is now PAUSED')
      // Notify parent that playback paused
      props.onPlayingChange?.(false)
    }
    if (event.data === YT.ENDED) {
      console.log('YouTube video ENDED')
      props.onPlayingChange?.(false)
      onEnded?.()
    }
    userOnStateChange?.(event)
  }

  const onError = (e) => {
    userOnError?.(e)
  }

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0
    }
  }

  if (!videoId) return null

  return (
    <div style={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  )
})

export default YouTubePlayer
