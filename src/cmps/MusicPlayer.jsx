import React, { useState, useRef } from 'react';

export function MusicPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const songSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // שיר לדוגמה

    const togglePlayPause = () => {
        setIsPlaying(prev => {
            if (!prev) audioRef.current.play();
            else audioRef.current.pause();
            return !prev;
        });
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };
    
    // פונקציה להמרת שניות לפורמט דקות:שניות
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="music-player">
            <audio
                ref={audioRef}
                src={songSrc}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onEnded={() => setIsPlaying(false)} // עצור את האנימציה בסוף השיר
            />

            <h3>My Awesome Player</h3>
            
            <button onClick={togglePlayPause}>
                {isPlaying ? 'Pause ⏯️' : 'Play ▶️'}
            </button>
            
            <div>
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    value={currentTime}
                    max={duration || 0}
                    onChange={handleSeek}
                    step="0.01"
                />
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}