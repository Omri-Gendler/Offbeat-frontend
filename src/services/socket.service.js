import io from 'socket.io-client'
import { userService } from './user'

const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL?.replace('/api/', '') || 'https://your-backend-name.onrender.com'
    : '//localhost:3030'

// Check if we're on GitHub Pages or static deployment
const isStaticDeployment = 
    (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) ||
    import.meta.env.VITE_DISABLE_BACKEND === 'true' ||
    (!import.meta.env.VITE_BACKEND_URL && import.meta.env.PROD)

export const socketService = createSocketService()

// Only setup socket if not on static deployment
if (!isStaticDeployment && import.meta.env.VITE_LOCAL !== 'true') {
    setTimeout(() => {
        socketService.setup()
    }, 100)
}

function createSocketService() {
    var socket = null

    const socketService = {
        setup() {
            // Skip socket setup for static deployments
            if (isStaticDeployment) {
                console.log('🚀 Socket service disabled for static deployment (GitHub Pages)')
                return
            }
            if (socket) return
            try {
                socket = io(SOCKET_URL, { 
                    transports: ['websocket'],
                    timeout: 5000,
                    forceNew: true
                })
                console.log('Socket Connection initiated with:', SOCKET_URL)
            } catch (error) {
                console.warn('Failed to initialize socket:', error)
                return
            }

            // const user = userService.getLoggedinUser()
            // if (user) this.login(user._id)

            socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err)
            })

            socket.on('connect', () => {
                console.log('Successfully connected to socket server')
                console.log('Socket ID:', socket.id)
            })

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason)
            })

            // Add debugging for all socket events
            socket.onAny((eventName, ...args) => {
                console.log(`🔍 SOCKET EVENT RECEIVED: ${eventName}`, args)
            })
        },
        on(eventName, cb) {
            if (isStaticDeployment) return
            if (!socket) this.setup()
            if (socket) socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            if (isStaticDeployment) {
                console.log(`🚫 Socket disabled - would emit: ${eventName}`, data)
                return
            }
            if (!socket) this.setup()
            if (socket && socket.connected) {
                console.log(`Emitting event: ${eventName}`, data)
                socket.emit(eventName, data)
            } else {
                console.warn(`Socket not connected - cannot emit: ${eventName}`)
            }
        },
        login(userId) {
            this.emit('set-user-socket', userId)
        },
        logout() {
            this.emit('unset-user-socket')
        },
        joinStation(stationId) {
            if (!stationId) return
            console.log(`Joining station room: ${stationId}`)
            this.emit('station-join', stationId)
        },
        leaveStation(stationId) {
            if (!stationId) return
            console.log(`Leaving station room: ${stationId}`)
            this.emit('station-leave', stationId)
        },
        sendPlay(stationId, index, song, currentTime = 0) {
            console.log(`Sending play event for station ${stationId}, index ${index}, currentTime=${currentTime}`)
            this.emit('station-send-play', { 
                stationId, 
                index, 
                song,
                currentTime, // Add current playback position
                timestamp: Date.now() // Add timestamp for sync
            })
        },
        sendPause(stationId) {
            console.log(`Sending pause event for station ${stationId}`)
            this.emit('station-send-pause', { 
                stationId,
                timestamp: Date.now() // Add timestamp for sync
            })
        },
        isConnected() {
            return socket && socket.connected
        },
        getSocketId() {
            return socket ? socket.id : null
        },
        testConnection() {
            if (!socket) {
                console.log('❌ Socket not initialized')
                return
            }
            console.log('🔍 Socket status:', {
                connected: socket.connected,
                id: socket.id,
                transport: socket.io.engine.transport.name
            })
        },
        terminate() {
            socket = null
        }
    }
    return socketService
}

if (process.env.NODE_ENV === 'development') {
    window.socketService = socketService
}