import React, { useState } from 'react'


const OnBoarding = () => {
  const [stage, setStage] = useState('useType');
  const [userType, setUserType] = useState();
  const [userId, setUserId] = useState();
  
  return (
    <div>OnBoarding</div>
  )
}

export default OnBoarding