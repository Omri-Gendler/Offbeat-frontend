import { SongPreview } from './SongPreview.jsx'

import {DurationIcon} from './Icon.jsx'

export function SongsList({ station }) {
  if (!station?.songs?.length) {
    return <p className="empty-msg">No songs in this station yet</p>
  }

  return (
    <section className="songs-list-content-spacing">
      <div className="songs-list-container">
        <div
          role="grid"
          className="songs-list-grid"
          tabIndex={0}
          data-testid="songs-list"
        >
          <div className="songs-list-header-spaceing" role="presentation">
            <div role="presentation">
              <div className="songs-list-header" role="row" aria-rowindex={1}>
                {/* # */}
                <div
                  className="index flex"
                  role="columnheader"
                  aria-colindex={1}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div className='index-icon' data-testid="column-header-context-menu">#</div>
                </div>

                {/* Title */}
                <div
                  className="title-container  flex"
                  role="columnheader"
                  aria-colindex={2}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span className="header-item standalone-ellipsis-one-line">
                        Title
                      </span>
                    </div>
                  </div>
                  <div className="title-spacer header-item-spacer"></div>
                </div>

                {/* Album */}
                <div
                  className="title-container flex"
                  role="columnheader"
                  aria-colindex={3}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span
                        className="header-item standalone-ellipsis-one-line"
                        data-encore-id="text"
                      >
                        Album
                      </span>
                    </div>
                  </div>
                  <div className="album-spacer header-item-spacer"></div>
                </div>

                {/* Date added */}
                <div
                  className="title-container date-added-container flex"
                  role="columnheader"
                  aria-colindex={4}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu">
                    <div className="column-header-item flex">
                      <span
                        className="header-item standalone-ellipsis-one-line"
                        data-encore-id="text"
                      >
                        Date added
                      </span>
                    </div>
                  </div>
                  <div className="date-added-spacer header-item-spacer"></div>
                </div>

                {/* Duration (icon) */}
                <div
                  className="duration-container title-container flex"
                  role="columnheader"
                  aria-colindex={5}
                  aria-sort="none"
                  tabIndex={-1}
                >
                  <div data-testid="column-header-context-menu ">
                    <div className="column-header-item duration flex" aria-label="Duration">
                      <DurationIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* closes .songs-list-grid */}
      </div>
      {/* closes .songs-list-container */}
    </section>
  )

}

{/* <ul className="songs-list">
  {station.songs.map((song, idx) => (
    <li key={song.id} className="song-row">
      <div className="song-index">{idx + 1}</div>
      <SongPreview song={song} />
    </li>
  ))}
</ul> */}
