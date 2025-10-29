import { userService } from '../../services/user'
import { store } from '../store'
import { addDefaultStationsToUserLibrary } from '../../services/demo-data.service'
import { socketService } from '../../services/socket.service.js'

import { showErrorMsg } from '../../services/event-bus.service'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer'
import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER, SET_LIKED_SONGS } from '../reducers/user.reducer'

export async function loadLikedSongs() {
    const loggedinUser = store.getState().userModule.user
    if (!loggedinUser) return;

    try {
        console.log('Loading liked songs from backend...');
        const likedSongs = await userService.getLikedSongs()
        console.log('Liked songs received:', likedSongs);
        store.dispatch({ type: SET_LIKED_SONGS, likedSongs: likedSongs || [] })
    } catch (err) {
        console.error('Failed to load liked songs', err)
    }
}

export async function loadUsers() {
    try {
        store.dispatch({ type: LOADING_START })
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)

        store.dispatch({
            type: SET_USER,
            user
        })

        await loadLikedSongs();

        const userLibraryKey = `userLibrary_${user._id}`
        const hasDefaultStations = localStorage.getItem(userLibraryKey)

        if (!hasDefaultStations) {
            addDefaultStationsToUserLibrary(user)
            localStorage.setItem(userLibraryKey, 'true')

            const { loadStations } = await import('./station.actions')
            loadStations()
        }

        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)

        addDefaultStationsToUserLibrary(user)

        const userLibraryKey = `userLibrary_${user._id}`
        localStorage.setItem(userLibraryKey, 'true')

        const { loadStations } = await import('./station.actions')
        loadStations()

        store.dispatch({
            type: SET_USER,
            user
        })
        store.dispatch({ type: SET_LIKED_SONGS, likedSongs: [] });
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {

        store.dispatch({ type: SET_USER, user: null })
        socketService.logout()
        await userService.logout()

        store.dispatch({
            type: SET_USER,
            user: null
        })
        store.dispatch({ type: SET_LIKED_SONGS, likedSongs: [] });
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const user = await userService.getById(userId)
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}
