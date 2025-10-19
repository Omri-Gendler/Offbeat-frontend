import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { loadStations, addStation } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";
import { LIKED_ID } from "../store/reducers/station.reducer";

import { playContext, togglePlay, setPlay } from "../store/actions/player.actions";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export function LeftSideBar() {
  const allStations = useSelector(storeState => storeState.stationModule.stations) || []

  const { queue = [], isPlaying = false, contextId = null, contextType = null } =
    useSelector(s => s.playerModule || {});

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState({ txt: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => { loadStations(); }, []);

  const handleCreateStation = async () => {
    try {
      const playlistNumbers = allStations
        .map(s => s.name.match(/^My Playlist #(\d+)$/))
        .filter(Boolean)
        .map(match => parseInt(match[1], 10));
      const nextNumber = playlistNumbers.length > 0 ? Math.max(...playlistNumbers) + 1 : 1;

      const newStation = {
        name: `My Playlist #${nextNumber}`,
        description: '',
        imgUrl: '/img/unnamed-song.png',
        songs: [],
        createdBy: { fullname: 'You' }
      }

      console.log('newStation', newStation)

      const savedStation = await addStation(newStation);
      navigate(`/station/${savedStation._id}`);
    } catch (err) {
      console.error('Failed to create station:', err);
    }
  };

  function handleChange(ev) {
    const { name, value } = ev.target;
    setFilterBy({ ...filterBy, [name]: value });
  }

  const stationsToDisplay = useMemo(() => {
    let stationsToShow = allStations.filter(station =>
      station._id === LIKED_ID || station.createdBy?.fullname === 'You'
    )

    if (sortBy === 'albums' || sortBy === 'artists' || sortBy === 'station') {
      stationsToShow = stationsToShow.filter(station => station.type === sortBy)
    }
    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      stationsToShow = stationsToShow.filter(station => regex.test(station.name))
    }
    if (sortBy !== 'recent') {
      stationsToShow.sort((a, b) => a.name.localeCompare(b.name))
    }
    return stationsToShow
  }, [allStations, filterBy, sortBy])

  function searchBar() {
    const inputRef = useRef(null);
    useEffect(() => { if (isSearchOpen) inputRef.current?.focus(); }, [isSearchOpen]);
    return (
      <div className={`search-container-left-side-bar ${isSearchOpen ? 'expanded' : ''}`}>
        <SearchIcon className="search-icon" onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', height: '24px' }} />
        {isSearchOpen ? (
          <input
            className="search-input"
            ref={inputRef}
            type="text"
            name="txt"
            value={filterBy.txt}
            onChange={handleChange}
            placeholder="Search in Your Library"
            onBlur={() => setIsSearchOpen(false)}
          />
        ) : (
          <span className="search-placeholder" onClick={() => setIsSearchOpen(true)}></span>
        )}
      </div>
    );
  }

  function leftHeader() {
    return (
      <div className="left-header">
        <h3>Your Library</h3>
        <button className="create-station-btn" onClick={handleCreateStation}>
          <AddIcon />
        </button>
      </div>
    );
  }

  // helper: compare track arrays by id
  const idsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const aid = a[i]?.id ?? a[i];
      const bid = b[i]?.id ?? b[i];
      if (aid !== bid) return false;
    }
    return true;
  };

  return (
    <section className="left-side-bar">
      <aside className="station-list-container">
        <div className="library-filters">
          {leftHeader()}

          <section className="search-and-recent">
            {searchBar()}
            <div className="recent-btn">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="view-toggle-btn"
                style={{ backgroundColor: 'transparent' }}
              >
                {viewMode === 'grid'
                  ? <FormatListBulletedIcon style={{ fontSize: '18px', color: 'var(--clr4)' }} />
                  : <GridViewIcon style={{ fontSize: '16px', color: 'var(--clr4)' }} />
                }
              </button>
            </div>
          </section>
        </div>

        <div className={`library-list ${viewMode}`}>
          {stationsToDisplay.map(station => {
            const stationSongs = Array.isArray(station?.songs) ? station.songs : [];

            const isThisStationContext =
              !!station?._id &&
              contextId === station._id &&
              contextType === 'station' &&
              idsEqual(queue, stationSongs);

            // show as active only while actually playing
            const isActive = isThisStationContext && isPlaying;

            const onPlayClick = (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!station?._id || !stationSongs.length) return;

              if (isThisStationContext) {
                // same context → toggle based on current state
                if (!isPlaying) togglePlay(); // resume
                else setPlay(false);          // pause
              } else {
                // new context → start at first track
                playContext({
                  contextId: station._id,
                  contextType: 'station',
                  tracks: stationSongs,
                  index: 0,
                  autoplay: true,
                });
              }
            };

            return (
              <div
                key={station._id}
                className="library-item"
                data-active={isActive ? 'true' : 'false'}
                onClick={() => navigate(`/station/${station._id}`)}
              >
                <img
                  src={station.imgUrl ? station.imgUrl : '/img/unnamed-song.png'}
                  alt={station.name}
                />
                <div className="station-info">
                  {/* Play/Pause button mirrors global state */}
                  <button
                    type="button"
                    className="play-button"
                    onClick={onPlayClick}
                    aria-pressed={isActive}
                    aria-label={isActive ? 'Pause' : 'Play'}
                    data-playing={isActive ? 'true' : 'false'}
                  >
                    {isActive ? (
                      // pause icon
                      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" />
                        <rect x="14" y="5" width="4" height="14" />
                      </svg>
                    ) : (
                      // play icon
                      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5V19L19 12L8 5Z" />
                      </svg>
                    )}
                  </button>

                  <p>{` ${maxLength(station.name, 20)}`}</p>
                  <p className="station-type-p">{`Playlist•${station.songs.length} songs`}</p>
                  {/* <p className="station-type">Playlist•{`${station.songs.length} songs`}</p> */}
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    </section>
  )
}
