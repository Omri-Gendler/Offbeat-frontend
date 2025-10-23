// src/cmps/VolumeControl.jsx

import React, { useState, useEffect, useRef } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

export function VolumeControl({ audioRef, ytRef, currentSong }) {
    const [volume, setVolume] = useState(80)
    const volumeSliderRef = useRef(null)

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value
        setVolume(newVolume)
    }

    useEffect(() => {
        const volumeLevel = volume / 100
        
        if (currentSong?.isYouTube && ytRef?.current) {
            // Set YouTube volume
            try {
                ytRef.current.setVolume(volumeLevel)
                console.log('Set YouTube volume to:', volume)
            } catch (e) {
                console.warn('YouTube volume control error:', e)
            }
        } else if (audioRef?.current) {
            // Set regular audio volume
            audioRef.current.volume = volumeLevel
        }

        if (volumeSliderRef.current) {
            volumeSliderRef.current.style.setProperty('--volume-progress', `${volume}%`)
        }
    }, [volume, audioRef, ytRef, currentSong])

    return (
        <div className="volume-control-container">
            <VolumeUpIcon />
            <input
                ref={volumeSliderRef}
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Volume"
                style={{ '--volume-progress': `${volume}%` }}
            />
        </div>
    )
}