import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationService } from '../services/station';
import { addStation } from '../store/actions/station.actions';
import { SongsList } from '../cmps/SongsList.jsx';
import {PlaylistHeader} from './PlaylistHeader.jsx';
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service';

export function AddStationModal() {
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
        newStation.imgUrl = getAssetUrl(ASSET_PATHS.UNNAMED_SONG)
        newStation.songs = [
            { id: 's101', title: 'Song A', artist: 'Artist 1', album: 'Album X', duration: '3:45', imgUrl: '/img/songA.jpg' },
            { id: 's102', title: 'Song B', artist: 'Artist 2', album: 'Album Y', duration: '4:15', imgUrl: '/img/songB.jpg' }
        ]
        // newStation._id = stationName.toLowerCase().replace(/\s+/g, '-')
        newStation.createdBy = {
            fullname: 'You',
        }
        

        try {
            const savedStation = await addStation(newStation)
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to add station', err)
        }

        logger.log('New station created:', newStation)
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
                            <input
                                type="text"
                                id={stationName}
                                value={stationName}
                                onChange={(ev) => setStationName(ev.target.value)}
                                placeholder="My New Playlist"
                                autoFocus
                                className="station-title-input"
                            />
                            <button type="submit" className="create-btn">Create</button>
                        </form>

                        <div className="station-byline">
                            <a className="station-owner" href="">You</a>
                            <span className="dot">•</span>
                            <span className="station-stats">0 songs</span>
                        </div>
                    </div>
                </header>

                <div className="station-tracks">
                    <div className="station-tracks">
                        <SongsList station={station} />
                    </div>
                </div>
            </div>

        </section>
    )
}