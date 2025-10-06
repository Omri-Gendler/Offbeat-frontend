import { Link} from 'react-router-dom'


export function StationPreview({ station }) {
    return <article className="station-preview">
        <header>
            {<img className="station-img" src={station.imgUrl} alt="" />}
                       
            <Link>{station.name}</Link>
        </header>

        {station.owner && <p>Owner: <span>{station.owner.fullname}</span></p>}
        
    </article>
}