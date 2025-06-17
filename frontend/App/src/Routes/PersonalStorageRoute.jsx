import React from 'react'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import { Home } from '../Pages/Home'
import { AppLandingPage } from '../Pages/AppLandingPage'

export const PersonalStorageRoute = () => {
  return (

    <BrowserRouter>
        <Routes>
            <Route path='/' element={<AppLandingPage/>}/>
            <Route path='/dashboard' element={<Home/>}/>
        </Routes>
    </BrowserRouter>
    
  )
}