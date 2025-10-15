import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DoneIcon from '@mui/icons-material/Done';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { showSuccessMsg } from '../services/event-bus.service';
import { addLikedSong } from '../services/station/station.service.local';

import { addSongToLikedAction, updateStation } from '../store/actions/station.actions';

export function MusicPlayer({ station }) {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const progressBarRef = useRef(null)

    const currentSong = station?.songs?.[0]

    const isLiked = useSelector(storeState => {
        const likedStation = storeState.stationModule.stations.find(s => s._id === 'liked-songs-station')
        if (!likedStation || !currentSong) return false
        return likedStation.songs.some(song => song.id === currentSong.id)
    })

    const dispatch = useDispatch()

    const songSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    useEffect(() => {
        const progressPercent = duration ? (currentTime / duration) * 100 : 0;

        if (progressBarRef.current) {
            progressBarRef.current.style.setProperty('--progress-percent', `${progressPercent}%`);
        }
    }, [currentTime, duration])

    const togglePlayPause = () => {
        const currentSong = station?.songs[0]
        if (!currentSong) return
        setIsPlaying(prev => {
            if (!prev) audioRef.current.play()
            else audioRef.current.pause()
            return !prev
        })
    }



    const handleAddClick = () => {
        const currentSong = station?.songs?.[0]
        if (!currentSong) return

        if (isLiked) {
        } else {
            showSuccessMsg('Added to Your Library')

            addLikedSong(currentSong)

            dispatch(addSongToLikedAction(currentSong)) 
        }
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
                        {isLiked ? <DoneIcon style={{ color: 'green' }} /> : <AddCircleOutlineIcon className="icon" />}
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