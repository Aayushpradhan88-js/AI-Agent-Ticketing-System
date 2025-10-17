import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from '../pages/HomePage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import TicketPage from '../pages/TicketPage.jsx'
import TicketsPage from '../pages/TicketsPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'

import { CheckAuth } from '../components/check-auth.jsx'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <HomePage />
                } />

                <Route path='/register-form' element={
                    <RegisterPage />
                } />

                <Route path='/onboarding' element={
                    
                }
                
                />

                <Route path='/login' element={
                    <LoginPage />
                } />

                <Route path='/admin' element={
                    <CheckAuth protectedRoute={true}>
                        <AdminPage />
                    </CheckAuth>
                } />

                <Route path='/tickets' element={
                    <CheckAuth protectedRoute={true}>
                        <TicketPage />
                    </CheckAuth>
                } />

                <Route path='/ticket/:id' element={
                    <CheckAuth protectedRoute={true}>
                        <TicketsPage />
                    </CheckAuth>
                } />

                <Route path='/profile/edit' element={
                    <CheckAuth protectedRoute={true}>
                        <ProfilePage />
                    </CheckAuth>
                }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes