import { useSelector, useDispatch } from 'react-redux'
import { setIndex } from '../store/actions/player.actions'
import { IconClose16, IconPause16, IconMoreHorizontal24, IconShuffle16, IconRepeat16, DurationIcon } from './Icon'
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service'

export function QueueSidebar({ stations, onClose, isOpen }) {
    const dispatch = useDispatch()
    const currentSongIndex = useSelector(storeState => storeState.playerModule.index)

    const onPlayFromQueue = (idx) => {
        dispatch(setIndex(idx))
    }

    const currentSong = stations[currentSongIndex]
    const upcomingSongs = stations.slice(currentSongIndex + 1)

    return (
        <div className={`queue-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="queue-content">
                <header className="queue-header">
                    <h3>Queue</h3>
                    <button className="close-btn" onClick={onClose}>
                        <IconClose16 size={16} />
                    </button>
                </header>

                {currentSong && (
                    <div className="currently-playing">
                        <h4>Playing Liked Songs</h4>
                        <div className="current-song">
                            <img 
                                src={currentSong.imgUrl || getAssetUrl(ASSET_PATHS.UNNAMED_SONG)} 
                                alt={currentSong.title}
                                className="song-image"
                            />
                            <div className="song-info">
                                <p className="song-title">{currentSong.title || 'Unknown Title'}</p>
                                <p className="song-artist">{currentSong.artist || currentSong.creator || 'Unknown Artist'}</p>
                            </div>
                            <button className="pause-btn">
                                <IconPause16 size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="next-section">
                    <h4>Next</h4>
                    {upcomingSongs.length > 0 ? (
                        <ul className="queue-list">
                            {upcomingSongs.map((song, index) => {
                                const actualIndex = currentSongIndex + 1 + index
                                return (
                                    <li
                                        key={song.id || actualIndex}
                                        className="queue-item"
                                        onClick={() => onPlayFromQueue(actualIndex)}
                                    >
                                        <img 
                                            src={song.imgUrl || getAssetUrl(ASSET_PATHS.UNNAMED_SONG)} 
                                            alt={song.title}
                                            className="song-image"
                                        />
                                        <div className="song-info">
                                            <p className="song-title">{song.title || 'Unknown Title'}</p>
                                            <p className="song-artist">{song.artist || song.creator || 'Unknown Artist'}</p>
                                        </div>
                                        <button className="more-options">
                                            <IconMoreHorizontal24 size={16} />
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p className="empty-queue">No more songs in queue</p>
                    )}
                </div>

                <div className="queue-controls">
                    <button className="control-btn">
                        <IconShuffle16 size={16} />
                        <span>Shuffle</span>
                    </button>
                    <button className="control-btn">
                        <IconRepeat16 size={16} />
                        <span>Repeat</span>
                    </button>
                    <button className="control-btn">
                        <DurationIcon size={16} />
                        <span>Timer</span>
                    </button>
                </div>
            </div>
        </div>
    )
}