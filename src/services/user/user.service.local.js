import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}

async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) {
        // Array of realistic profile pictures from Unsplash
        const defaultAvatars = [
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b98d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'
        ]
        // Randomly select one of the default avatars
        userCred.imgUrl = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
    }
    userCred.score = 10000

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        score: user.score, 
        isAdmin: user.isAdmin 
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

// Create default users for demo
export function createDefaultUsers() {
    const defaultUsers = [
        {
            _id: 'user_guest',
            username: 'guest',
            password: 'guest',
            fullname: 'Guest User',
            imgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            score: 1000,
            isAdmin: false
        },
        {
            _id: 'user_admin',
            username: 'admin',
            password: 'admin',
            fullname: 'Admin User',
            imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            score: 10000,
            isAdmin: true
        },
        {
            _id: 'user_demo',
            username: 'demo',
            password: 'demo',
            fullname: 'Demo User',
            imgUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b98d?w=400&h=400&fit=crop&crop=face',
            score: 5000,
            isAdmin: false
        }
    ]
    
    // Save users to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('userDB') || '[]')
    if (existingUsers.length === 0) {
        localStorage.setItem('userDB', JSON.stringify(defaultUsers))
        console.log('✅ Default users created for GitHub Pages')
    }
    
    return defaultUsers
}

// Initialize default users on GitHub Pages
if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    setTimeout(() => {
        createDefaultUsers()
    }, 100)
}