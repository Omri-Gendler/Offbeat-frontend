import { useSelector, useDispatch } from 'react-redux'
import { setIndex } from '../store/actions/player.actions'

export function QueueSidebar({ stations, onClose }) {

    const dispatch = useDispatch()
    const currentSongIndex = useSelector(storeState => storeState.playerModule.index)

    const onPlayFromQueue = (idx) => {
        dispatch(setIndex(idx))
    }

    if (!stations || !stations.length) {
        return (
            <div className="modal-overlay-queue" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <header className="modal-header">
                        <h2>Queue</h2>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </header>
                    <p>Empty</p>
                </div>
            </div>
        )
    }


    return (
        <div className="modal-overlay-queue" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Next</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                <ul className="queue-list">
                    {stations.map((song, index) => {
                        const isPlayingThisSong = (index === currentSongIndex)

                        return (
                            <li
                                key={song.id || index}
                                className={`queue-item ${isPlayingThisSong ? 'active' : ''}`}
                                onClick={() => onPlayFromQueue(index)}
                            >
                                <img src={song.imgUrl || '/img/unnamed-song.png'} alt={song.title} />
                                <div className="item-details">
                                    <p className="item-name">{song.title || 'Unknown Title'}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}