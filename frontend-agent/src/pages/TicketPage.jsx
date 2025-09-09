import React from 'react'
import { LogoutBtn } from '../components/LogoutBtn.jsx'
import { Profile } from '../components/profile-page/Profile.jsx'
import { AdminBtn } from '../components/AdminBtn.jsx'

const TicketPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 border-4 border-white">
      <div className="flex w-full justify-between items-center mb-8">
        <h1 className="text-2xl">superagent</h1>
        <input type="text" placeholder="search tickets" className="p-2 bg-black border border-white rounded w-1/2" />
        <div className="flex items-center space-x-4">

          <AdminBtn />
          <Profile />

        </div>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-lg mb-2">Create Ticket</h2>
        <input type="text" placeholder="Title:" className="w-full p-2 mb-4 bg-black border border-white rounded" />
        <textarea placeholder="Description" className="w-full p-2 mb-4 bg-black border border-white rounded h-32"></textarea>
        <div className="flex justify-center">
          <button className="bg-blue-700 text-white p-2 rounded w-20">create</button> {/* Centered create button */}
        </div>
      </div>
      <div className="w-full max-w-md mt-8">
        <h3 className="text-lg mb-2">All Tickets</h3>
        <div className="bg-green-800 p-2 rounded mb-2">
          <p>help in javascript</p>
          <p>Need help in frontend for react</p>
          <p className="text-gray-400 text-sm">createdAt: 2025-09-05, 08:50pm</p>
        </div>
      </div>
      <LogoutBtn />
    </div>
  )
}

export default TicketPage