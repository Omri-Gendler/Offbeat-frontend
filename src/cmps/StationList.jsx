import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { FastAverageColor } from 'fast-average-color';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { maxLength } from '../services/util.service'
import { ContextMenu } from './ContextMenu';



export function StationList({ stations, onRemoveStation, onUpdateStation }) {

    const [dynamicBgColor, setDynamicBgColor] = useState('#121212')

    const navigate = useNavigate()
    const recentsScrollRef = useRef(null)

    const [contextMenu, setContextMenu] = useState({
        isOpen: false,
        position: { x: 0, y: 0 },
        stationId: null,
    })

    const handleRecentsScroll = (scrollOffset) => {
        if (recentsScrollRef.current) {
            recentsScrollRef.current.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            })
        }
    }

    const handleContextMenu = (event, stationId) => {
        event.preventDefault()

        setContextMenu({
            isOpen: true,
            position: { x: event.pageX, y: event.pageY },
            stationId: stationId,
        })
    }

    const handleCloseMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false })
    }

    const handleDelete = () => {
        if (contextMenu.stationId) {
            onRemoveStation(contextMenu.stationId)
            handleCloseMenu()
        }
    }

    useEffect(() => {
        if (contextMenu.isOpen) {
            window.addEventListener('click', handleCloseMenu)
        }

        return () => {
            window.removeEventListener('click', handleCloseMenu)
        }
    }, [contextMenu.isOpen])

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

            <div className='main-station-list-header'>

                <div className='main-station-list-filters'>
                    <button>All</button>
                    <button>Music</button>
                </div>

                

                <div className='station-list-recents'>
                    {stations.slice(0, 6).map(station => (
                        <button
                            onClick={() => navigate(`/station/${station._id}`)}
                            key={station._id}
                            className="recent-item-list"
                        >
                            <img src={station.imgUrl} alt={station.name} />
                            <span>{maxLength(station.name, 15)}</span>

                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>

                        </button>
                    ))}
                </div>

                <h2 className='station-list-title'>All Stations</h2>
            </div>
            <div className="station-list-content">


                <ul className="station-list">
                    {stations.map(station => (
                        <li key={station._id} onContextMenu={(event) => handleContextMenu(event, station._id)} className="station-list-wrapper">

                            <StationPreview station={station} />
                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>


                            <div className="actions">
                                {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                                {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                            </div>

                        </li>
                    ))}
                </ul>
                <ul className="station-list">
                    {stations.map(station => (
                        <li key={station._id} onContextMenu={(event) => handleContextMenu(event, station._id)} className="station-list-wrapper">

                            <StationPreview station={station} />
                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>


                            <div className="actions">
                                {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                                {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                            </div>

                        </li>
                    ))}
                </ul>
                <ul className="station-list">
                    {stations.map(station => (
                        <li key={station._id} onContextMenu={(event) => handleContextMenu(event, station._id)} className="station-list-wrapper">

                            <StationPreview station={station} />
                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>


                            <div className="actions">
                                {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                                {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                            </div>

                        </li>
                    ))}
                </ul>
                <ul className="station-list">
                    {stations.map(station => (
                        <li key={station._id} onContextMenu={(event) => handleContextMenu(event, station._id)} className="station-list-wrapper">

                            <StationPreview station={station} />
                            <div className="play-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                </svg>
                            </div>


                            <div className="actions">
                                {/* <button onClick={() => onUpdateStation(station)}>Edit</button> */}
                                {/* <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                            </div>

                        </li>
                    ))}
                </ul>
            </div >
            {contextMenu.isOpen && (
                <ContextMenu
                    position={contextMenu.position}
                    onDelete={handleDelete}
                    onClose={handleCloseMenu}
                />
            )}
        </section >
    )
}

