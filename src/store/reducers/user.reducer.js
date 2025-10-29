import { userService } from '../../services/user'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_COUNT = 'CHANGE_COUNT'
export const SET_USER = 'SET_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const SET_SCORE = 'SET_SCORE'
export const SET_LIKED_SONGS = 'SET_LIKED_SONGS'
export const ADD_LIKED_SONG = 'ADD_LIKED_SONG'
export const REMOVE_LIKED_SONG = 'REMOVE_LIKED_SONG'

const initialState = {
    count: 10,
    user: userService.getLoggedinUser(),
    users: [],
    watchedUser: null,
    likedSongs: []
}

export function userReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case INCREMENT:
            newState = { ...state, count: state.count + 1 }
            break
        case DECREMENT:
            newState = { ...state, count: state.count - 1 }
            break
        case CHANGE_COUNT:
            newState = { ...state, count: state.count + action.diff }
            break
        case SET_USER:
            newState = { ...state, user: action.user }
            break
        case SET_WATCHED_USER:
            newState = { ...state, watchedUser: action.user }
            break
        case REMOVE_USER:
            newState = {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
            break
        case SET_USERS:
            newState = { ...state, users: action.users }
            break
        case SET_SCORE:
            const user = { ...state.user, score: action.score }
            newState = { ...state, user }
            userService.saveLoggedinUser(user)
            break

        case SET_LIKED_SONGS:
            return { ...state, likedSongs: action.likedSongs || [] }

        case ADD_LIKED_SONG:
            if (!state.likedSongs.some(song => song.id === action.song.id)) {
                return { ...state, likedSongs: [...state.likedSongs, action.song] }
            }
            return state

        case REMOVE_LIKED_SONG:
            return { ...state, likedSongs: state.likedSongs.filter(song => song.id !== action.songId) }

        default:
            return newState
    }
    return newState

}
