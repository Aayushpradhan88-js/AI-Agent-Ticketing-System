import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from '../pages/Home.jsx'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes