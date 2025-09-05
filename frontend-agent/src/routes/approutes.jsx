import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from '../pages/Home.jsx'
import RegisterPage from '../pages/auth/register.jsx'
import LoginPage from '../pages/auth/login.jsx'
import AdminPage from '../pages/admin.jsx'
import TicketPage from '../pages/ticket.jsx'
import TicketsPage from '../pages/tickets.jsx'

import { CheckAuth } from '../components/check-auth.jsx'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                
                <Route path='/register-form' element={
                    <CheckAuth protected={true}>
                        <RegisterPage />
                    </CheckAuth>
                } />
                
                <Route path='/login' element={
                    <CheckAuth protected={true}>
                        <LoginPage />
                    </CheckAuth>
                } />
                
                <Route path='/admin' element={
                    <CheckAuth protected={true}>
                        <AdminPage />
                    </CheckAuth>
                } />
                
                <Route path='/tickets' element={
                    <CheckAuth protected={false}>
                        <TicketPage />
                    </CheckAuth>
                } />
                
                <Route path='/ticket/:id' element={
                    <CheckAuth protected={false}>
                        <TicketsPage />
                    </CheckAuth>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes