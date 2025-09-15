import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowLeft, Edit3, Trash2, Plus, Filter, Eye, EyeOff, Users, UserCheck, UserX, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import storage from '../utils/localStorage.js';
import { userAPI } from '../utils/api.js';

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch all users from backend
  const fetchAllUsers = async () => {
    // Check authentication first
    if (!storage.isAuthenticated()) {
      setError('Please login to continue.');
      navigate('/login');
      return;
    }

    // Check if user is admin
    const userRole = storage.getUserRole();
    if (userRole !== 'admin') {
      setError('Access denied. Admin privileges required.');
      navigate('/tickets');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Try to load from cache first
      const cachedUsers = storage.getCachedUsers();
      if (cachedUsers) {
        const usersWithStatus = cachedUsers.map(user => ({
          ...user,
          id: user._id || user.id,
          status: user.status || 'active'
        }));
        setUsers(usersWithStatus);
      }

      // Fetch fresh data from API
      const userData = await userAPI.getAllUsers();
      
      // Add status field to users (for UI purposes)
      const usersWithStatus = userData.map(user => ({
        ...user,
        id: user._id || user.id,
        status: user.status || 'active' // Default status since backend doesn't have this field yet
      }));
      
      setUsers(usersWithStatus);
      setSuccess('Users loaded successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      
      // If we have cached data and there's a network error, show cache notice
      const cachedUsers = storage.getCachedUsers();
      if (cachedUsers && cachedUsers.length > 0) {
        setSuccess('Loaded from cache due to network error');
        setTimeout(() => setSuccess(''), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, filterStatus, filterRole]);

  const handleEditUser = (user) => {
    setEditingUser({ ...user, skillsText: user.skills.join(', ') });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      const updateData = {
        username: editingUser.username,
        email: editingUser.email,
        skills: editingUser.skillsText.split(',').map(s => s.trim()).filter(s => s),
        role: editingUser.role
      };
      
      // Use the new API utility - note: this might need backend changes for admin updates
      const result = await userAPI.updateProfile(updateData);
      
      if (result.data) {
        const updatedUsers = users.map(user =>
          user.id === editingUser.id
            ? {
              ...editingUser,
              skills: updateData.skills
            }
            : user
        );
        
        setUsers(updatedUsers);
        
        // Update localStorage cache
        storage.setCachedUsers(updatedUsers);
        
        setSuccess('User updated successfully');
        setEditingUser(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      // TODO: Implement delete user API call when backend supports it
      // await userAPI.deleteUser(userId);
      
      // For now, just remove from local state
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      storage.setCachedUsers(updatedUsers);
      
      setSuccess('User removed from view (API not implemented yet)');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      );
      setUsers(updatedUsers);
      storage.setCachedUsers(updatedUsers);
      
      // TODO: Update status on backend when API supports it
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-500'
      : 'bg-gray-400';
  };

  const getStatsCount = (type) => {
    switch (type) {
      case 'total': return users.length;
      case 'active': return users.filter(u => u.status === 'active').length;
      case 'inactive': return users.filter(u => u.status === 'inactive').length;
      default: return 0;
    }
  };

  const backNavigate = () => {
    navigate("/tickets");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}
          
          <button
            onClick={backNavigate}
            className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-400">Manage users and their permissions</p>
          
          {loading && (
            <div className="flex items-center gap-2 mt-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-400">Loading...</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{getStatsCount('total')}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{getStatsCount('active')}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive Users</p>
                <p className="text-2xl font-bold text-red-400">{getStatsCount('inactive')}</p>
              </div>
              <UserX className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by email or skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium">{user.email}</span>
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></span>
                    <span className="text-sm text-gray-400 capitalize">{user.status}</span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm text-gray-400">Role: </span>
                    <span className="text-blue-400 font-medium capitalize">{user.role}</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm text-gray-400">Username: </span>
                    <span className="text-gray-300">{user.username}</span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-400">Skills: </span>
                    {user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">No skills listed</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`p-2 rounded-lg transition-colors ${user.status === 'active'
                      ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                      : 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                      }`}
                    title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                  >
                    {user.status === 'active' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors"
                    title="Edit user"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={editingUser.skillsText}
                    onChange={(e) => setEditingUser({ ...editingUser, skillsText: e.target.value })}
                    placeholder="javascript, react, nodejs"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}