import React from 'react'
import { useEffect, useState } from 'react'
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
import { useSelector } from 'react-redux'
import { setCoverHex } from './store/actions/app.actions'
import { socketService } from './services/socket.service.js'



export function RootCmp() {
  const bgImageUrl = useSelector(s => s.appModule?.bgImageUrl)
  const stations = useSelector(s => s.stationModule?.stations || [])
  const coverHex = useSelector(s => s.appModule?.coverHex) || '#1f1f1f'
  const [dynamicBg, setDynamicBg] = useState('#121212')
  const [searchInput, setSearchInput] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [albums, setAlbums] = useState([])
  const [artists, setArtists] = useState([])

  // useEffect(() => {
  //   clearAndRegenerateDemoData()

  //   localStorage.removeItem('defaultStationsAdded')

  //   const hasDefaultStations = localStorage.getItem('defaultStationsAdded')

  //   if (!hasDefaultStations) {
  //     const guestUser = { _id: 'guest', fullname: 'Guest', username: 'guest' }
  //     const addedStations = addDefaultStationsToUserLibrary(guestUser)
  //     localStorage.setItem('defaultStationsAdded', 'true')
  //     // Reload stations to reflect changes
  //     setTimeout(() => loadStations(), 500)
  //   } else {
  //   }
  // }, [])

  useEffect(() => {
    const user = userService.getLoggedinUser()
    if (user) {
      socketService.login(user._id)
    }
  }, [])

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + import.meta.env.VITE_SPOTIFY_API_KEY + '&client_secret=' + import.meta.env.VITE_SPOTIFY_API_KEY_SECRET,
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.access_token)
      })
      .catch((err) => console.error(err))
  }, [])


  useEffect(() => {
    let alive = true
    const fac = new FastAverageColor()

    const computeFromUrl = (url) => {
      if (!url) {
        if (alive) {
          setDynamicBg('none')
          setCoverHex('#1f1f1f')
        }
        return
      }
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.referrerPolicy = 'no-referrer'
      img.onload = async () => {
        try {
          const c = await fac.getColorAsync(img, { algorithm: 'dominant' })
          if (!alive) return
          const [r, g, b] = c.value

          // short, smooth, TALLER hue that scrolls (background-image)
          const topHue = `linear-gradient(
            to bottom,
            rgba(${r},${g},${b},.55) 0,
            rgba(${r},${g},${b},.40) 180px,
            rgba(${r},${g},${b},.22) 280px,
            rgba(${r},${g},${b},.10) 320px,
            rgba(${r},${g},${b},0) 360px
          )`

          setDynamicBg(topHue)   // ← only the gradient layer
          setCoverHex(c.hex)
        } catch {
          if (alive) {
            setDynamicBg('none')
            setCoverHex('#1f1f1f')
          }
        }
      }
      img.onerror = () => {
        if (alive) {
          setDynamicBg('none')
          setCoverHex('#1f1f1f')
        }
      }
      img.src = url
    }

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

        <main
          className="main-content"
          // Base color + scrolling top gradient
          style={{
            '--cover-color': coverHex,
            backgroundColor: '#121212',
            backgroundImage: dynamicBg,     // ← the hue overlay
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 360px',   // ← how tall the tint is
            backgroundPosition: 'top left', // ← sits at the top, scrolls
          }}
        >
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


