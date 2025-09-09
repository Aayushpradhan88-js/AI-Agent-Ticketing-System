import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const userData = JSON.parse(data);
    setUserInfo(userData)
  }, [])

  return (
    <div className="w-40 h-10 cursor-pointer hover:bg-amber-800 rounded-full">
      <Link to="/profile/edit">
        {userInfo?.user}
      </Link>
    </div>
  )
}
