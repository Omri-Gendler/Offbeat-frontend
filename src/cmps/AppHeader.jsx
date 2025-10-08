import { Link, NavLink } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StationFilter } from './StationFilter'
import { useState } from 'react'
import { stationService } from '../services/station'
import { HomeFilledIcon, HomeOutlineIcon } from './Icon'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const location = useLocation()
	const isActive = location.pathname === '/'
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
				<div className='middle-app-header flex'>
					<button className="home-btn" title="Home" onClick={() => navigate('/')}>
					{isActive ? (
						<HomeFilledIcon size={24} color="#fff" />
					) : (
						<HomeOutlineIcon size={24} color="#b3b3b3" />
					)}
					</button>

					<StationFilter filterBy={filterBy} setFilterBy={setFilterBy} />
				</div>

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
