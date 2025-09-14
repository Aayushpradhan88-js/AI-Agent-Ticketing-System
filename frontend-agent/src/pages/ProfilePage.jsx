import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { BackBtn } from '../components/BackBtn.jsx';
import storage from '../utils/localStorage.js';
import { userAPI } from '../utils/api.js';

const ProfilePage = () => {
  const [editForm, setEditForm] = useState({
    'username': '',
    'bio': '',
    'skills': '',
    'email': '',
    'location': ''
  })
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value })
    if (error) setError('')
    if (success) setSuccess('');
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!storage.isAuthenticated()) {
        setError('PLEASE LOGIN TO CONTINUE');
        navigate('/login');
        return;
      }

      try {
        const cachedProfile = storage.getProfile();
        const cachedUser = storage.getUser();

        if (cachedProfile || cachedUser) {
          const profileData = cachedProfile || cachedUser
          setEditForm({
            username: profileData.username || '',
            bio: profileData.bio,
            skills: Array.isArray(profileData.skills) ? profileData.skills.join(', ') : (profileData.skills || ''),
            email: profileData.email || '',
            location: profileData.location || '',
          })
        }

        const profileResponse = await userAPI.getProfile();

        if (profileResponse.user) {
          const userData = profileResponse.user;
          setEditForm({
            username: userData.username || '',
            bio: userData.bio,
            skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : (profileData.skills || ''),
            email: userData.email || '',
            location: userData.location || '',
          })
          storage.setUser(userData);
          storage.setProfile(userData);
        };
      } catch (error) {
        console.log('ERROR LOADING PROFILE', error);
        setError('FAILED TO LOAD PROFILE DATA. PLEASE TRY AGAIN');
      } finally {
        setInitialLoading(false);
      };
    }
  })

  const navigate = useNavigate();
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

        setEditForm({
          ...editForm,
          'username': response.data.username,
          'bio': response.data.bio,
          'skills': response.user.role,
          'email': response.user.user,
          'location': response.data.location
        })
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

  const cancelNavigate = () => {
    navigate("/tickets"); // Navigate back to tickets page
  };
  const handleError = () => {
    error("Some thing went wrong!!");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="border border-gray-600 rounded-lg w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-8">

          <h1
            onClick={handleError}
            className='bg-red'>demo error</h1>
          <button
            className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            <BackBtn>
              <ArrowLeft className="w-4 h-4" />
            </BackBtn>

          </button>

          <h1 className="text-xl font-medium">Edit Profile</h1>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <p className="text-center text-gray-400 mb-12">
          update your personal details to keep your profile up-to-date
        </p>

        {/*----------- Profile Edit Form----------*/}
        <form className="space-y-8">
          {/*-----Username Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">username</label>
            <input
              type="text"
              value={editForm.username}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Bio Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Bio</label>
            <input
              type="text"
              value={editForm.bio}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Skills Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Skills</label>
            <input
              type="text"
              value={editForm.skills}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Email Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Location Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4 mt-12">
            <button
              type="submit"
              onClick={handleEdit}
              disabled={loading}
              className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg transition-colors font-medium"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={cancelNavigate}
              className="text-gray-400 hover:text-white transition-colors"
            >
              cancel
            </button>
          </div>
        </form>
      </div >
    </div>
  );
}

export default ProfilePage