import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from '../pages/HomePage.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import RegisterPage from '../features/auth/RegisterPage.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import TicketPage from '../features/ticket/TicketPage.jsx'
import TicketsPage from '../features/ticket/TicketsPage.jsx'
import OnBoarding from '../features/onboarding/Onboarding.jsx';
import { CheckAuth } from '../features/auth/check-auth.jsx'

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
                    <CheckAuth protectedRoute={true}> 
                    <OnBoarding/> 
                    </CheckAuth>  
                } />

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
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes