import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StationIndex } from './pages/StationIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { StationDetails } from './pages/StationDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LeftSideBar } from './cmps/LeftSideBar.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { AddStationModal } from './cmps/AddStationModal.jsx'
import { SpatialTracking } from '@mui/icons-material'



export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <LeftSideBar />
            <UserMsg />

            <main className="main-content">
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="/station/:stationId" element={<StationDetails />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>
                    <Route path="stations" element={<StationIndex />} >
                        <Route path="add" element={<AddStationModal />} />
                    </Route>
                    {/* <Route path="stations/:stationId" element={<StationDetails />} /> */}
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


