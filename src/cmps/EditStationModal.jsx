import { useState } from 'react';

export function EditStationModal({ station, onSave, onClose }) {
    const [stationName, setStationName] = useState(station.name)

    function handleChange({ target }) {
        setStationName(target.value)
    }

    function onSaveStation(ev) {
        ev.preventDefault()
        onSave({ ...station, name: stationName })
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Edit details</h2>

                <form onSubmit={onSaveStation}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={stationName}
                        onChange={handleChange}
                        autoFocus
                    />
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}