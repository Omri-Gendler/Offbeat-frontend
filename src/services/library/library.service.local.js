// src/services/library/library.service.local.js
import { loadFromStorage, saveToStorage } from '../util.service'

// Keep it simple: a flat array of station IDs in localStorage
const LIBRARY_KEY = 'libraryStationIds'
_createLibrary()

export const libraryService = {
  getIds,
  has,
  add,
  remove,
  toggle,
  set,
  clear,
}

window.library = libraryService // dev convenience, like window.cs

function _createLibrary() {
  const ids = loadFromStorage(LIBRARY_KEY)
  if (!Array.isArray(ids)) {
    saveToStorage(LIBRARY_KEY, [])
  }
}

function _load() {
  const ids = loadFromStorage(LIBRARY_KEY)
  return Array.isArray(ids) ? ids : []
}

function _save(ids) {
  // de-dup + compact
  const uniq = Array.from(new Set((ids || []).filter(Boolean)))
  saveToStorage(LIBRARY_KEY, uniq)
  return uniq
}

// =============== Public API ===============

/** Return all saved station IDs (guest library). */
function getIds() {
  return _load()
}

/** Overwrite the entire list of saved station IDs. */
function set(ids) {
  return _save(ids)
}

/** Whether a station is saved. */
function has(stationId) {
  if (!stationId) return false
  return _load().includes(stationId)
}

/** Add a station ID (no-op if already present). Returns the updated list. */
function add(stationId) {
  if (!stationId) return _load()
  const ids = _load()
  if (!ids.includes(stationId)) ids.push(stationId)
  return _save(ids)
}

/** Remove a station ID. Returns the updated list. */
function remove(stationId) {
  const ids = _load().filter(id => id !== stationId)
  return _save(ids)
}

/**
 * Toggle a station ID.
 * Returns { added: boolean, ids: string[] }
 */
function toggle(stationId) {
  if (!stationId) return { added: false, ids: _load() }
  const ids = _load()
  const idx = ids.indexOf(stationId)
  let added = false
  if (idx === -1) {
    ids.push(stationId)
    added = true
  } else {
    ids.splice(idx, 1)
  }
  return { added, ids: _save(ids) }
}

/** Clear all saved station IDs. */
function clear() {
  return _save([])
}
