import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  // const [profileClick, setPofileClick] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user");
    const userData = JSON.parse(data);

    setUserInfo(userData)
  }, [])



  return (
    <div className="w-40 h-10 rounded-full">{userInfo.user}</div>
  )
}
