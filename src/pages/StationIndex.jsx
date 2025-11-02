import { useState, useEffect, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'
import { StationList } from '../cmps/StationList'
import { ArtistList } from '../cmps/ArtistList'
import { Recents } from '../cmps/Recents.jsx' // ← make sure this file exists
import {
    loadStations,
    addStation,
    updateStation,
    removeStation,
} from '../store/actions/station.actions'

import {
    playContext,
    togglePlay,
    setPlay,
} from '../store/actions/player.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { userService } from '../services/user'
import { getArtists } from '../services/demo-data.service'
import { IconPlay24 } from '../cmps/Icon'




export function StationIndex() {

    const [filterBy, setFilterBy] = useState({ ...stationService.getDefaultFilter(), kind: 'all' })
    const [showAllMadeForYou, setShowAllMadeForYou] = useState(false)
    const [showAllJumpBack, setShowAllJumpBack] = useState(false)
    const [showAllPop, setShowAllPop] = useState(false)
    const [showAllArtists, setShowAllArtists] = useState(false)
    const [artists, setArtists] = useState([])
    const stations = useSelector(storeState => storeState.stationModule.stations)
    console.log('stations', stations)
    const navigate = useNavigate()

    useEffect(() => {
        loadStations(filterBy)
        setArtists(getArtists())
    }, [filterBy])

    function onShowAllMadeForYou() {
        setShowAllMadeForYou(!showAllMadeForYou)
    }

    function onShowAllArtists() {
        setShowAllArtists(!showAllArtists)
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

    function onPlayArtist(artist) {
        // For now, we'll just log the artist - later you can implement artist playlists
        console.log('Playing artist:', artist.title)
        showSuccessMsg(`Playing top tracks by ${artist.title}`)
    }

    async function onRemoveStation(stationId) {
        try {
            await removeStation(stationId)
            showSuccessMsg('Playlist removed')
        } catch (err) {
            showErrorMsg('Cannot remove playlist')
        }
    }

    async function onAddStation() {
        const station = stationService.getEmptyStation()
        station.name = prompt('Name?', 'Some Name')
        try {
            const saved = await addStation(station)
            showSuccessMsg(`Playlist added ("${saved.name}")`)
        } catch {
            showErrorMsg('Cannot add playlist')
        }
    }

    async function onLikeStation(station) {
        const stationToSave = { ...station, likes: (station.likes || 0) + 1 }

        try {
            const savedStation = await updateStation(stationToSave)
            showSuccessMsg(`You liked "${savedStation.name}"! It now has ${savedStation.likes} likes. 👍`)
        } catch (err) {
            showErrorMsg('Cannot like playlist')
        }
    }

    function filterStationsByKind(stations, kind) {
        if (kind === 'all') return stations
        if (kind === 'music') {
            return stations.filter(station => station.isSpotifyPlaylist || station.tags?.includes('music'))
        }
        if (kind === 'podcasts') {
            return stations.filter(station => station.tags?.includes('podcasts'))
        }
        return stations
    }

    function getFilterDisplayText(kind, count) {
        const kindText = kind === 'all' ? 'All' : kind === 'music' ? 'Music' : 'Podcasts'
        return kindText
    }

    function onShowAllPop() {
        setShowAllPop(!showAllPop)
    }

    // Apply filtering to stations
    const filteredStations = filterStationsByKind(stations || [], filterBy.kind)

    // Get stations for different sections
    const recentStations = filteredStations?.slice(1, 7) || []
    const madeForYouStations = showAllMadeForYou ? filteredStations : (filteredStations?.slice(1, 15) || [])
    const jumpBackStations = showAllJumpBack ? filteredStations : (filteredStations?.slice(9, 23) || [])
    const popStations = showAllPop ? filteredStations : (filteredStations?.slice(28, 41) || [])
    
    // Get artists for artists section
    const displayedArtists = showAllArtists ? artists : (artists?.slice(0, 7) || [])

    return (
        <section className="station-index">
            <Outlet />

            {/* Quick access grid */}
            <div className="content-section">
                <div className='filter-by-kind'>
                    <button
                        className={filterBy.kind === 'all' ? 'active' : ''}
                        onClick={() => setFilterBy({ ...filterBy, kind: 'all' })}
                    >
                        {getFilterDisplayText('all', stations?.length || 0)}
                    </button>
                    <button
                        className={filterBy.kind === 'music' ? 'active' : ''}
                        onClick={() => setFilterBy({ ...filterBy, kind: 'music' })}
                    >
                        {getFilterDisplayText('music', filterStationsByKind(stations || [], 'music').length)}
                    </button>
                </div>
                <div className="quick-access-grid">
                    {recentStations.map(station => (
                        <div key={station._id} className="quick-access-item" onClick={() => navigate(`/station/${station._id}`)}>
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
                            variant="grid"
                            index={true} />
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
            {popStations.length > 0 && (
                <div className="content-section jump-back-section">
                    <div className="section-header">
                        <h2 className="section-title">Popular Stations</h2>
                        <button
                            className="show-all-btn"
                            onClick={onShowAllPop}
                        >
                            {showAllPop ? 'Show less' : 'Show all'}
                        </button>
                    </div>
                    <div className={`station-grid ${showAllPop ? 'show-all' : ''}`}>
                        <StationList
                            stations={popStations}
                            onRemoveStation={onRemoveStation}
                            onEditStation={updateStation}
                            onLikeStation={onLikeStation}
                            variant="grid" />
                    </div>

                </div>
            )}

            {/* Artists section */}
            {displayedArtists.length > 0 && (
                <div className="content-section artists-section">
                    <div className="section-header">
                        <h2 className="section-title">Popular Artists</h2>
                        <button
                            className="show-all-btn"
                            onClick={onShowAllArtists}
                        >
                            {showAllArtists ? 'Show less' : 'Show all'}
                        </button>
                    </div>
                    <div className={`artist-grid ${showAllArtists ? 'show-all' : ''}`}>
                        <ArtistList
                            artists={artists}
                            onPlayArtist={onPlayArtist}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}
