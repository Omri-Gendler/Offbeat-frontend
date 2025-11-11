import io from 'socket.io-client'
import { userService } from './user'

const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL?.replace('/api/', '') || 'https://your-backend-name.onrender.com'
    : '//localhost:3030'

export const socketService = createSocketService()

// Don't auto-setup socket for static deployments (GitHub Pages)
if (import.meta.env.VITE_LOCAL !== 'true') {
    socketService.setup()
}

function createSocketService() {
    var socket = null

    const socketService = {
        setup() {
            // Skip socket setup for local/static deployments
            if (import.meta.env.VITE_LOCAL === 'true') {
                console.log('Socket service disabled for static deployment')
                return
            }
            if (socket) return
            socket = io(SOCKET_URL, { transports: ['websocket'] })
            console.log('Socket Connection initiated with:', SOCKET_URL)

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
            if (!socket) this.setup()
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            if (!socket) this.setup()
            console.log(`Emitting event: ${eventName}`, data)
            socket.emit(eventName, data)
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