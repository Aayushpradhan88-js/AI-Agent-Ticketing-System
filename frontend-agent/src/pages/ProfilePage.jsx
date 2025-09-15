import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { BackBtn } from '../components/BackBtn.jsx';
import storage from '../utils/localStorage.js';
import { userAPI } from '../utils/api.js';

const ProfilePage = () => {
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    skills: '',
    email: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setEditForm({ ...editForm, [event.target.name]: event.target.value });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      // Check authentication
      if (!storage.isAuthenticated()) {
        setError("Please login to continue.");
        navigate("/login");
        return;
      }

      try {
        //Try to load from cache first
        const cachedProfile = storage.getProfile();
        const cachedUser = storage.getUser();
        
        if (cachedProfile || cachedUser) {
          const profileData = cachedProfile || cachedUser;
          setEditForm({
            username: profileData.username || '',
            bio: profileData.bio || '',
            skills: Array.isArray(profileData.skills) ? profileData.skills.join(', ') : (profileData.skills || ''),
            email: profileData.email || '',
            location: profileData.location || ''
          });
        }

        // Fetch fresh data from API
        const profileResponse = await userAPI.getProfile();
        
        if (profileResponse.user) {
          const userData = profileResponse.user;
          setEditForm({
            username: userData.username || '',
            bio: userData.bio || '',
            skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : (userData.skills || ''),
            email: userData.email || '',
            location: userData.location || ''
          });
          
          // Update storage
          storage.setUser(userData);
          storage.setProfile(userData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setInitialLoad(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleEdit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API
      const updateData = {
        username: editForm.username.trim(),
        bio: editForm.bio.trim(),
        skills: editForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        email: editForm.email.trim(),
        location: editForm.location.trim()
      };

      // Validate required fields
      if (!updateData.username || !updateData.email) {
        setError('Username and email are required.');
        setLoading(false);
        return;
      }

      const result = await userAPI.updateProfile(updateData);
      
      if (result.data) {
        setSuccess('Profile updated successfully!');
        
        // Update form with response data
        const updatedData = result.data;
        setEditForm({
          username: updatedData.username || '',
          bio: updatedData.bio || '',
          skills: Array.isArray(updatedData.skills) ? updatedData.skills.join(', ') : '',
          email: updatedData.email || '',
          location: updatedData.location || ''
        });

        // Navigate back after a short delay
        setTimeout(() => {
          navigate("/tickets");
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelNavigate = () => {
    navigate("/tickets");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="border border-gray-600 rounded-lg w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={cancelNavigate}
            className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-xl font-medium">Edit Profile</h1>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <p className="text-center text-gray-400 mb-8">
          Update your personal details to keep your profile up-to-date
        </p>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {initialLoad && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">Loading profile...</span>
          </div>
        )}

        {!initialLoad && (
        <form className="space-y-6" onSubmit={handleEdit}>
          {/*-----Username Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Username *</label>
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Bio Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Bio</label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about yourself..."
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/*-----Skills Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Skills</label>
            <input
              type="text"
              name="skills"
              value={editForm.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js..."
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>

          {/*-----Email Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Email *</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/*-----Location Input-----*/}
          <div>
            <label className="block text-sm font-medium mb-3">Location</label>
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleChange}
              placeholder="City, Country"
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
        )}
      </div>
    </div>
  );
}

export default ProfilePage
