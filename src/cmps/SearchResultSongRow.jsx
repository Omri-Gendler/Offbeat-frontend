import { useSelector } from 'react-redux';
import { likeSong, unlikeSong } from '../store/actions/station.actions';
import { selectIsSongLiked } from '../store/selectors/player.selectors';
import { IconAddCircle24, IconCheckCircle24 } from './Icon.jsx';
import { PlayPauseButton } from './PlayPauseButton';

export function SearchResultSongRow({ song, mapIndex, isThisSongPlaying, handlePlayPauseClick, formatDuration }) {

    const isLiked = useSelector(state => selectIsSongLiked(state, song?.id));

    const handleToggleLike = async (e) => {
        e.stopPropagation()
        if (!song?.id) return;
        try {
            if (!isLiked) {
                await likeSong(song)
            } else {
                await unlikeSong(song.id)
            }
        } catch (err) {
            console.error('toggle like failed', err)
        }
    }

    return (
        <div
            className={`song-row-youtube ${isThisSongPlaying ? 'active' : ''}`}
            onClick={() => handlePlayPauseClick(song, mapIndex + 1)}
        >
            <div className="col-index">
                <div className="track-number">
                    <span className="number">{mapIndex + 2}</span>
                    <div className="play-pause-btn">
                        <PlayPauseButton
                            isPlaying={isThisSongPlaying}
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPauseClick(song, mapIndex + 1);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="col-title">
                <div className="track-info">
                    {song.imgUrl && (
                        <img src={song.imgUrl} alt={song.title} className="track-image" />
                    )}
                    <div className="track-details">
                        <div className={`track-name ${isThisSongPlaying ? 'playing' : ''}`}>
                            {song.title}
                        </div>
                        <div className="track-artist">{song.artists}</div>
                    </div>
                </div>
            </div>

            <div className="col-album">
                <span className="album-name">{song.album || 'YouTube'}</span>
            </div>

            <div className="col-date">
                <span className="date-added">Today</span>
            </div>

            <div className="col-duration">
                <div className="duration-actions">
                    <button
                        className={`add-btn ${isLiked ? 'is-liked' : ''}`}
                        aria-label={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
                        onClick={handleToggleLike}
                    >
                        {isLiked ? <IconCheckCircle24 /> : <IconAddCircle24 />}
                    </button>

                    <span className="duration">{formatDuration(song.durationMs)}</span>
                    {/* <button className="more-btn" aria-label="More options">
                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
                            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="currentColor"></path>
                        </svg>
                    </button> */}
                </div>
            </div>
        </div>
    )
}