
import React, { useState, useEffect } from 'react'
import { Plus, User, LogOut, Filter, Clock, AlertCircle, CheckCircle, Calendar, Tag, MessageSquare, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { LogoutBtn } from '../components/LogoutBtn.jsx'
import { AdminBtn } from '../components/AdminBtn.jsx'
import { Profile } from './profile-page/Profile.jsx'
import storage from '../utils/localStorage.js'
import { ticketAPI } from '../utils/api.js'

const TicketPage = () => {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'open': <AlertCircle className="w-4 h-4" />,
      'in-progress': <Clock className="w-4 h-4" />,
      'resolved': <CheckCircle className="w-4 h-4" />,
      'active': <AlertCircle className="w-4 h-4" /> // Backend uses 'active' for open
    };
    return icons[status] || <MessageSquare className="w-4 h-4" />;
  };

  // Fetch tickets from API
  const fetchTickets = async () => {
    if (!storage.isAuthenticated()) {
      setError('Please login to continue.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ticketAPI.getAllTickets();
      console.log("response", response)

      // Transform tickets to match UI expectations
      const transformedTickets = response.data(ticket => ({
        id: ticket._id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status === 'active' ? 'open' : ticket.status,
        priority: ticket.priority || 'medium',
        createdAt: new Date(ticket.createdAt).toLocaleDateString(),
        assignee: ticket.assignedTo?.username || 'Unassigned',
        tags: ticket.relatedSkills ? ticket.relatedSkills.split(',').map(s => s.trim()) : [],
        createdBy: ticket.createdBy
      })) || [];
      console.log(transformedTickets);

      setTickets(transformedTickets);
      setSuccess('Tickets loaded successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError(error.message || 'Failed to fetch tickets');

      // Try to load from cache if available
      const cachedTickets = storage.getCachedTickets();
      if (cachedTickets && cachedTickets.length > 0) {
        setTickets(cachedTickets);
        setSuccess('Loaded from cache due to network error');
        setTimeout(() => setSuccess(''), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new ticket
  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ticketAPI.createTicket({
        title: newTicket.title.trim(),
        description: newTicket.description.trim()
      });

      setSuccess('Ticket created successfully! Processing has been started.');
      setNewTicket({ title: '', description: '' });
      setShowCreateForm(false);

      //----------Refresh tickets list----------//
      await fetchTickets();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(error.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on selected filter
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  // Load current user and tickets on component mount
  useEffect(() => {
    const loadUserAndTickets = async () => {
      try {
        const userData = storage.getUser();
        setCurrentUser(userData);
        await fetchTickets();
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load user data');
      }
    };

    loadUserAndTickets();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border border-gray-700 rounded-lg mx-4 my-4 min-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">superagent</h1>

          <div className="flex items-center gap-4">
            <button
              className="rounded-lg px-4 py-2 text-sm "
            >
              <AdminBtn>
                Admin
              </AdminBtn>
            </button>

            <div
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Profile>
                <User className="w-5 h-5" />
              </Profile>
            </div>
          </div>
        </div>

        <div className="p-6">
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
          {/* {loading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-400">loading...</span>
            </div>
          )} */}

          {/*----------Create Ticket Section---------*/}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create Ticket</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
                {/* {showCreateForm ? 'Cancel' : 'New Ticket'} */}
              </button>
            </div>

            {showCreateForm && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Title:"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Description"
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={loading}
                  />
                </div>

                <button
                  // onClick={handleCreateTicket}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            )}
          </div>

          {/*----------All Tickets----------*/}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">All Tickets</h2>
                <button
                  // onClick={fetchTickets}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={loading}
                  title="Refresh tickets"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <select
                  // value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <span className="text-sm text-gray-400">{filteredTickets.length} tickets</span>
              </div>
            </div>

            {tickets.length === 0 && !loading ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No tickets found</p>
                <p className="text-gray-500">Create your first ticket to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                            {/* {getStatusIcon(ticket.status)}
                          {ticket.status.replace('-', ' ')} */}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {/* {ticket.priority} priority */}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-3">
                          {/* {ticket.description} */}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>created:
                              {/* {ticket.createdAt} */}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>assigned To:
                              {/* {ticket.assignee} */}
                            </span>
                          </div>
                        </div>

                        {ticket.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {ticket.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 pt-0">
          <button
            className="flex items-center gap-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <LogoutBtn>
              Logout
            </LogoutBtn>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicketPage;