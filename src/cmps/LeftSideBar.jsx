import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { loadStations, addStation } from "../store/actions/station.actions";
import { useNavigate } from "react-router-dom";
import { maxLength } from "../services/util.service";
import { LIKED_ID } from "../store/reducers/station.reducer";
import { Library } from './Library';
import { ViewContextMenu } from './ViewContextMenu';
import { SimpleContextMenu } from './SimpleContextMenu';

import { playContext, togglePlay, setPlay } from "../store/actions/player.actions";
import { IconListCompact, IconListDefault, IconGridDefault, IconPinned, IconSearch16, SearchLensIcon } from './Icon';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { loadLikedSongs } from "../store/actions/user.actions";


const VIEW_KEY = 'libraryViewMode';
const VIEW_META = {
  grid: { label: 'Default grid', Icon: IconGridDefault },
  'grid-compact': { label: 'Compact grid', Icon: IconListCompact },
  list: { label: 'Default list', Icon: IconListDefault },
}
const SORT_LABELS = {
  recent: 'Recents',
  recentlyAdded: 'Recently Added',
  alphabetical: 'Alphabetical',
  creator: 'Creator',
}

export function LeftSideBar() {
  const allStations = useSelector(s => s.stationModule.stations) || [];
  const { queue = [], isPlaying = false, contextId = null, contextType = null } =
    useSelector(s => s.playerModule || {});

  const loggedinUser = useSelector(s => s.userModule.user);
  const likedSongs = useSelector(s => s.userModule.likedSongs);
  // -------------------------------------------------

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState({ txt: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || 'grid')
  const PINNED_KEY = 'libraryPinnedIds'


  const [menu, setMenu] = useState({ open: false, x: 0, y: 0, kind: null, itemId: null })


  const inputRef = useRef(null);
  const recentBtnRef = useRef(null);

  useEffect(() => {
    loadStations();
    if (loggedinUser) {
      loadLikedSongs();
    }
  }, [loggedinUser])

  useEffect(() => { if (isSearchOpen) inputRef.current?.focus(); }, [isSearchOpen]);
  useEffect(() => { localStorage.setItem(VIEW_KEY, viewMode); }, [viewMode]);

  const { label: viewLabel, Icon: ViewIcon } = VIEW_META[viewMode] || VIEW_META.grid;
  const sortLabel = SORT_LABELS[sortBy] || 'Recents'

  const [pinnedIds, setPinnedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(PINNED_KEY) || '[]')) }
    catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem(PINNED_KEY, JSON.stringify([...pinnedIds]))
  }, [pinnedIds])

  const togglePin = (id) => {
    setPinnedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }


  // ---- playback helpers ----
  const idsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const aid = a[i]?.id ?? a[i];
      const bid = b[i]?.id ?? b[i];
      if (aid !== bid) return false;
    }
    return true;
  };

  const isThisContext = (station) =>
    !!station?._id &&
    contextId === station._id &&
    contextType === 'station' &&
    idsEqual(queue, Array.isArray(station?.songs) ? station.songs : []);

  const onPlay = (st, { active }) => {
    const tracks = Array.isArray(st?.songs) ? st.songs : [];
    if (!st?._id || !tracks.length) return;
    if (active) {
      if (!isPlaying) togglePlay();
      else setPlay(false);
    } else {
      playContext({ contextId: st._id, contextType: 'station', tracks, index: 0, autoplay: true });
    }
  };

  const openItemMenuAt = (x, y, itemId) => setMenu({ open: true, x, y, kind: 'item', itemId });
  const closeMenu = () => setMenu(m => ({ ...m, open: false, kind: null, itemId: null }));
  const openViewMenuAt = (x, y) => setMenu({ open: true, x, y, kind: 'view' });
  const openGlobalMenuAt = (x, y) => setMenu({ open: true, x, y, kind: 'global' });

  const handleItemContextMenu = (e, station) => {
    const x = e.clientX ?? e.x ?? 0;
    const y = e.clientY ?? e.y ?? 0;
    openItemMenuAt(x, y, station._id);
  };


  const openMenuAtAnchor = (el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    openViewMenuAt(r.left, r.bottom + 6);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const onRecentBtn = e.target.closest('.recent-btn');
    const onItem = e.target.closest('.library-item');

    if (onRecentBtn) {
      // show view options
      openViewMenuAt(e.clientX, e.clientY);
      return;
    }
    if (!onItem) {
      openGlobalMenuAt(e.clientX, e.clientY);
      return;
    }
  };

  const handleCreateStation = async () => {
    try {
      const nextNumber =
        Math.max(
          0,
          ...allStations
            .map(s => s.name?.match(/^My Playlist #(\d+)$/)?.[1])
            .filter(Boolean)
            .map(n => +n)
        ) + 1;

      const newStation = {
        name: `My Playlist #${nextNumber}`,
        description: '',
        imgUrl: '/img/unnamed-song.png',
        songs: [],
        createdBy: { fullname: 'You' }
      };

      const savedStation = await addStation(newStation);
      navigate(`/station/${savedStation._id}`);
    } catch (err) {
      console.error('Failed to create station:', err);
    }
  };

  const library = useMemo(() => {
    const userId = loggedinUser?._id;

    const likedSongsStation = {
      _id: LIKED_ID,
      name: 'Liked Songs',
      songs: likedSongs || [],
      imgUrl: '/img/liked-songs.jpeg',
      isLikedSongs: true,
      createdBy: { fullname: 'You' }
    };

    let list = allStations.filter(s =>
      s.owner?._id?.toString() === userId?.toString() ||
      (userId && s.likedByUsers?.some(likedUserId => likedUserId.toString() === userId.toString()))
    );

    if (filterBy.txt) {
      const rx = new RegExp(filterBy.txt, 'i');
      list = list.filter(s => rx.test(s.name || ''));
    }

    const decorated = list.map(s => ({ ...s, isPinned: pinnedIds.has(s._id) }));

    const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
    const makeSorter = (sortBy) => {
      switch (sortBy) {
        case 'recent':
          return (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
        case 'recentlyAdded':
          return (a, b) => (b.createdAt || 0) - (a.createdAt || 0);
        case 'alphabetical':
          return (a, b) => {
            const byName = collator.compare(a.name || '', b.name || '');
            if (byName !== 0) return byName;
            return (a._id || '').localeCompare(b._id || '');
          };
        case 'creator':
          return (a, b) => {
            const creatorA = a.owner?.fullname || a.createdBy?.fullname || '';
            const creatorB = b.owner?.fullname || b.createdBy?.fullname || '';
            const byCreator = collator.compare(creatorA, creatorB);
            if (byCreator !== 0) return byCreator;
            const byName = collator.compare(a.name || '', b.name || '');
            if (byName !== 0) return byName;
            return (a._id || '').localeCompare(b._id || '');
          };
        default:
          return (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
      }
    };

    const sorter = makeSorter(sortBy);
    const pinned = decorated.filter(s => s.isPinned).sort(sorter);
    const unpinned = decorated.filter(s => !s.isPinned).sort(sorter);

    return [likedSongsStation, ...pinned, ...unpinned];

  }, [allStations, filterBy.txt, sortBy, pinnedIds, loggedinUser, likedSongs]); // <-- הוסף likedSongs לתלויות


  function searchBar() {
    const containerRef = useRef(null)

    // close on outside click only when empty
    useEffect(() => {
      if (!isSearchOpen) return
      const onDown = (e) => {
        if (!containerRef.current) return
        const clickedInside = containerRef.current.contains(e.target)
        if (!clickedInside && !filterBy.txt) setIsSearchOpen(false)
      }
      const onEsc = (e) => {
        if (e.key === 'Escape') {
          if (filterBy.txt) {
            inputRef.current?.blur()
          } else {
            setIsSearchOpen(false)
          }
        }
      }
      document.addEventListener('mousedown', onDown, true)
      document.addEventListener('keydown', onEsc)
      return () => {
        document.removeEventListener('mousedown', onDown, true)
        document.removeEventListener('keydown', onEsc)
      }
    }, [isSearchOpen, filterBy.txt])

    return (
      <div
        ref={containerRef}
        className={`search-container-left-side-bar ${isSearchOpen ? 'expanded' : ''}`}
        onClick={() => !isSearchOpen && setIsSearchOpen(true)}
        role="search"
        aria-expanded={isSearchOpen}
      >
        <SearchLensIcon
          className="search-icon"
          aria-hidden="true"
          style={{ cursor: 'pointer', height: 16 }}
          onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }}
        />

        <input
          ref={inputRef}
          className="search-input"
          type="text"
          name="txt"
          value={filterBy.txt}
          onChange={(ev) => setFilterBy({ ...filterBy, [ev.target.name]: ev.target.value })}
          placeholder="Search in Your Library"
          onFocus={() => setIsSearchOpen(true)}
        />
      </div>
    )
  }


  function leftHeader() {
    return (
      <div className="left-header">
        <h3>Your Library</h3>
        <button className="create-station-btn" onClick={handleCreateStation}>
          <AddIcon />
          <span>Create</span>
        </button>
      </div>
    );
  }

  return (
    <section className="left-side-bar">
      <aside
        className="station-list-container"
        onContextMenu={handleContextMenu}
      >
        <div className="library-filters">
          {leftHeader()}
          <section className={`search-and-recent ${isSearchOpen ? 'search-open' : ''}`}>
            {searchBar()}
            <div className="recent-btn">
              <button
                ref={recentBtnRef}
                type="button"
                className="view-toggle-btn flex ctx-anchor-view"
                title={`View: ${viewLabel}`}
                aria-label={`View: ${viewLabel}`}
                onClick={() => openMenuAtAnchor(recentBtnRef.current)}
                style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}
              >
                <span className="label">{sortLabel}</span>
                <ViewIcon style={{ width: 16, height: 16, color: 'var(--clr4)' }} />
              </button>
            </div>
          </section>
        </div>

        <Library
          items={library}
          viewMode={viewMode}
          onOpen={(st) => navigate(`/station/${st._id}`)}
          onPlay={onPlay}
          isPlaying={isPlaying}
          isThisContext={isThisContext}
          onItemContextMenu={handleItemContextMenu}
        />

        <ViewContextMenu
          open={menu.open && menu.kind === 'view'}
          anchorEl={recentBtnRef}

          groups={[
            {
              title: 'Sort by',
              value: sortBy,
              onChange: setSortBy,
              items: [
                { id: 'recent', label: 'Recents' },
                { id: 'recentlyAdded', label: 'Recently Added' },
                { id: 'alphabetical', label: 'Alphabetical' },
                { id: 'creator', label: 'Creator' },
              ],
            },
            {
              title: 'View as',
              value: viewMode,
              onChange: setViewMode,
              items: [
                { id: 'grid-compact', label: 'Compact grid', icon: <IconListCompact /> },
                { id: 'list', label: 'Default list', icon: <IconListDefault /> },
                { id: 'grid', label: 'Default grid', icon: <IconGridDefault /> },
              ],
            },
          ]}
          onClose={closeMenu}
        />


        <SimpleContextMenu
          open={menu.open && menu.kind === 'global'}
          x={menu.x}
          y={menu.y}
          items={[{
            id: 'create',
            label: 'Create playlist',
            icon: <AddIcon fontSize="small" />,
            onSelect: handleCreateStation,
          }]}
          onClose={closeMenu}
        />
        <SimpleContextMenu
          open={menu.open && menu.kind === 'item'}
          x={menu.x}
          y={menu.y}
          items={
            menu.itemId !== LIKED_ID && (
              pinnedIds.has(menu.itemId)
                ? [
                  {
                    id: 'unpin',
                    label: 'Unpin playlist',
                    icon: <IconPinned />,
                    onSelect: () => { togglePin(menu.itemId); closeMenu(); },
                  },
                ]
                : [
                  {
                    id: 'pin',
                    label: 'Pin playlist',
                    onSelect: () => { togglePin(menu.itemId); closeMenu(); },
                  },
                ]
            )}
          closeOnSelect
        />
      </aside>
    </section>
  )
}
