import React from 'react'
import { useEffect,useState } from 'react'
import { Routes, Route } from 'react-router'
import { FastAverageColor } from 'fast-average-color'
import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StationIndex } from './pages/StationIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { StationDetails } from './pages/StationDetails'
import { UserDetails } from './pages/UserDetails'
import { Browser } from './pages/Browser.jsx'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LeftSideBar } from './cmps/LeftSideBar.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { AddStationModal } from './cmps/AddStationModal.jsx'
import { SpatialTracking } from '@mui/icons-material'
import { useSelector } from 'react-redux'



export function RootCmp() {
  const bgImageUrl = useSelector(s => s.appModule?.bgImageUrl)
  const stations = useSelector(s => s.stationModule?.stations || [])
  const [dynamicBg, setDynamicBg] = useState('#121212')

  // Helper to compute gradient safely
  useEffect(() => {
    let alive = true
    const fac = new FastAverageColor()

    const computeFromUrl = (url) => {
      if (!url) { if (alive) setDynamicBg('#121212'); return }
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.referrerPolicy = 'no-referrer'
      img.onload = async () => {
        try {
          const c = await fac.getColorAsync(img, { algorithm: 'dominant' })
          if (alive) setDynamicBg(`linear-gradient(${c.hex} 0%, #121212 350px)`)
        } catch {
          if (alive) setDynamicBg('#121212')
        }
      }
      img.onerror = () => { if (alive) setDynamicBg('#121212') }
      img.src = url
    }

    // Prefer explicit bgImageUrl (from Browser). If absent, fall back to first station.
    const fallbackUrl =
      stations[0]?.imgUrl ||
      stations[0]?.coverUrl ||
      stations[0]?.img ||
      stations[0]?.songs?.[0]?.imgUrl ||
      (stations[0]?.songs?.[0]?.id
        ? `https://i.ytimg.com/vi/${stations[0].songs[0].id}/hqdefault.jpg`
        : null)

    computeFromUrl(bgImageUrl || fallbackUrl)

    return () => { alive = false; fac.destroy() }
  }, [bgImageUrl, stations])
  
    return (
        <div className="app-layout">
            <AppHeader />
            <UserMsg />
            
            <div className="content-layout">
                <LeftSideBar />
                <UserMsg />

                <main className="main-content" style={{ background: dynamicBg }}>
                    <Routes>
                        <Route path="" element={<HomePage />} />
                        <Route path="/station/:stationId" element={<StationDetails />} />
                        <Route path="/search" element={<Browser />} />
                        <Route path="/search/:genre" element={<Browser />} />
                        
                        <Route path="about" element={<AboutUs />}>
                            <Route path="team" element={<AboutTeam />} />
                            <Route path="vision" element={<AboutVision />} />
                        </Route>
                        <Route path="stations" element={<StationIndex />} />
                        <Route path="/stations/add" element={<AddStationModal />} />
                        <Route path="stations/:stationId" element={<StationDetails />} />
                        <Route path="user/:id" element={<UserDetails />} />
                        <Route path="review" element={<ReviewIndex />} />
                        <Route path="admin" element={<AdminIndex />} />
                        <Route path="auth" element={<LoginSignup />}>
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                    </Routes>
                </main>
            </div>
            
            <AppFooter />
        </div>
    )
}


