
export function QueueSidebar({ stations, onClose }) {
    if (!stations || !stations.length) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <header className="modal-header">
                        <h2>Queue</h2>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </header>
                    <p>התור ריק.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Next</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                <ul className="queue-list">
                    {stations.map(station => (
                        <li key={station._id} className="queue-item">
                            <img src={station.imgUrl || '/img/unnamed-song.png'} alt={station.name} />
                            <div className="item-details">
                                <p className="item-name">{station.name}</p>
                                <p className="item-creator">{station.createdBy?.fullname}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}