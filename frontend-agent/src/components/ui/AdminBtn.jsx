import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

export const AdminBtn = () => {
      const navigate = useNavigate();

  const handleAdminPage = () => {
    navigate("/admin")
  };
  return (
        <div>
      <button
        type='button'
        onClick={handleAdminPage}
        className="bg-blue-700 text-white p-2 cursor-pointer rounded"
      >
        Admin
      </button>

      
    </div>
  )
}