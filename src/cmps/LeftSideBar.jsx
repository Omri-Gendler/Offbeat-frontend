import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { loadStations } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";
import { addStation } from "../store/actions/station.actions";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export function LeftSideBar() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const navigate = useNavigate()

    const [filterBy, setFilterBy] = useState({ txt: '' })
    const [sortBy, setSortBy] = useState('recent')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [viewMode, setViewMode] = useState('grid')

    useEffect(() => {
        loadStations()
    }, [])

    const handleCreateStation = async () => {
        try {
            const playlistNumbers = stations
                .map(s => s.name.match(/^My Playlist #(\d+)$/))
                .filter(Boolean)
                .map(match => parseInt(match[1]))

            const nextNumber = playlistNumbers.length > 0 ? Math.max(...playlistNumbers) + 1 : 1

            const newStation = {
                name: `My Playlist #${nextNumber}`,
                description: '',
                imgUrl: '/img/unnamed-song.png',
                songs: [],
                createdBy: { fullname: 'You' }
            }

            const savedStation = await addStation(newStation)

            navigate(`/station/${savedStation._id}`)

        } catch (err) {
            console.error('Failed to create station:', err)
        }
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setFilterBy({ ...filterBy, [name]: value })
    }

    const stationsToDisplay = useMemo(() => {
        let stationsToShow = [...stations]
        if (sortBy === 'albums' || sortBy === 'artists' || sortBy === 'station') {
            stationsToShow = stationsToShow.filter(station => station.type === sortBy)
        }
        if (filterBy.txt) {
            const regex = new RegExp(filterBy.txt, 'i')
            stationsToShow = stationsToShow.filter(station => regex.test(station.name))
        }
        if (sortBy !== 'recent') {
            stationsToShow.sort((a, b) => a.name.localeCompare(b.name))
        }
        return stationsToShow
    }, [stations, filterBy, sortBy])

    function searchBar() {
        const inputRef = useRef(null)
        useEffect(() => {
            if (isSearchOpen) {
                inputRef.current?.focus()
            }
        }, [isSearchOpen])
        return (
            <div className={`search-container-left-side-bar ${isSearchOpen ? 'expanded' : ''}`}>
                <SearchIcon className="search-icon" onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', height: '24px' }} />
                {isSearchOpen ? (
                    <input
                        className="search-input"
                        ref={inputRef}
                        type="text"
                        name="txt"
                        value={filterBy.txt}
                        onChange={handleChange}
                        placeholder="Search in Your Library"
                        onBlur={() => setIsSearchOpen(false)}
                    />
                ) : (
                    <span className="search-placeholder" onClick={() => setIsSearchOpen(true)}></span>
                )}
            </div>
        );
    }

    function leftHeader() {
        return (
            <div className="left-header">
                <h3>Your Library</h3>
                <button className="create-station-btn" onClick={handleCreateStation}>
                    <AddIcon />
                </button>
            </div>
        )
    }

    return (
        <section className="left-side-bar">


            <aside className="station-list-container">
                <div className="library-filters">

                    {leftHeader()}

                    {/* <button className={`filter-btn ${sortBy === 'albums' ? 'selected' : ''}`} onClick={() => setSortBy('albums')}>Albums</button>
                    <button className={`filter-btn ${sortBy === 'artists' ? 'selected' : ''}`} onClick={() => setSortBy('artists')}>Artists</button>
                    <button className={`filter-btn ${sortBy === 'stations' ? 'selected' : ''}`} onClick={() => setSortBy('stations')}>stations</button> */}

                    <section className="search-and-recent">
                        {searchBar()}
                        <div className="recent-btn">
                            {/* <button className={`filter-btn ${sortBy === 'recent' ? 'selected' : ''}`} onClick={() => setSortBy('recent')}>Recent</button> */}
                            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="view-toggle-btn">
                                {viewMode === 'grid'
                                    ? <FormatListBulletedIcon style={{ fontSize: '18px', color: 'var(--clr4)' }} />
                                    : <GridViewIcon style={{ fontSize: '16px', color: 'var(--clr4)' }} />
                                }
                            </button>
                        </div>
                    </section>
                </div>

                <div className={`library-list ${viewMode}`}>
                    {stationsToDisplay.map(station => (
                        <div key={station._id} className="library-item" onClick={() => navigate(`/station/${station._id}`)}>
                            <img src={station.imgUrl ? station.imgUrl : '/img/unnamed-song.png'} alt={station.name} />
                            <div className="station-info">
                                <div className="play-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5V19L19 12L8 5Z" fill="black" />
                                    </svg>
                                </div>
                                <p>{maxLength(station.name, 20)}</p>
                                <p className="station-type">Playlist•{`${station.songs.length} songs`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </section >
    )
}