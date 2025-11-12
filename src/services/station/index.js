const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

function getEmptyStation() {
    return {
        _id: '',
        name: makeId(),
        msgs: [],
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
    }
}

// Force local service for GitHub Pages or when backend is disabled
const isStaticDeployment = 
    (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) ||
    import.meta.env.VITE_DISABLE_BACKEND === 'true' ||
    import.meta.env.VITE_LOCAL === 'true'

const service = isStaticDeployment ? local : remote
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
