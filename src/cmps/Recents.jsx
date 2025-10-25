// cmps/Recents.jsx
import { maxLength } from '../services/util.service'

export function Recents({
  stations = [],
  isActive = () => false,            // fn: (station) => boolean
  onOpen = () => {},                 
  onPlay = () => {},                 
  take = 6,                          
  nameMax = 15,                      
}) {
  return (
    <section className="station-list-recents">
      {stations.slice(0, take).map((st) => {
        const active = isActive(st)

        const handleOpen = () => onOpen(st._id)
        const handleKey = (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpen()
        }
        const handlePlay = (e) => {
          e.stopPropagation()
          onPlay(st)
        }

        return (
          <div
            key={st._id}
            className="recent-item-list"
            data-active={active ? 'true' : 'false'}
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={handleKey}
          >
            <img src={st.imgUrl} alt={st.name} />
            <span>{maxLength(st.name, nameMax)}</span>

            <button
              type="button"
              className="play-button"
              onClick={handlePlay}
              aria-pressed={active}
              aria-label={active ? 'Pause' : 'Play'}
              data-playing={active ? 'true' : 'false'}
            >
              {active ? (
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              )}
            </button>
          </div>
        )
      })}
    </section>
  )
}
