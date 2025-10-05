import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StationFilter } from './StationFilter'
import { useState } from 'react'
import { stationService } from '../services/station'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	return (
		<header className="app-header full">
	
			<nav>
				<div className='logo-container'>
					<img className='app-header-logo' src="/img/spotify-white-icon.webp" alt="Offbeat Logo" onClick={() => navigate('')} />
				</div>
			
				 <button className="home-btn" title="Home" onClick={() => navigate('')}>
						<svg fill="#ffffffff" width="24" height="24" viewBox="-1.27 0 30.066 30.066" id="_01_-_Home_Button" data-name="01 - Home Button" xmlns="http://www.w3.org/2000/svg" data-iconid="home-button" data-svgname="home button">
						<path id="_01_-_Home_Button-2" data-name="01 - Home Button" d="M29.759,9.912a3,3,0,0,0-1.543-2.623L17.457,1.312a3,3,0,0,0-2.914,0L3.784,7.289A3,3,0,0,0,2.241,9.912V28a3,3,0,0,0,3,3h6.5a1,1,0,0,0,1-1V24.912a1,1,0,0,1,1-1h4.51a1,1,0,0,1,1,1V30a1,1,0,0,0,1,1h6.5a3,3,0,0,0,3-3V9.912Zm-2,0V28a1,1,0,0,1-1,1h-5.5V24.912a3,3,0,0,0-3-3h-4.51a3,3,0,0,0-3,3V29h-5.5a1,1,0,0,1-1-1V9.912a1,1,0,0,1,.514-.875L15.514,3.06a1,1,0,0,1,.972,0L27.245,9.037a1,1,0,0,1,.514.875Z" transform="translate(-2.241 -0.934)" fillRule="evenodd"></path>
						</svg>
				</button>

				<StationFilter filterBy={filterBy} setFilterBy={setFilterBy} />
				

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
				{user && (
					<div className="user-info">
						<Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							{user.fullname}
							1
						</Link>
						<span className="score">{user.score?.toLocaleString()}</span>
						<button onClick={onLogout}>logout</button>
					</div>
				)}
			</nav>
		</header>
	)
}
