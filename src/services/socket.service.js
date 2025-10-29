import io from 'socket.io-client'
import { userService } from './user'

const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '//localhost:3030'

export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
    var socket = null

    const socketService = {
        setup() {
            if (socket) return
            socket = io(SOCKET_URL, { transports: ['websocket'] })
            console.log('Socket Connection initiated with:', SOCKET_URL)

            const user = userService.getLoggedinUser()
            if (user) this.login(user._id)

            socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err)
            })

            socket.on('connect', () => {
                console.log('Successfully connected to socket server')
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
        terminate() {
            socket = null
        }
    }
    return socketService
}

if (process.env.NODE_ENV === 'development') {
    window.socketService = socketService
}