import DeleteIcon from '@mui/icons-material/Delete'
import { PlayPauseButton } from '../cmps/PlayPauseButton.jsx'
import { IconMoreHorizontal24, IconAddCircle24, IconCheckCircle24 } from '../cmps/Icon.jsx'
import { useNavigate } from 'react-router'
import { useEffect, useState , } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { removeStation } from '../store/actions/station.actions.js'
import { libraryService } from '../services/library/library.service.local.js'

export function StationActions({ station }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // local UI state, derived from storage
  const [added, setAdded] = useState(false)

  // initialize + keep in sync when station changes
  useEffect(() => {
    if (station?._id) {
      setAdded(libraryService.has(station._id))
    } else {
      setAdded(false)
    }
  }, [station?._id])

  async function handleDelete(ev) {
    ev.stopPropagation()
    try {
      await dispatch(removeStation(station._id))
      navigate('/stations')
    } catch (err) {
      console.error('Failed to remove station:', err)
    }
  }

  function handleClickAdd() {
    if (!station?._id) return
    // toggle in storage and reflect the new state in UI
    const { added: nowAdded } = libraryService.toggle(station._id)
    setAdded(nowAdded)
  }
function DebugLibraryLogger() {
  useEffect(() => {
    (async () => {
      console.log('Library IDs:', ids);
      console.log('Library Stations:', libraryStations);
    })();
  }, []);

  return null;
}


  return (
    <div className="station-actions-space content-spacing">
      <div className="station-actions flex">
        <PlayPauseButton
          defaultPressed={false}
          onPlay={() => console.log('started')}
          onPause={() => console.log('stopped')}
        />

        <button
          type="button"
          className="tertiary-btn"
          onClick={handleClickAdd}
          aria-pressed={added}
          aria-label={added ? 'Added to your library' : 'Add to your library'}
          data-added={added ? 'true' : 'false'}
          disabled={!station?._id}
        >
          {added ? <IconCheckCircle24 /> : <IconAddCircle24 />}
        </button>

        <button type="button" className="tertiary-btn" aria-label="More options">
          <IconMoreHorizontal24 className="icon" />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="delete"
          aria-label={`Delete ${station?.name ?? 'station'}`}
          style={{ backgroundColor: 'transparent' }}
          disabled={!station?._id}
        >
          <DeleteIcon className="icon" />
        </button>
      </div>
    </div>
  )
}


// import { useEffect, useState, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { FastAverageColor } from 'fast-average-color'


// import StationCover from '../cmps/StationCover.jsx'
// import { SongsList } from '../cmps/SongsList.jsx'
// import { loadStation, updateStation } from '../store/actions/station.actions'
// import { StationActions } from '../cmps/StationActions.jsx'
// import { CompositeCover } from '../cmps/CompositeCover.jsx'
// import { EditStationModal } from '../cmps/EditStationModal.jsx'
// import { StationSearch} from '../cmps/StationSearch.jsx'
// import { stationService } from '../services/station/station.service.local.js'
// import { libraryService } from '../services/library/library.service.local.js'


// export function StationDetails() {
//   const { stationId } = useParams()
//   const station = useSelector(s => s.stationModule.station)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isLikedSongs, setLikedSongs] = useState(false)
//   const [isInLibrary, setIsInLibrary] = useState(false)
//   const dispatch = useDispatch()


//   useEffect(() => {
//     if (stationId) {
//       loadStation(stationId)
//     }
//   }, [stationId])

//   const [dynamicBg, setDynamicBg] = useState('#121212')

//   useEffect(() => {
//     const fac = new FastAverageColor()
//     const imageUrl = station?.imgUrl
//     if (!imageUrl) {
//       setDynamicBg('#121212')
//       return
//     }

//     fac.getColorAsync(imageUrl, { algorithm: 'dominant', crossOrigin: 'anonymous' })
//       .then(({ hex }) => {
//         setDynamicBg(`linear-gradient(${hex} 0%, #121212 350px)`)
//       })
//       .catch(() => setDynamicBg('#121212'))

//     return () => fac.destroy()
//   }, [station?.imgUrl])

//   const handleCoverChange = useCallback((newUrl) => {
//     if (station) updateStation({ ...station, imgUrl: newUrl })
//   }, [station])


// useEffect(() => {
//   setIsInLibrary(!!station?._id && libraryService.has(station._id))
// }, [station?._id])

// const handleToggleLibrary = async () => {
//   if (!station?._id) return
//   const { added } = libraryService.toggle(station._id)
//   setIsInLibrary(added)
  
//   const handleSaveDetails = async (updatedDetails) => {
//     const stationToUpdate = { ...station, ...updatedDetails }
    
//     try {
//       await stationService.save(stationToUpdate)
//       dispatch(updateStation(stationToUpdate))
      
//       setIsModalOpen(false)
//     } catch (err) {
//       console.error("Failed to save station:", err)
//     }
//   }
  
//   if (!station) {
//     return (
//       <section className="station-details">
//         <div className="content-spacing">Loading station…</div>
//       </section>
//     )
//   }


//   return (
//     <section className="station-details" style={{ background: dynamicBg }}>
//         <div className="station-header flex align-center">         
//            <div className='background-color-details'></div>
//           <div className='background background-position'></div>
//           <div className='station-details-header content-spacing'>
//             <div className='station-cover-container flex'>
//                   <div
//                       className="station-cover-img-wrap"
//                       draggable={false}

//                     >
//                       { isLikedSongs &&
//                       <img aria-hidden="false" draggable="false" loading="eager" src="https://misc.scdn.co/liked-songs/liked-songs-300.jpg" alt="" className="station-cover-img" srcset="https://misc.scdn.co/liked-songs/liked-songs-300.jpg 150w, https://misc.scdn.co/liked-songs/liked-songs-300.jpg 300w" sizes="(min-width: 1280px) 232px, 192px"/>}
//                       { !isLikedSongs &&
//                       <img aria-hidden="false" draggable="false" loading="eager" src={station.imgUrl} alt="" className="station-cover-img" sizes="(min-width: 1280px) 232px, 192px"/>
//                       }

//                     </div>
//                     </div>
//           {/* {canGenerateCover ? (
//             <CompositeCover
//               images={station.songs.slice(0, 2).map(song => song.imgUrl)}
//             />
//           ) : hasCustomCover ? (
//             <StationCover station={station} onChangeUrl={handleCoverChange} />
//           ) : (
//             <StationCover station={{ imgUrl: '/img/unnamed-song.png' }} isEditable={false} /> */}
          
//           {/* <StationCover station={station} onChangeUrl={handleCoverChange} /> */}
        
//           <div className="station-meta">
//             <span className="station-type">Public Playlist</span>
//             <button className="station-title editable" onClick={() => setIsModalOpen(true)}>
//              <span><h1 className="e-91000-text encore-text-headline-large encore-internal-color-text-base" >{station?.name ?? 'my station'}</h1></span>
//             </button>
//             <div className="station-byline">
//               <a className="station-owner" href="">{station?.createdBy?.fullname ?? 'Unknown'}</a>
//               <span className="dot">•</span>
//               <span className="station-stats">{station?.songs?.length ?? 0} songs</span>
//               <span className="dot">•</span>
//               <span className="station-total">{station?.length ?? '1 hr 25 min'}</span>

//             </div>
//           </div>
//           {isModalOpen && (
//             <EditStationModal
//               station={station}
//               onSave={handleSaveDetails}
//               onClose={() => setIsModalOpen(false)}
//             />
//           )}
//         </div>
//         </div>
//         <StationActions station={station} />
        
//         <div className='station-details-body'>
//           <div className='content-spacing'>
       
//         <SongsList station={station} />

//         <StationSearch
//           // value={query}
//           // onChange={setQuery}
//           // onSubmit={handleSubmit}
//           // onClose={handleClose}
//         />
//         </div>
//         </div>
//     </section>
//   )
// }
// }