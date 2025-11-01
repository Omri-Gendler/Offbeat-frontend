import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { SongsList } from './SongsList.jsx'
import { StationSearch } from './StationSearch.jsx'
import { youtubeService } from '../services/youtube.service.js'
import { addSongToStation } from '../store/actions/station.actions.js'
import { useDebounce } from '../hooks/useDebounce.js'

export function SongPicker({ stationId, existingIds = new Set(), onClose }) {
  const [query, setQuery] = useState('')
  const [youtubeResults, setYoutubeResults] = useState({ songs: [], artists: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query, 500)

  const stations = useSelector(s => s.stationModule.stations || [])
  const station =
    useSelector(s => s.stationModule.station) ||
    stations.find(st => st?._id === stationId)

  const existingIdsSet = useMemo(() => {
    if (existingIds && existingIds.size) {
      console.log(`🎵 SONG PICKER: Using provided existingIds: ${existingIds.size} songs`)
      return existingIds
    }
    const ids = new Set()
    for (const s of station?.songs || []) ids.add(s.id)
    console.log(`🎵 SONG PICKER: Built existingIds from station: ${ids.size} songs from station "${station?.name}"`)
    console.log('🎵 SONG PICKER: Existing song IDs:', Array.from(ids))
    return ids
  }, [existingIds, station])

  useEffect(() => {
    let cancelled = false

    if (!debouncedQuery) {
      setYoutubeResults({ songs: [], artists: [] })
      setError(null)
      return
    }

    ;(async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Searching for:', debouncedQuery)
        const results = await youtubeService.searchSongs(debouncedQuery)
        if (cancelled) return
        console.log('Search results:', results)
        console.log('🎵 SONG PICKER: Raw results - songs:', results?.songs?.length || 0, 'artists:', results?.artists?.length || 0)
        console.log('🎵 SONG PICKER: First 3 song IDs from search:', (results?.songs || []).slice(0, 3).map(s => s.id))
        setYoutubeResults({
          songs: results?.songs || [],
          artists: results?.artists || []
        })
      } catch (err) {
        if (cancelled) return
        console.error('Search failed:', err)
        setError('Failed to search songs. Please try again.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [debouncedQuery])

  const handleAddToCurrent = async (song) => {
    if (!song?.id || !stationId) return
    try {
      console.log(`🎵 SONG PICKER: Adding "${song.title}" to station ${stationId}`)
      const updatedStation = await addSongToStation(stationId, song)
      console.log(`✅ SONG PICKER: Song added, station now has ${updatedStation?.songs?.length || 0} songs`)
      // No manual refresh needed—SongsList hides by existingIds (which updates via store)
    } catch (err) {
      console.error('❌ SONG PICKER: addSongToStation failed', err)
      setError('Could not add song. Please try again.')
    }
  }

  const maxResults = 5

  return (
    <div
      className="picker-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="song-picker-title"
      aria-busy={isLoading}
    >
      <div className="picker-panel">
        <div className="picker-header">
          <StationSearch
            value={query}
            onChange={setQuery}
            onClose={onClose}
          />
        </div>

        {error && (
          <div className="picker-error" role="alert">
            {error}
          </div>
        )}

        <SongsList
          station={station}
          rowVariant="picker"
          songs={youtubeResults.songs}
          searchQuery={query}
          maxResults={maxResults}
          existingIds={existingIdsSet}
          onAdd={handleAddToCurrent}
          showHeader={true}
          isExternalResults={true}
        />

        {isLoading && <div className="picker-loading">Searching…</div>}
      </div>
    </div>
  )
}
