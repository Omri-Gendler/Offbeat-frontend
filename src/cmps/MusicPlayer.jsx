import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import DoneIcon from '@mui/icons-material/Done';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { showSuccessMsg } from '../services/event-bus.service';

import { addSongToLikedAction } from '../store/actions/station.actions';

export function MusicPlayer({ station }) {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isAdded, setIsAdded] = useState(false)
    const progressBarRef = useRef(null)

    const dispatch = useDispatch()

    const songSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    useEffect(() => {
        const progressPercent = duration ? (currentTime / duration) * 100 : 0;

        if (progressBarRef.current) {
            progressBarRef.current.style.setProperty('--progress-percent', `${progressPercent}%`);
        }
    }, [currentTime, duration])

    const togglePlayPause = () => {
        setIsPlaying(prev => {
            if (!prev) audioRef.current.play()
            else audioRef.current.pause()
            return !prev
        })
    }

    function addSongToLiked(songToAdd) {
        const stations = JSON.parse(localStorage.getItem('station')) || []

        if (!stations.length) {
            return
        }

        const likedSongsArray = stations[0].songs

        const songExists = likedSongsArray.some(song => song.id === songToAdd.id)
        if (songExists) {
            return
        }

        likedSongsArray.push(songToAdd)
        localStorage.setItem('station', JSON.stringify(stations))
    }

    const handleAddClick = () => {
        const currentSong = station?.songs?.[0]
        if (!currentSong) return

        setIsAdded(prevIsAdded => {
            const newIsAdded = !prevIsAdded

            if (newIsAdded) {
                // אם המצב החדש הוא "נוסף" (true)
                showSuccessMsg('Added to Your Library')
                addSongToLiked(currentSong)
                dispatch(addSongToLikedAction(currentSong))
            } else {
                showSuccessMsg('Removed from Your Library')
            }

            return newIsAdded
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

    function handleLengthChange() {
        setDuration(audioRef.current.duration)
        setCurrentTime(audioRef.current.currentTime)
    }


    return (
        <footer className="music-player">
            <div className="player-left">
                <img src={station?.imgUrl || '/img/unnamed-song.png'} alt="Album Cover" className="player-album-cover" style={{ width: '50px', height: '50px' }} />
                <div className="player-song-info">
                    <span className="song-title">{station?.name}</span>
                    <span className="song-artist">{station?.artist}</span>
                    <span className='created-by'>{station?.createdBy?.fullname}</span>
                </div>
                {
                    <button className="tertiary-btn" aria-label="add to your library" onClick={handleAddClick}>
                        {isAdded ? <DoneIcon style={{ color: 'green' }} /> : <AddCircleOutlineIcon className="icon" />}
                    </button>

                }
            </div>

            <div className="player-center">
                <div className="player-controls">
                    <button className="control-btn"><SkipPreviousIcon style={{ fontSize: '25px', marginLeft: '2px' }} /></button>
                    <button className="control-btn play-pause-btn" onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon style={{ fontSize: '25px', marginLeft: '2px' }} /> : <PlayArrowIcon style={{ fontSize: '25px', marginLeft: '2px' }} />}
                    </button>
                    <button className="control-btn"><SkipNextIcon style={{ fontSize: '25px', marginLeft: '2px' }} /></button>
                </div>
                <div className="progress-bar-container">
                    <span className="time-stamp">{formatTime(currentTime)}</span>
                    <input
                        ref={progressBarRef}
                        type="range"
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        className="progress-bar"
                    />
                    <span className="time-stamp">{formatTime(duration) || '4:20'}</span>
                </div>
            </div>

            <div className="player-right">
            </div>

            <audio
                ref={audioRef}
                src={songSrc}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onEnded={() => setIsPlaying(false)}
            />
        </footer>
    )
}