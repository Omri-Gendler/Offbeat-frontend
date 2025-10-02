import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadStations } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";
import { useMemo } from "react";

import AddIcon from '@mui/icons-material/Add';


export function LeftSideBar() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    const [filterBy, setFilterBy] = useState({ txt: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadStations()
    }, [])

    function handleChange(ev) {
        const { name, value } = ev.target;
        setFilterBy({ ...filterBy, [name]: value })
    }

    const filteredStations = useMemo(() => {
        if (!filterBy.txt) return stations
        const regex = new RegExp(filterBy.txt, 'i')
        return stations.filter(station => regex.test(station.name))
    }, [stations, filterBy])


    function searchBar() {
        return (
            <div className="search-bar">
                <input
                    type="text"
                    name="txt"
                    value={filterBy.txt}
                    onChange={handleChange}
                />
            </div>
        )
    }


    function leftHeader() {
        return (
            <div className="left-header">
                <h3>Your Library</h3>
                <button onClick={() => navigate('/stations/add')}><AddIcon /></button>
            </div>
        )
    }


    useEffect(() => {
        loadStations()
    }, [])

    return (
        <aside className="left-side-bar">
            {leftHeader()}
            {searchBar()}
            <div className="library-list">
                {filteredStations.map(station => (
                    <div key={station._id} className="library-item">
                        <img src={station.imgUrl} alt="" />
                        <p>{maxLength(station.name, 10)}</p>
                    </div>
                ))}
            </div>
        </aside>
    )
}