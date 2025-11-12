import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import { store } from './store/store'
import { RootCmp } from './RootCmp'
import { initDemoData, clearAndRegenerateDemoData } from './services/demo-data.service.js'

import './assets/styles/main.css'

// Force initialize demo data, especially for GitHub Pages
initDemoData()

// For GitHub Pages, ensure we have demo data after a small delay
if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    setTimeout(() => {
        const stations = localStorage.getItem('stationDB')
        if (!stations || JSON.parse(stations).length === 0) {
            console.log('🚀 GitHub Pages detected - forcing demo data initialization')
            clearAndRegenerateDemoData()
        }
    }, 500)
}

// Debug function - available in browser console
window.resetStationData = clearAndRegenerateDemoData

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<Router>
			<RootCmp />
		</Router>
	</Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register() // Disabled for GitHub Pages deployment
serviceWorkerRegistration.unregister()
