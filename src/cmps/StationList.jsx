import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { FastAverageColor } from 'fast-average-color';
import { useNavigate } from 'react-router-dom'



import { useState, useEffect } from 'react'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {

    const [dynamicBgColor, setDynamicBgColor] = useState('#121212')
    const Navigate = useNavigate()

    useEffect(() => {
        if (!stations || !stations.length || !stations[0].imgUrl) {
            setDynamicBgColor('#121212')
            return
        }

        const imageUrl = stations[0].imgUrl
        const fac = new FastAverageColor()

        fac.getColorAsync(imageUrl, { algorithm: 'dominant' })
            .then(color => {
                const gradient = `linear-gradient(${color.hex} 0%, #121212 350px)`
                setDynamicBgColor(gradient)
            })
            .catch(e => {
                console.error('Error getting image color:', e)
                setDynamicBgColor('#121212')
            })

        return () => {
            fac.destroy()
        }

    }, [stations])

    return (
        <section className="station-list-container" style={{ background: dynamicBgColor }}>

        <div className='main-station-list-filters'>
            <button>All</button>
            <button>Music</button>
        </div>

            <div className='station-list-recents'>
                {stations.slice(0, 6).map(station => (
                    <button key={station._id} className="recent-item">
                        <img src={station.imgUrl} alt={station.name} />
                        <span>{station.name}</span>
                    </button>
                ))}
            </div>

            <h2 className='station-list-title'>All Stations</h2>

            <ul className="station-list">
                {stations.map(station =>
                    <li key={station._id} onClick={() => Navigate(`/station/${station._id}`)}>
                        <StationPreview station={station} />
                        {<div className="actions">
                            {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                            {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                        </div>}
                    </li>
                )}
            </ul>
        </section>
    )
}