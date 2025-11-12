const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '', 
        password: '', 
        fullname: '',
        isAdmin: false,
        score: 100,
    }
}

function getRandomAvatar() {
    const defaultAvatars = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b98d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1539571696358-5a6c5bf93b13?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face'
    ]
    return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
}

// Force local service for GitHub Pages or when backend is disabled
const isStaticDeployment = 
    (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) ||
    import.meta.env.VITE_DISABLE_BACKEND === 'true' ||
    import.meta.env.VITE_LOCAL === 'true'

const service = isStaticDeployment ? local : remote
export const userService = { ...service, getEmptyUser, getRandomAvatar }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if(DEV) window.userService = userService