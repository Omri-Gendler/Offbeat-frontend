import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStations, addStation, updateStation, removeStation, addStationMsg } from '../store/actions/station.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { userService } from '../services/user'
import { Outlet } from 'react-router-dom'

import { StationList } from '../cmps/StationList'
import { IconPlay24 } from '../cmps/Icon'
import { playContext } from '../store/actions/player.actions'


export function StationIndex() {

    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())
    const [showAllMadeForYou, setShowAllMadeForYou] = useState(false)
    const [showAllJumpBack, setShowAllJumpBack] = useState(false)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    console.log('stations',stations)

    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])

    function onShowAllMadeForYou() {
        setShowAllMadeForYou(!showAllMadeForYou)
    }

    function onShowAllJumpBack() {
        setShowAllJumpBack(!showAllJumpBack)
    }

    function onPlayStation(station) {
        if (!station?.songs?.length) return
        
        playContext({
            contextId: station._id,
            contextType: 'station',
            tracks: station.songs,
            index: 0,
            autoplay: true
        })
    }

    async function onRemoveStation(stationId) {
        try {
            await removeStation(stationId)
            showSuccessMsg('Station removed')
        } catch (err) {
            showErrorMsg('Cannot remove station')
        }
    }

    async function onAddStation() {
        const station = stationService.getEmptyStation()
        station.name = prompt('Name?', 'Some Name')
        try {
            const savedStation = await addStation(station)
            showSuccessMsg(`Station added (id: ${savedStation._id})`)
        } catch (err) {
            showErrorMsg('Cannot add station')
        }
    }

    async function onLikeStation(station) {
        const stationToSave = { ...station, likes: (station.likes || 0) + 1 }

        try {
            const savedStation = await updateStation(stationToSave)
            showSuccessMsg(`You liked "${savedStation.name}"! It now has ${savedStation.likes} likes. 👍`)
        } catch (err) {
            showErrorMsg('Cannot like station')
        }
    }

    // Get stations for different sections
    const recentStations = stations?.slice(0, 6) || []
    const madeForYouStations = showAllMadeForYou ? (stations || []) : (stations?.slice(0, 5) || [])
    const jumpBackStations = showAllJumpBack ? (stations || []) : (stations?.slice(0, 6) || [])

    return (
        <section className="station-index">
            <Outlet />
            
            {/* Quick access grid */}
            <div className="content-section">
                <div className="quick-access-grid">
                    {recentStations.map(station => (
                        <div key={station._id} className="quick-access-item">
                            <img src={station.imgUrl} alt={station.name} />
                            <div className="quick-access-content">
                                <h3 className="quick-access-title">{station.name}</h3>
                            </div>
                            <button 
                                className="quick-access-play-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPlayStation(station)
                                }}
                                aria-label={`Play ${station.name}`}
                            >
                                <IconPlay24 />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Made for You section */}
            {madeForYouStations.length > 0 && (
                <div className="content-section made-for-section">
                    <div className="section-header">
                        <h2 className="section-title">Made for Omri Gendler</h2>
                        <button 
                            className="show-all-btn" 
                            onClick={onShowAllMadeForYou}
                        >
                            {showAllMadeForYou ? 'Show less' : 'Show all'}
                        </button>
                    </div>
                    <div className={`station-grid ${showAllMadeForYou ? 'show-all' : ''}`}>
                        <StationList
                            stations={madeForYouStations}
                            onRemoveStation={onRemoveStation}
                            onEditStation={updateStation}
                            onLikeStation={onLikeStation}
                            variant="grid" />
                    </div>
                </div>
            )}

            {/* Jump back in section */}
            {jumpBackStations.length > 0 && (
                <div className="content-section jump-back-section">
                    <div className="section-header">
                        <h2 className="section-title">Jump back in</h2>
                        <button 
                            className="show-all-btn" 
                            onClick={onShowAllJumpBack}
                        >
                            {showAllJumpBack ? 'Show less' : 'Show all'}
                        </button>
                    </div>
                    <div className={`station-grid ${showAllJumpBack ? 'show-all' : ''}`}>
                        <StationList
                            stations={jumpBackStations}
                            onRemoveStation={onRemoveStation}
                            onEditStation={updateStation}
                            onLikeStation={onLikeStation}
                            variant="grid" />
                    </div>
                </div>
            )}
        </section>
    )
}