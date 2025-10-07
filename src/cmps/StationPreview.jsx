import { Link} from 'react-router-dom'
import { NavLink , useNavigate} from 'react-router-dom'


export function StationPreview({ station }) {
    const navigate = useNavigate()

    return <article className="station-preview">
        <header onClick={() => navigate(`/station/${station._id}`)}>
            <img className="station-img" src={station.imgUrl} alt="" />
            <NavLink to={`station/${station._id}`}>{station.name}</NavLink>
        </header>

        {station.owner && <p>Owner: <span>{station.owner.fullname}</span></p>}
        
    </article>
}