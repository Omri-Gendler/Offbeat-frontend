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
    if (existingIds && existingIds.size) {
      console.log(`🎵 SONG PICKER: Using provided existingIds: ${existingIds.size} songs`)
      return existingIds
    }
    const ids = new Set()
    for (const s of station?.songs || []) ids.add(s.id)
    console.log(`🎵 SONG PICKER: Built existingIds from station: ${ids.size} songs from station "${station?.name}"`)
    console.log(`🎵 SONG PICKER: Existing song IDs:`, Array.from(ids))
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
        console.log('🎵 SONG PICKER: Raw results - songs:', results?.songs?.length || 0, 'artists:', results?.artists?.length || 0)
        console.log('🎵 SONG PICKER: First 3 song IDs from search:', (results?.songs || []).slice(0, 3).map(s => s.id))
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
      console.log(`🎵 SONG PICKER: Adding song "${song.title}" to station ${stationId}`)
      const updatedStation = await addSongToStation(stationId, song)
      console.log(`✅ SONG PICKER: Song added successfully, station now has ${updatedStation?.songs?.length || 0} songs`)
      
      // Force a small delay to ensure state updates have propagated
      setTimeout(() => {
        console.log(`🔄 SONG PICKER: Refreshing search results to hide added song`)
        // The song should now be filtered out from results since it exists in the station
      }, 100)
      
    } catch (err) {
      console.error('❌ SONG PICKER: addSongToStation failed', err)
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
          songs={youtubeResults?.songs || []}
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