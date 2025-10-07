import React, { useState, useRef } from 'react';

export function MusicPlayer({ station }) {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const songSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    const togglePlayPause = () => {
        setIsPlaying(prev => {
            if (!prev) audioRef.current.play()
            else audioRef.current.pause()
            return !prev
        })
    }

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value)
        audioRef.current.currentTime = time
        setCurrentTime(time)
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    return (
        <footer className="music-player">
            <div className="player-left">
                <img src={station?.imgUrl} alt="Album Cover" className="player-album-cover" style={{ width: '50px', height: '50px' }} />
                <div className="player-song-info">
                    <span className="song-title">{station?.name}</span>
                    <span className="song-artist">{station?.artist}</span>
                </div>
            </div>

            <div className="player-center">
                <div className="player-controls">
                    <button className="control-btn">Prev</button>
                    <button className="control-btn play-pause-btn" onClick={togglePlayPause}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button className="control-btn">Next</button>
                </div>
                <div className="progress-bar-container">
                    <span className="time-stamp">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        value={currentTime}
                        max={duration || 0}
                        onChange={handleSeek}
                        className="progress-bar"
                    />
                    <span className="time-stamp">4:20</span>
                </div>
            </div>

            <div className="player-right">
            </div>

            <audio
                ref={audioRef}
                src={songSrc}
                onLoadedMetadata={() => setDuration(audio - Ref.current.duration)}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onEnded={() => setIsPlaying(false)}
            />
        </footer>
    )
}