import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addStation, loadStations } from "../store/actions/station.actions";
import { stationService } from "../services/station";

import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";


export function LeftSideBar() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    const [filterBy, setFilterBy] = useState({ txt: '', sortField: '', sortDir: 1 })
    const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

    const navigate = useNavigate()

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value

        switch (type) {
            case 'text':
            case 'radio':
                value = field === 'sortDir' ? +ev.target.value : ev.target.value
                if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit({ ...filterToEdit, [field]: value })
    }


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

    const handleAddStation = async (stationName) => {
        const newStation = stationService.getEmptyStation()
        newStation.name = stationName

        try {
            await addStation(newStation)
        } catch (err) {
            console.error('Failed to add station', err)
        }
    }


    function leftHeader() {
        return (
            <div className="left-header">
                <h3>Your Library</h3>
                {searchBar()}
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
            {stations.map(station => (
                <div key={station._id}>
                    <img src={station.imgUrl} alt="" />
                    <p>{station.name}</p>
                </div>
            ))}
        </aside>
    )
}