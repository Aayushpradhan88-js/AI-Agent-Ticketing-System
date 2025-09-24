import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const userData = JSON.parse(data);
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
      className="w-4 h-5 cursor-pointer rounded-full"
    >
      {getInitials(userInfo?.user)}
    </div>
  )
}
