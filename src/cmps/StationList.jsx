import { userService } from '../services/user'
import { StationPreview } from './StationPreview'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {


    return (
        <section className="station-list-container">
            <div className='station-list-recents'>
                {stations.slice(0, 6).map(station => (
                    <button key={station._id} className="recent-item">
                        <img src={station.imgUrl} alt={station.name} />
                        <span>{station.name}</span>
                    </button>
                ))}
            </div>

            <ul className="station-list">
                {stations.map(station =>
                    <li key={station._id}>
                        {<img className="station-img" src={station.imgUrl} alt="" style={{ height: '160px', width: '100%', objectFit: 'cover' }} />}
                        <StationPreview station={station} />
                        {<div className="actions">
                            {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                            <button onClick={() => onRemoveStation(station._id)}>x</button>
                        </div>}
                    </li>
                )}
            </ul>
        </section>
    )
}