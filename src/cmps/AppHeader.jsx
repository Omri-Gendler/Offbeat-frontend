import { Link, NavLink } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StationFilter } from './StationFilter'
import { useState, useEffect } from 'react'
import { stationService } from '../services/station'
import { HomeFilledIcon, HomeOutlineIcon } from './Icon'
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const location = useLocation()
	const isActive = location.pathname === '/'
	const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter())
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

			<nav className='nav'>

				<div className='logo-container'>
					<img className='app-header-logo' src={getAssetUrl(ASSET_PATHS.SPOTIFY_LOGO)} alt="Offbeat Logo" onClick={() => navigate('')} />
				</div>
				<div className='middle-app-header flex'>
					<button className="home-btn" title="Home" onClick={() => navigate('')}>
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
				
				{/* User Avatar */}
				<div className="user-avatar-container">
					{user ? (
						<Link to={`user/${user._id}`} className="user-profile-link">
							<img 
								src={user.imgUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'} 
								alt={user.fullname || 'User'} 
								className="user-avatar"
							/>
						</Link>
					) : (
						<img 
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" 
							alt="Default User" 
							className="user-avatar"
						/>
					)}
				</div>
			</nav>
		</header>
	)
}
