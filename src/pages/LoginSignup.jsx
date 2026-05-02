import { Outlet, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'
import { ASSET_PATHS, getAssetUrl } from '../services/asset.service'

export function LoginSignup() {
    return (
        <div className="login-page">
            <section className="auth-shell">
                <div className="auth-card">
                    <div className="auth-brand">
                        <img src={getAssetUrl(ASSET_PATHS.SPOTIFY_LOGO)} alt="Offbeat" />
                        <h1>Offbeat</h1>
                    </div>

                    <p className="auth-subtitle">Music for everyone.</p>

                    <nav className="auth-tabs">
                        <NavLink to="login">Login</NavLink>
                        <NavLink to="signup">Signup</NavLink>
                    </nav>

                    <Outlet/>
                </div>

                <section className="auth-mobile-shots" aria-label="Offbeat mobile screenshots">
                    <img src={getAssetUrl(ASSET_PATHS.SPOTIFY_MOBILE_1)} alt="Offbeat mobile view 1" />
                    <img src={getAssetUrl(ASSET_PATHS.SPOTIFY_MOBILE_2)} alt="Offbeat mobile view 2" />
                </section>
            </section>
        </div>
    )
}

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username) return
        await login(credentials)
        navigate('/')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
        <form className="login-form" onSubmit={onLogin}>
            <label className="auth-label" htmlFor="auth-user-select">Choose account</label>
            <select
                id="auth-user-select"
                className="auth-input"
                name="username"
                value={credentials.username}
                onChange={handleChange}>
                    <option value="">Select User</option>
                    {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
            </select>
            <button className="auth-primary-btn">Login</button>
        </form>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <label className="auth-label" htmlFor="auth-fullname">Full name</label>
            <input
                id="auth-fullname"
                className="auth-input"
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <label className="auth-label" htmlFor="auth-username">Username</label>
            <input
                id="auth-username"
                className="auth-input"
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <label className="auth-label" htmlFor="auth-password">Password</label>
            <input
                id="auth-password"
                className="auth-input"
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <ImgUploader onUploaded={onUploaded} />
            <button className="auth-primary-btn">Signup</button>
        </form>
    )
}