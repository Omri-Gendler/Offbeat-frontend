import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { loadStations } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';

export function LeftSideBar() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const [filterBy, setFilterBy] = useState({ txt: '' })
    const [sortBy, setSortBy] = useState('recent')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadStations()
    }, [])

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
            <div className={`search-container ${isSearchOpen ? 'expanded' : ''}`}>
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
                    <span className="search-placeholder" onClick={() => setIsSearchOpen(true)}>

                    </span>
                )}
            </div>
        );
    }

    function leftHeader() {
        return (
            <div className="left-header">
                <h3>Your Library</h3>
                <button className="create-station-btn" onClick={() => navigate('/stations/add')}><AddIcon /> Create</button>
            </div>
        );
    }

    return (
        <section className="left-side-bar">
            <aside className="station-list-container">
                {leftHeader()}
                <button onClick={() => setSortBy('albums')}>Albums</button>
                <button onClick={() => setSortBy('artists')}>Artists</button>
                <button onClick={() => setSortBy('playlists')}>Playlists</button>
                <section className="search-and-recent">
                    {searchBar()}
                    <div className="recent-btn">
                        <button onClick={() => setSortBy('recent')}>Recent</button>
                        <GridViewIcon style={{ fontSize: '16px', color: 'var(--clr4)' }} />
                    </div>
                </section>
                <div className="library-list">
                    {stationsToDisplay.map(station => (
                        <div key={station._id} className="library-item" onClick={() => navigate(`/station/${station._id}`)}>
                            <img src={station.imgUrl || '/img/react.svg'} alt={station.name} />
                            <div className="station-info">
                                <p>{maxLength(station.name, 20)}</p>
                                <p className="station-type">Playlist</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </section>
    )
} 