// SongPicker.jsx
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { StationSearch } from './StationSearch'
import { SongsList } from './SongsList'
import { addSongToStation } from '../store/actions/station.actions'

export function SongPicker({ stationId, existingIds = new Set(), onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // seed 5 from other playlists (excluding current & duplicates)
  const stations = useSelector(s => s.stationModule.stations || [])
  const seedSuggestions = useMemo(() => {
    const pool = []
    for (const st of stations) {
      if (!st || st._id === stationId) continue
      const songs = Array.isArray(st.songs) ? st.songs : []
      for (const song of songs) {
        if (!song?.id || existingIds.has(song.id)) continue
        pool.push(song)
      }
    }
    const byId = new Map()
    for (const s of pool) if (!byId.has(s.id)) byId.set(s.id, s)
    const unique = Array.from(byId.values())
    unique.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))
    return unique.slice(0, 5)
  }, [stations, stationId, existingIds])

  useEffect(() => {
    let cancel = false
    const run = async () => {
      setLoading(true)
      try {
        // replace with real search later; for now use the seed
        const data = seedSuggestions
        if (!cancel) setResults(data)
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    run()
    return () => { cancel = true }
  }, [seedSuggestions])

  const filtered = useMemo(() => {
    if (!query) return results
    const rx = new RegExp(query, 'i')
    return results.filter(s =>
      rx.test(s.title || '') || rx.test(s.artists || '') || rx.test(s.album || '')
    )
  }, [results, query])

  return (
    <div className="picker-backdrop" role="dialog" aria-modal="true">
      <div className="picker-panel">
        <div className="picker-header" />

        <StationSearch
          value={query}
          onChange={setQuery}
          onClose={onClose}
        />

        {loading ? (
          <div className="spinner">Loading…</div>
        ) : (
           <SongsList
            station={{ _id: stationId, songs: filtered }}  // we only need songs array
            songs={filtered}                                // explicit override also fine
            rowVariant="picker"
            showHeader={false}
            existingIds={existingIds}
            onAdd={(song) => addSongToStation(stationId, song)}
            />
        )}
      </div>
    </div>
  )
}
