import React, { useState } from 'react'
import { Plus, User, LogOut, Filter, Clock, AlertCircle, CheckCircle, Calendar, Tag, MessageSquare } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { LogoutBtn } from '../components/LogoutBtn.jsx'
import { Profile } from '../components/profile-page/Profile.jsx'
import { AdminBtn } from '../components/AdminBtn.jsx'

const TicketPage = () => {
  const [newTicket, setNewTicket] = useState(
    {
      title: '',
      description: ''
    }
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Sample data for UI display
  const sampleTickets = [
    {
      id: 1,
      title: 'help in javascript',
      description: 'Need help in frontend for react',
      status: 'open',
      priority: 'medium',
      createdAt: '2025-03-05, 09:50pm',
      assignee: 'John Doe',
      tags: ['frontend', 'react', 'javascript']
    },
    {
      id: 2,
      title: 'Database connection issue',
      description: 'Unable to connect to production database. Getting timeout errors consistently.',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2025-03-04, 02:30pm',
      assignee: 'Sarah Wilson',
      tags: ['database', 'production', 'urgent']
    },
    {
      id: 3,
      title: 'UI component not responsive',
      description: 'The header component breaks on mobile devices. Need responsive design fixes.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2025-03-03, 11:15am',
      assignee: 'Mike Chen',
      tags: ['ui', 'responsive', 'mobile']
    }
  ];

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
      'resolved': <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <MessageSquare className="w-4 h-4" />;
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
          {/* Create Ticket Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create Ticket</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showCreateForm ? 'Cancel' : 'New Ticket'}
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
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Description"
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={() => {
                    // Add your create ticket logic here
                    console.log('Create ticket:', newTicket);
                  }}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors"
                >
                  create
                </button>
              </div>
            )}
          </div>

          {/* All Tickets */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Tickets</h2>
              <span className="text-sm text-gray-400">{sampleTickets.length} tickets</span>
            </div>

            <div className="space-y-4">
              {sampleTickets.map((ticket) => (
                <div key={ticket.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status.replace('-', ' ')}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} priority
                        </span>
                      </div>

                      <p className="text-gray-300 mb-3">{ticket.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>created: {ticket.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>assigned To: {ticket.assignee}</span>
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