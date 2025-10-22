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
import { IconListCompact, IconListDefault, IconGridDefault } from './Icon';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';


const VIEW_KEY = 'libraryViewMode'; 
const VIEW_META = {
  grid:          { label: 'Default grid',  Icon: IconGridDefault },
  'grid-compact':{ label: 'Compact grid',  Icon: IconListCompact },
  list:          { label: 'Default list',  Icon: IconListDefault },
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

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState({ txt: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || 'grid')
  const PINNED_KEY = 'libraryPinnedIds'


const [menu, setMenu] = useState({ open: false, x: 0, y: 0, kind: null, itemId: null })


  const inputRef = useRef(null);
  const recentBtnRef = useRef(null);

  useEffect(() => { loadStations(); }, []);
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

  // ---- menus helpers ----
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
      // empty space → show create playlist
      openGlobalMenuAt(e.clientX, e.clientY);
      return;
    }
    // right-click on an item: no-op (or add item menu later)
  };

  // ---- create playlist ----
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

  let list = allStations.filter(s => s._id === LIKED_ID || s.createdBy?.fullname === 'You')


  if (filterBy.txt) {
    const rx = new RegExp(filterBy.txt, 'i')
    list = list.filter(s => rx.test(s.name || ''))
  }


  const decorated = list.map(s => ({ ...s, isPinned: pinnedIds.has(s._id) }))

  const liked = decorated.find(s => s._id === LIKED_ID)
  const rest  = decorated.filter(s => s._id !== LIKED_ID)



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
        const byCreator = collator.compare(a.createdBy?.fullname || '', b.createdBy?.fullname || '');
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


  const pinned = rest.filter(s => s.isPinned).sort(sorter)
  const unpinned = rest.filter(s => !s.isPinned).sort(sorter)

    return liked ? [liked, ...pinned, ...unpinned] : [...pinned, ...unpinned]
}, [allStations, filterBy.txt, sortBy, pinnedIds])


  function searchBar() {
    return (
      <div className={`search-container-left-side-bar ${isSearchOpen ? 'expanded' : ''}`}>
        <SearchIcon
          className="search-icon"
          onClick={() => setIsSearchOpen(true)}
          style={{ cursor: 'pointer', height: 24 }}
        />
        {isSearchOpen ? (
          <input
            className="search-input"
            ref={inputRef}
            type="text"
            name="txt"
            value={filterBy.txt}
            onChange={(ev) => setFilterBy({ ...filterBy, [ev.target.name]: ev.target.value })}
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
          <section className="search-and-recent">
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
                <span>{sortLabel}</span>
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
          onItemContextMenu={handleItemContextMenu}   // <-- new
        />

<ViewContextMenu
  open={menu.open && menu.kind === 'view'}
  anchorEl={recentBtnRef.current}
  placement="bottom-right"
  groups={[
    {
      title: 'Sort by',
      value: sortBy,
      onChange: setSortBy,
      items: [
        { id: 'recent',        label: 'Recents' },
        { id: 'recentlyAdded', label: 'Recently Added' },
        { id: 'alphabetical',  label: 'Alphabetical' },
        { id: 'creator',       label: 'Creator' },
      ],
    },
    {
      title: 'View as',
      value: viewMode,
      onChange: setViewMode,
      items: [
        { id: 'grid-compact', label: 'Compact grid', icon: <IconListCompact /> },
        { id: 'list',         label: 'Default list', icon: <IconListDefault /> },
        { id: 'grid',         label: 'Default grid', icon: <IconGridDefault /> },
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
          items={[
            pinnedIds.has(menu.itemId)
              ? { id: 'unpin', label: 'Unpin',   onSelect: () => { togglePin(menu.itemId); closeMenu(); } }
              : { id: 'pin',   label: 'Pin to top', onSelect: () => { togglePin(menu.itemId); closeMenu(); } }
          ]}
          onClose={closeMenu}
        />
        <div
      className="LayoutResizer LayoutResizer__inline-end"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize library sidebar"
      onMouseDown={startSidebarDrag}
      onTouchStart={startSidebarDrag}
    />
      </aside>
    </section>
  )
}

function startSidebarDrag(e) {
  e.preventDefault();
  const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const startWidth = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--sidebar-width')) || 320;

  const onMove = (ev) => {
    const x = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
    const delta = x - startX;                 // LTR: dragging right widens
    const next = Math.min(560, Math.max(220, startWidth + delta));
    document.documentElement.style.setProperty('--sidebar-width', `${next}px`);
  };
  const onUp = () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchend', onUp);
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}
