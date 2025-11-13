import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import { store } from './store/store'
import { RootCmp } from './RootCmp'
import { initDemoData, clearAndRegenerateDemoData, createSimpleDemoData } from './services/demo-data.service.js'

import './assets/styles/main.css'

// Force initialize demo data, especially for GitHub Pages
try {
    initDemoData()
} catch (error) {
    console.error('Failed to init demo data:', error)
    // Fallback to simple demo data
    createSimpleDemoData()
}

// Hide initial loading screen once React app is ready
function hideInitialLoading() {
    // Small delay to ensure React has fully rendered
    setTimeout(() => {
        if (window.hideLoading) {
            window.hideLoading()
        }
    }, 100)
}

// For GitHub Pages, ensure we have demo data after a small delay
if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    setTimeout(() => {
        const stations = localStorage.getItem('stationDB')
        const stationData = stations ? JSON.parse(stations) : []
        if (!stations || stationData.length < 2) {
            console.log('🚀 GitHub Pages detected - creating simple demo data')
            createSimpleDemoData()
            // Force a page reload to ensure the new data is loaded
            setTimeout(() => window.location.reload(), 1000)
        }
    }, 1000)
}

// Debug function - available in browser console
window.resetStationData = clearAndRegenerateDemoData

const root = ReactDOM.createRoot(document.getElementById('root'))

// Render the app and hide loading screen when ready
root.render(
	<Provider store={store}>
		<Router>
			<RootCmp />
		</Router>
	</Provider>
)

// Hide loading screen after render
hideInitialLoading()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register() // Disabled for GitHub Pages deployment
serviceWorkerRegistration.unregister()
