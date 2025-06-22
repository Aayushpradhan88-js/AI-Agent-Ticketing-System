import React from 'react'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import { Home } from '../Pages/Home'
import { AppLandingPage } from '../Pages/AppLandingPage'
import { SignUp } from '../Pages/Signup'
import { SignIn } from '../Pages/SignIn'

export const PersonalStorageRoute = () => {
  return (

    <BrowserRouter>
        <Routes>
            <Route path='/' element={<AppLandingPage/>}/>
            <Route path='/dashboard' element={<Home/>}/>
             <Route path='/signup-account' element={<SignUp/>}/>
            <Route path='/signin-account' element={<SignIn/>}/>

        </Routes>
    </BrowserRouter>
    
  )
}