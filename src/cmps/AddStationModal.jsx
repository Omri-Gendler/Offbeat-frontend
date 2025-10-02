import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationService } from '../services/station';
import { addStation } from '../store/actions/station.actions';

export function AddStationModal() {
    const [stationName, setStationName] = useState('')
    const navigate = useNavigate()

    const handleClose = () => {
        navigate('/stations')
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!stationName) return

        const newStation = stationService.getEmptyStation()
        newStation.name = stationName;

        try {
            const savedStation = await addStation(newStation)
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to add station', err)
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="stationName">Station Name</label>
                    <input
                        type="text"
                        id="stationName"
                        value={stationName}
                        onChange={(ev) => setStationName(ev.target.value)}
                        placeholder="My awesome station"
                        autoFocus
                    />
                    <button type="submit">Create</button>
                </form>
                <button className="close-btn" onClick={handleClose}>X</button>
            </div>
        </div>
    );
}