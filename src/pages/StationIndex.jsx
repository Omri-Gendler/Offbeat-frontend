import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStations, addStation, updateStation, removeStation, addStationMsg } from '../store/actions/station.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station'
import { userService } from '../services/user'
import { Outlet } from 'react-router-dom'

import { StationList } from '../cmps/StationList'
import { StationFilter } from '../cmps/StationFilter'

export function StationIndex() {

    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])

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

    return (
        <section className="station-index">
            <StationFilter filterBy={filterBy} setFilterBy={setFilterBy} />
            <header>
                {userService.getLoggedinUser() && <button onClick={onAddStation}>Add a Station</button>}
            </header>
            <Outlet />
            <StationList
                stations={stations}
                onRemoveStation={onRemoveStation}
                onLikeStation={onLikeStation} />
        </section>
    )
}