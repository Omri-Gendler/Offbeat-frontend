
const KEY = 'guestLibraryStationIds';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function save(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export const guestLibraryService = {
  getIds() {
    return load();
  },
  has(id) {
    return load().includes(id);
  },
  add(id) {
    const ids = load();
    if (!ids.includes(id)) ids.push(id);
    save(ids);
    return ids;
  },
  remove(id) {
    const ids = load().filter(x => x !== id);
    save(ids);
    return ids;
  }
};
