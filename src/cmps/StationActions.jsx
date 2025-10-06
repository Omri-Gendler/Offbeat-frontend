import {IconPlay24, IconDownloadCircle24, IconMoreHorizontal24} from  '../cmps/Icon.jsx'

export function StationActions({station}) {
  return (
    <div className="station-actions-space">
        <div className="station-actions flex ">
            <button className="station-actions-play-btn" aria-label={`Play ${station.name}`}>
              <span><IconPlay24 className="play" /></span>
            </button>

            <button className="tertiary-btn" aria-label="Download">
              <IconDownloadCircle24 className="icon" />
            </button>

            <button className="tertiary-btn" aria-label="More options">
              <IconMoreHorizontal24 className="icon" />
            </button>
        </div>
    </div>
  )
}