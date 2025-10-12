import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { updateStation } from '../store/actions/station.actions';
import { useNavigate } from 'react-router-dom';

export function EditStationModal({ station, onClose }) {

    const navigate = useNavigate()
    const [details, setDetails] = useState({
        name: '',
        description: ''
    })

    useEffect(() => {
        if (station) {
            setDetails({
                name: station.name || '',
                description: station.description || ''
            })
        }
    }, [station])

    function handleChange({ target }) {
        const { name, value } = target
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }))
    }

    function onSaveStation(ev) {
        try {
            ev.preventDefault()
            handleChange({ target: { name: 'name', value: '' } })
            handleChange({ target: { name: 'description', value: '' } })
            onClose()
            navigate('/station/' + station._id)
        } catch (err) {
            console.error('Failed to update station:', err)
        }
    }

    if (!station) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Edit details</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={onSaveStation} className="edit-details-form">
                    <div className="form-content">
                        <div className="image-uploader">
                            <div className="image-placeholder">
                                <EditIcon />
                                <span>Choose photo</span>
                            </div>
                        </div>
                        <div className="inputs-container">
                            <input
                                type="text"
                                name="name"
                                value={details.name}
                                onChange={handleChange}
                                autoFocus
                            />
                            <textarea
                                name="description"
                                value={details.description}
                                onChange={handleChange}
                                placeholder="Add an optional description"
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="save-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}