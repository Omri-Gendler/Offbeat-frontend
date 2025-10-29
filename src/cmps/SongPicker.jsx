import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { SongsList } from './SongsList.jsx'
import { StationSearch } from './StationSearch.jsx'
import { youtubeService } from '../services/youtube.service.js'
import { addSongToStation } from '../store/actions/station.actions.js'
import { useDebounce } from '../hooks/useDebounce.js'

export function SongPicker({ stationId, existingIds = new Set(), onClose }) {
  const [query, setQuery] = useState('')
  const [youtubeResults, setYoutubeResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchTerm = query.trim()

  const debouncedQuery = useDebounce(query, 500)

  const stations = useSelector(s => s.stationModule.stations || [])
  const station =
    useSelector(s => s.stationModule.station) ||
    stations.find(st => st?._id === stationId)

  const existingIdsSet = useMemo(() => {
    if (existingIds && existingIds.size) return existingIds
    const ids = new Set()
    for (const s of station?.songs || []) ids.add(s.id)
    return ids
  }, [existingIds, station])

  useEffect(() => {
    if (!debouncedQuery) {
      setYoutubeResults([])
      return
    }

    async function searchSongs() {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Searching for:', debouncedQuery)
        const results = await youtubeService.searchSongs(debouncedQuery)
        console.log('Search results:', results)
        setYoutubeResults(results)
      } catch (err) {
        console.error('Search failed:', err)
        setError('Failed to search songs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    searchSongs()
  }, [debouncedQuery])


  const handleAddToCurrent = async (song) => {
    if (!song?.id || !stationId) return
    try {
      await addSongToStation(stationId, song)
    } catch (err) {
      console.error('addSongToStation failed', err)
    }
  }

  const maxResults = 5

  return (
    <div className="picker-backdrop" role="dialog" aria-modal="true">
      <div className="picker-panel">
        <div className="picker-header" />

        <StationSearch
          value={query}
          onChange={setQuery}
          onClose={onClose}
        />
        

      </div>
        <SongsList
          station={station}
          rowVariant="picker"
          songs={youtubeResults}
          searchQuery={query}
          maxResults={maxResults}
          existingIds={existingIdsSet}
          onAdd={handleAddToCurrent}
          showHeader={true}
          isExternalResults={true}
        />
    </div>
  )
}