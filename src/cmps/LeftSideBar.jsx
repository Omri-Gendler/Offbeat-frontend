import { useSelector } from "react-redux";
import { useEffect } from "react";
import { loadStations } from "../store/actions/station.actions";


export function LeftSideBar() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    console.log(stations.map(station => station.imgUrl));
    

    useEffect(() => {
        loadStations()
    }, [])

    return (
        <aside className="left-side-bar">
            {stations.map(station => (
                <div key={station._id} className="station-preview">
                    <img src={station.imgUrl} alt="" />
                </div>
            ))}
        </aside>
    )
}