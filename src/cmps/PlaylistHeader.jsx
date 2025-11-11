import { useMemo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setBgImage } from '../store/actions/app.actions'
import { EditStationModal } from './EditStationModal'
import { getAssetUrl, ASSET_PATHS } from '../services/asset.service'

export function PlaylistHeader({ station, onSaveStation }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const coverHex = useSelector(s => s.appModule?.coverHex) || '#1f1f1f'
  const loggedinUser = useSelector(s => s.userModule?.user)
  
  // Check if this playlist was created by the logged-in user
  // Check both createdBy and owner fields for backwards compatibility
  const isUserPlaylist = loggedinUser && (
    station?.createdBy?._id === loggedinUser._id ||
    station?.owner?._id === loggedinUser._id ||
    station?.createdBy?.fullname === 'You'
  )

  const coverUrl =
    station?.imgUrl ||
    station?.coverUrl ||
    station?.songs?.[0]?.imgUrl ||
    null
  useEffect(() => {
    setBgImage(coverUrl || null)
    return () => setBgImage(null)   // optional reset on unmount
  }, [coverUrl])

  const handleSaveDetails = (next) => {
    onSaveStation?.(next)
    setIsModalOpen(false)
  }

  return (
    <div >
      <div className="station-header flex align-center">
        <div className="station-details-header content-spacing">
          <div className="station-cover-container flex">
            <div className="station-cover-img-wrap" draggable={false}>
              <img
                aria-hidden="false"
                draggable="false"
                loading="eager"
                src={coverUrl || (isUserPlaylist ? getAssetUrl(ASSET_PATHS.UNNAMED_SONG) : getAssetUrl(ASSET_PATHS.APP_LOGO))}
                alt={station?.name || 'Playlist cover'}
                className="station-cover-img"
                sizes="(min-width: 1280px) 232px, 192px"
              />
            </div>
          </div>

          <div className="station-meta">
            <span className="station-type">Public Playlist</span>
            <button className="station-title editable" onClick={() => setIsModalOpen(true)}>
              <h1 className="e-91000-text encore-text-headline-large encore-internal-color-text-base">
                {station?.name ?? 'My Station'}
              </h1>
            </button>
            <div className="station-byline">
              <img 
                src={isUserPlaylist ? (loggedinUser?.imgUrl || '/img/user-avatar.png') : '/img/AppLogo.png'} 
                alt="user avatar" 
                style={{ width: 25, height: 25, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <a className="station-owner">
                {isUserPlaylist 
                  ? loggedinUser?.fullname 
                  : (station?.createdBy?.fullname || station?.owner?.fullname || 'Unknown')
                }
              </a>
              <span className="dot">•</span>
              <span className="station-stats">{station?.songs?.length ?? 0} songs</span>
            </div>
          </div>

        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <EditStationModal
            station={station}
            onSave={handleSaveDetails}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>

  )
}
