import { Link, NavLink } from 'react-router-dom'

export function StationPreview({ station }) {
    return <article className="station-preview">
        <header>
            <NavLink to={`/${station._id}`}>{station.name}</NavLink>
        </header>

        {station.owner && <p>Owner: <span>{station.owner.fullname}</span></p>}
        
    </article>
}