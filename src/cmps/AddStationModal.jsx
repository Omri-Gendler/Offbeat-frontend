import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationService } from '../services/station';
import { addStation } from '../store/actions/station.actions';
import StationCover from '../cmps/StationCover.jsx';

export function AddStationModal() {
    const unnamedImg = '/img/unnamed.png'
    const [stationName, setStationName] = useState('')
    const navigate = useNavigate()

    const handleClose = () => {
        navigate('/stations')
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!stationName) return

        const newStation = stationService.getEmptyStation()
        newStation.name = stationName


        try {
            const savedStation = await addStation(newStation)
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to add station', err)
        }
    }

    return (
        <section className="add-station-page station-details">
            <div className="content-spacing">
                <header className="station-header flex align-center">
                    <StationCover station={{ imgUrl: unnamedImg }} isEditable={false} />

                    <div className="station-meta">
                        <span className="station-type">Public Playlist</span>

                        <form onSubmit={handleSubmit} className="new-station-form">
                            <label htmlFor="stationName" className="sr-only">My Playlist {`#`}</label>
                            {/* <input
                                type="text"
                                id="stationName"
                                value={stationName}
                                onChange={(ev) => setStationName(ev.target.value)}
                                placeholder="My New Playlist"
                                autoFocus
                                className="station-title-input"
                            /> */}
                            {/* <button type="submit" className="create-btn">Create</button> */}
                        </form>

                        <div className="station-byline">
                            <a className="station-owner" href="">You</a>
                            <span className="dot">•</span>
                            <span className="station-stats">0 songs</span>
                        </div>
                    </div>
                </header>

                <div className="station-tracks">
                    <p className="no-songs-msg">Start adding songs to your new playlist!</p>
                </div>
            </div>

        </section>
    )
}