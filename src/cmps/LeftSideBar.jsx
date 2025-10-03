import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { loadStations } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

export function LeftSideBar() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const [filterBy, setFilterBy] = useState({ txt: '' })
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadStations();
    }, []);

    function handleChange(ev) {
        const { name, value } = ev.target
        setFilterBy({ ...filterBy, [name]: value })
    }

    const filteredStations = useMemo(() => {
        if (!filterBy.txt) return stations
        const regex = new RegExp(filterBy.txt, 'i')
        return stations.filter(station => regex.test(station.name))
    }, [stations, filterBy])

    function searchBar() {
        const inputRef = useRef(null);

        useEffect(() => {
            if (isSearchOpen) {
                inputRef.current?.focus()
            }
        }, [isSearchOpen])

        return (
            <div className={`search-container ${isSearchOpen ? 'expanded' : ''}`}>
                <SearchIcon className="search-icon" onClick={() => setIsSearchOpen(true)} />
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

    function sortFilteredStations() {
        return (
            <div className="sort-by">
                <button>Albums</button>
                <button>Artists</button>
                <button>Playlist</button>
            </div>
        );
    }

    return (
        <section className="left-side-bar">
            <aside className="station-list-container">
                {leftHeader()}
                {sortFilteredStations()}
                <section className="search-and-recent">
                    {searchBar()}
                    <button>Recent</button>
                </section>
                <div className="library-list">
                    {filteredStations.map(station => (
                        <div key={station._id} className="library-item">
                            <img src={station.imgUrl} alt={station.name} />
                            <p>{maxLength(station.name, 10)}</p>
                        </div>
                    ))}
                </div>
            </aside>
        </section>
    );
}