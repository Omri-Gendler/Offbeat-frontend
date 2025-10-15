// src/cmps/VolumeControl.jsx

import React, { useState, useEffect, useRef } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

export function VolumeControl({ audioRef }) {
    const [volume, setVolume] = useState(80)
    const volumeSliderRef = useRef(null)

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value
        setVolume(newVolume)
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }

        if (volumeSliderRef.current) {
            volumeSliderRef.current.style.setProperty('--volume-progress', `${volume}%`)
        }
    }, [volume, audioRef])

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