import { store } from '../store'
import { setPlay, setIndex, playContext } from './player.actions'
import { socketService } from '../../services/socket.service'

// Helper function to seek to a specific position
function seekToPosition(time, isYouTube = false) {
    console.log(`🎯 Seeking to position: ${time}s (isYouTube: ${isYouTube})`)
    
    // This is a bit hacky, but we need access to the player refs
    // In a real app, you might want to pass these as parameters or use a different approach
    const musicPlayer = document.querySelector('.music-player')
    if (!musicPlayer) return
    
    if (isYouTube) {
        // For YouTube, we'll dispatch a custom event that the MusicPlayer can listen to
        window.dispatchEvent(new CustomEvent('seekYouTube', { detail: { time } }))
    } else {
        // For audio, we'll dispatch a custom event as well
        window.dispatchEvent(new CustomEvent('seekAudio', { detail: { time } }))
    }
}

// Socket event handlers
export function setupSocketListeners() {
    console.log('🔧 SETUP: Setting up socket listeners for station events')
    
    // Listen for remote play events
    socketService.on('station-receive-play', handleReceivePlay)
    
    // Listen for remote pause events
    socketService.on('station-receive-pause', handleReceivePause)
    
    console.log('🔧 SETUP: Socket listeners registered')
}

export function removeSocketListeners() {
    socketService.off('station-receive-play', handleReceivePlay)
    socketService.off('station-receive-pause', handleReceivePause)
}

export function handleReceivePlay({ stationId, index, song, timestamp, currentTime = 0 }) {
    console.log(`🔥 SOCKET RECEIVED: station-receive-play for station ${stationId}, index ${index}`, song)
    console.log(`🔥 Song details: title=${song?.title}, isYouTube=${song?.isYouTube}, id=${song?.id}, currentTime=${currentTime}s`)
    
    // Calculate network delay for better sync
    const networkDelay = timestamp ? Date.now() - timestamp : 0
    console.log(`🕐 Network delay: ${networkDelay}ms, sync time: ${currentTime}s`)
    
    const state = store.getState()
    const { playerModule } = state
    
    // Check if we should handle this event based on station context
    const currentStation = state.stationModule.station
    const isInStationContext = (
        (playerModule.contextType === 'station' && playerModule.contextId === stationId) ||
        // Also handle if we're currently viewing/playing from this station
        (currentStation && currentStation._id === stationId)
    )
    
    console.log(`🔥 Station context check: currentStation=${currentStation?._id}, playerContext=${playerModule.contextType}-${playerModule.contextId}, match=${isInStationContext}`)
    
    if (isInStationContext) {
        // If we have a specific song, find it in the current queue and play it
        if (song && song.id) {
            const { queue = [], playOrder = [] } = playerModule
            
            // Find the song in the current queue
            const realIndex = queue.findIndex(s => s.id === song.id || s._id === song.id)
            
            if (realIndex !== -1) {
                // Find the index in playOrder that corresponds to this real index
                const playOrderIndex = playOrder.findIndex(idx => idx === realIndex)
                
                if (playOrderIndex !== -1) {
                    console.log(`Found song at playOrder index ${playOrderIndex} (real index ${realIndex})`)
                    setIndex(playOrderIndex)
                    
                    // Calculate sync time accounting for network delay
                    const syncTime = Math.max(0, currentTime + (networkDelay / 1000))
                    console.log(`🎯 Calculated sync time: ${syncTime}s (original: ${currentTime}s + network delay: ${networkDelay}ms)`)
                    
                    // Reduce delay for better sync - YouTube videos load faster
                    const delay = song?.isYouTube ? 
                        Math.max(10, Math.min(30, networkDelay / 2)) : // 10-30ms for YouTube
                        Math.max(20, Math.min(50, networkDelay / 2))   // 20-50ms for audio
                    console.log(`⏱️ Setting play with ${delay}ms delay (isYouTube: ${song?.isYouTube})`)
                    
                    setTimeout(() => {
                        setPlay(true)
                        // Seek to synchronized position after a short delay to ensure player is ready
                        if (syncTime > 0.1) { // Only seek if more than 100ms difference
                            setTimeout(() => {
                                seekToPosition(syncTime, song?.isYouTube)
                            }, song?.isYouTube ? 500 : 200) // YouTube needs more time to load
                        }
                    }, delay)
                } else {
                    // Song exists in queue but not in playOrder, set index directly
                    console.log(`Song found at real index ${realIndex}, setting directly`)
                    setIndex(realIndex)
                    
                    // Calculate sync time accounting for network delay
                    const syncTime = Math.max(0, currentTime + (networkDelay / 1000))
                    console.log(`🎯 Calculated sync time: ${syncTime}s (original: ${currentTime}s + network delay: ${networkDelay}ms)`)
                    
                    // Reduce delay for better sync - YouTube videos load faster
                    const delay = song?.isYouTube ? 
                        Math.max(10, Math.min(30, networkDelay / 2)) : // 10-30ms for YouTube
                        Math.max(20, Math.min(50, networkDelay / 2))   // 20-50ms for audio
                    console.log(`⏱️ Setting play with ${delay}ms delay (isYouTube: ${song?.isYouTube})`)
                    
                    setTimeout(() => {
                        setPlay(true)
                        // Seek to synchronized position after a short delay to ensure player is ready
                        if (syncTime > 0.1) { // Only seek if more than 100ms difference
                            setTimeout(() => {
                                seekToPosition(syncTime, song?.isYouTube)
                            }, song?.isYouTube ? 500 : 200) // YouTube needs more time to load
                        }
                    }, delay)
                }
            } else {
                // Song not found in current queue, need to load the station context
                console.log(`Song not found in current queue, loading full station context`)
                const currentStation = state.stationModule.station
                if (currentStation && currentStation._id === stationId) {
                    // We have the station data, create context with all songs
                    const allSongs = currentStation.songs || []
                    const targetSongIndex = allSongs.findIndex(s => s.id === song.id || s._id === song.id)
                    
                    if (targetSongIndex !== -1) {
                        console.log(`Creating new context with station songs, target song at index ${targetSongIndex}`)
                        playContext({
                            contextId: stationId,
                            contextType: 'station',
                            tracks: allSongs,
                            trackId: song.id,
                            index: targetSongIndex,
                            autoplay: true
                        })
                    } else {
                        // Fallback: play just this song
                        console.log(`Song not found in station, playing as single track`)
                        playContext({
                            contextId: stationId,
                            contextType: 'station',
                            tracks: [song],
                            trackId: song.id,
                            index: 0,
                            autoplay: true
                        })
                    }
                } else {
                    // No station context, play as single song
                    console.log(`No station context available, playing as single track`)
                    playContext({
                        contextId: stationId,
                        contextType: 'station',
                        tracks: [song],
                        trackId: song.id,
                        index: 0,
                        autoplay: true
                    })
                }
            }
        } else if (typeof index === 'number' && index >= 0) {
            // Play by playOrder index
            console.log(`Playing by index: ${index}`)
            setIndex(index)
            
            // Calculate sync time accounting for network delay
            const syncTime = Math.max(0, currentTime + (networkDelay / 1000))
            console.log(`🎯 Calculated sync time: ${syncTime}s (original: ${currentTime}s + network delay: ${networkDelay}ms)`)
            
            // Reduce delay for better sync - YouTube videos load faster
            const delay = song?.isYouTube ? 
                Math.max(10, Math.min(30, networkDelay / 2)) : // 10-30ms for YouTube
                Math.max(20, Math.min(50, networkDelay / 2))   // 20-50ms for audio
            console.log(`⏱️ Setting play with ${delay}ms delay (isYouTube: ${song?.isYouTube})`)
            
            setTimeout(() => {
                setPlay(true)
                // Seek to synchronized position after a short delay to ensure player is ready
                if (syncTime > 0.1) { // Only seek if more than 100ms difference
                    setTimeout(() => {
                        seekToPosition(syncTime, song?.isYouTube)
                    }, song?.isYouTube ? 500 : 200) // YouTube needs more time to load
                }
            }, delay)
        } else {
            // Just resume playing current track
            console.log(`Resuming current track`)
            setPlay(true)
        }
    } else {
        console.log(`Ignoring play event - not in station context or different station`)
        console.log(`Current context: ${playerModule.contextType} - ${playerModule.contextId}`)
    }
}

export function handleReceivePause(data) {
    // Handle both old format (stationId) and new format ({stationId, timestamp})
    const stationId = typeof data === 'string' ? data : data.stationId
    const timestamp = typeof data === 'object' ? data.timestamp : null
    
    console.log(`🔥 SOCKET RECEIVED: station-receive-pause for station ${stationId}`)
    
    // Calculate network delay for better sync
    const networkDelay = timestamp ? Date.now() - timestamp : 0
    console.log(`🕐 Network delay: ${networkDelay}ms`)
    
    const state = store.getState()
    const { playerModule } = state
    
    // Check if we should handle this event based on station context
    const currentStation = state.stationModule.station
    const isInStationContext = (
        (playerModule.contextType === 'station' && playerModule.contextId === stationId) ||
        // Also handle if we're currently viewing/playing from this station
        (currentStation && currentStation._id === stationId)
    )
    
    console.log(`🔥 Station context check for pause: currentStation=${currentStation?._id}, playerContext=${playerModule.contextType}-${playerModule.contextId}, match=${isInStationContext}`)
    
    if (isInStationContext) {
        console.log(`Pausing playback for station ${stationId}`)
        // Pause immediately for better sync
        setPlay(false)
    } else {
        console.log(`Ignoring pause event - not in station context or different station`)
        console.log(`Current context: ${playerModule.contextType} - ${playerModule.contextId}`)
    }
}

// Station room management
export function joinStationRoom(stationId) {
    if (!stationId) return
    console.log(`🏠 JOINING STATION ROOM: ${stationId}`)
    socketService.joinStation(stationId)
}

export function leaveStationRoom(stationId) {
    if (!stationId) return
    console.log(`🚪 LEAVING STATION ROOM: ${stationId}`)
    socketService.leaveStation(stationId)
}

// Send play/pause events to other users in the station
export function broadcastPlay(stationId, index, song, currentTime = 0) {
    if (!stationId) return
    console.log(`🚀 BROADCASTING PLAY: Station ${stationId}, Index ${index}, Time ${currentTime}s`, song?.title || song?.id)
    socketService.sendPlay(stationId, index, song, currentTime)
}

export function broadcastPause(stationId) {
    if (!stationId) return
    console.log(`🚀 BROADCASTING PAUSE: Station ${stationId}`)
    socketService.sendPause(stationId)
}