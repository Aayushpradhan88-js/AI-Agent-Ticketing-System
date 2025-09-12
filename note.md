import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {useNavigate } from 'react-router-dom'

import BackBtn from '../components/BackBtn.jsx';

const ProfilePage = () => {
const [editForm, setEditForm] = useState(
{
username: '',
bio: '',
skills: '',
email: '',
location: ''
}
);

const handleInputChange = (field, value) => {
setProfileData(prev => ({
...prev,
[field]: value
}));
};

return (
<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
<div className="border border-gray-600 rounded-lg w-full max-w-2xl p-8">
<div className="flex items-center justify-between mb-8">
<button
onClick={() => {

            }}
            className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-xl font-medium">Edit Profile</h1>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <p className="text-center text-gray-400 mb-12">
          update your personal details to keep your profile up-to-date
        </p>

{/_----------- Profile Edit Form---------- _/}
<form className="space-y-8">
{/_-----Username Input-----_/}
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
        </div>

        <div className="flex items-center gap-4 mt-12">
          <button
            type="submit"
              disabled={loading}
            className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg transition-colors font-medium"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <button
          type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            cancel
          </button>
        </div>
        </form>
      </div>
    </div>

);
}
