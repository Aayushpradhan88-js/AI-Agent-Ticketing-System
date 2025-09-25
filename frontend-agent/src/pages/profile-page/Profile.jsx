import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import storage from '../../utils/localStorage.js'

export const Profile = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userData = storage.getUser();
    setUserInfo(userData)
  }, [])

  const getInitials = (username) => {
    if (!username) return '';
    const name = username.trim(0).split(' ')
    if (name.length === 1) {
      return name[0].charAt(0).toUpperCase();
    }
    return name[0].charAt(0).toUpperCase() + name[name.length - 1].charAt(0).toUpperCase();
  }

  const navigate = useNavigate()
  const profilePageNavigate = () => {
    navigate("/profile/edit")
  }

  return (
    <div
      onClick={profilePageNavigate}
      className="cursor-pointer rounded-full"
    >
      {children || getInitials(userInfo?.user)}
    </div>
  )
}
