import { userService } from '../../services/user'
import { store } from '../store'
import { addDefaultStationsToUserLibrary } from '../../services/demo-data.service'

import { showErrorMsg } from '../../services/event-bus.service'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer'
import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER } from '../reducers/user.reducer'

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
        
        // Check if user already has default stations (avoid adding duplicates)
        const userLibraryKey = `userLibrary_${user._id}`
        const hasDefaultStations = localStorage.getItem(userLibraryKey)
        
        if (!hasDefaultStations) {
            // Add 15 default stations to user's library
            addDefaultStationsToUserLibrary(user)
            // Mark that user has received default stations
            localStorage.setItem(userLibraryKey, 'true')
            
            // Reload stations to show the new ones in the library
            const { loadStations } = await import('./station.actions')
            loadStations()
        }
        
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        
        // Add 15 default stations to new user's library
        addDefaultStationsToUserLibrary(user)
        
        // Mark that user has received default stations
        const userLibraryKey = `userLibrary_${user._id}`
        localStorage.setItem(userLibraryKey, 'true')
        
        // Reload stations to show the new ones in the library
        const { loadStations } = await import('./station.actions')
        loadStations()
        
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
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