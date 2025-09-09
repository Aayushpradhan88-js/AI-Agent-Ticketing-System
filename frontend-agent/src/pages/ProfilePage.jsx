import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BackBtn from '../components/BackBtn.jsx';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState(
    {
      username:"",
      bio:"",
      skills:"",
      email:"",
      location:""
    }
  )
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value })
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));

        // Check if token is expired
        if (payload.exp * 1000 < Date.now()) {
          setError("Token expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      setError("Invalid token format. Please login again.");
    }
  }, [navigate]);

  const handleEdit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(editForm)
        },
      )

      const updatedData = await response.json();

      if (response.ok) {
        localStorage.setItem("username", JSON.stringify(updatedData.username))
        localStorage.setItem("bio", JSON.stringify(updatedData.bio))
        localStorage.setItem("skills", JSON.stringify(updatedData.skills))
        localStorage.setItem("location", JSON.stringify(updatedData.location))
        navigate("/tickets");
      } else {

        setError(updatedData.message || updatedData.error || "FAILED TO UPDATE USER")
      }
    } catch (error) {

      setError(`SERVER ERROR: ${error.message}`)
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    navigate("/tickets"); // Navigate back to tickets page
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#1a1a1a] font-['Roboto']">

      <div className="w-full max-w-2xl bg-base-100 p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
         <BackBtn/>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
            <p className="text-sm opacity-70 mt-1">update your personal details to keep your profile up-to-date</p>
          </div>
          <div className="w-16"></div>
        </div>

        {/*--------Error Display----------*/}
        {error && (
          <div className="alert alert-error mb-4">
            <span className="text-white">{error}</span>
          </div>
        )}

        {/*----------- Profile Edit Form---------- */}
        <form className="space-y-6" onSubmit={handleEdit}>

          {/*-----Username Input-----*/}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Username</span>
            </label>
            <input
              type="text"
              placeholder="your username"
              value={editForm.user}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-[#2563eb] focus:shadow-md focus:shadow-[#2563eb]/50"
            />
          </div>

          {/*-----Bio Input-----*/}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Bio</span>
            </label>
            <textarea
                 type="text"
              placeholder="A short bio about you"
              value={editForm.user}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-[#2563eb] focus:shadow-md focus:shadow-[#2563eb]/50"
            />
          </div>

          {/*-----Skills Input-----*/}
           <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Skills</span>
            </label>
            <input
              type="text"
              placeholder="your username"
              value={editForm.user}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-[#2563eb] focus:shadow-md focus:shadow-[#2563eb]/50"
            />
          </div>


          {/*-----Email Input-----*/}
           <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Email</span>
            </label>
            <input
              type="text"
              placeholder="your username"
              value={editForm.user}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-[#2563eb] focus:shadow-md focus:shadow-[#2563eb]/50"
            />
          </div>


          {/*----- Location Input-----t */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Location</span>
            </label>
            <input
              type="text"
              placeholder="your username"
              value={editForm.user}
              onChange={handleChange}
              className="input input-bordered w-full rounded-2xl focus:outline-none focus:border-[#2563eb] focus:shadow-md focus:shadow-[#2563eb]/50"
            />
          </div>


          {/*----- Action Buttons -----*/}
          <div className="flex justify-center items-center pt-4 space-x-8">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-8 py-2 rounded-full text-white bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary px-8 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default ProfilePage