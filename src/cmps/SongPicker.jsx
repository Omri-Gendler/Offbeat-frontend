// SongPicker.jsx
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { StationSearch } from './StationSearch'
import { SongsList } from './SongsList'
import { addSongToStation } from '../store/actions/station.actions'

export function SongPicker({ stationId, existingIds = new Set(), onClose }) {
  const [query, setQuery] = useState('')

  // Get station list & current station
  const stations = useSelector(s => s.stationModule.stations || [])
  const station =
    useSelector(s => s.stationModule.station) ||
    stations.find(st => st?._id === stationId)

  // Build candidate pool (seed from other playlists, exclude current & duplicates)
  const searchCandidates = useMemo(() => {
    const pool = []
    for (const st of stations) {
      if (!st || st._id === stationId) continue
      const songs = Array.isArray(st.songs) ? st.songs : []
      for (const song of songs) {
        if (!song?.id) continue
        pool.push(song)
      }
    }
    // de-dup by id
    const byId = new Map()
    for (const s of pool) if (!byId.has(s.id)) byId.set(s.id, s)
    return Array.from(byId.values())
  }, [stations, stationId])

  // Existing IDs (prefer prop; otherwise derive from station)
  const existingIdsSet = useMemo(() => {
    if (existingIds && existingIds.size) return existingIds
    const ids = new Set()
    for (const s of station?.songs || []) ids.add(s.id)
    return ids
  }, [existingIds, station])

  // Picker "Add" handler → add to the *current* station
  const handleAddToCurrent = async (song) => {
    if (!song?.id || !stationId) return
    try {
      await addSongToStation(stationId, song)
    } catch (err) {
      console.error('addSongToStation failed', err)
    }
  }

  return (
    <div className="picker-backdrop" role="dialog" aria-modal="true">
      <div className="picker-panel">
        <div className="picker-header" />

        <StationSearch
          value={query}
          onChange={setQuery}
          onClose={onClose}
        />

        <SongsList
          station={station}
          rowVariant="picker"
          songs={searchCandidates}                
          searchQuery={query}                      
          maxResults={5}                           
          existingIds={existingIdsSet}            
          onAdd={handleAddToCurrent}              
          showHeader={true}
        />
      </div>
    </div>
  )
}
