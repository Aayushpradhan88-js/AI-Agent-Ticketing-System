import storage from './localStorage.js';

//----------API CLIENT----------//
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    this.defaultTimeout = 10000; //-----10 seconds-----//
  }

  //-----Get authorization headers-----//
  getAuthHeaders() {
    const token = storage.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Make authenticated request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
      timeout: this.defaultTimeout,
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if token is expired based on response
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.message?.includes('token') || errorData.message?.includes('Unauthorized')) {
          storage.clearUserData();
          window.location.href = '/login';
          throw new Error('Authentication expired. Please login again.');
        }
      }

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    const response = await this.makeRequest(endpoint, { method: 'GET' });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // POST request
  async post(endpoint, data = {}) {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // PUT request
  async put(endpoint, data = {}) {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // DELETE request
  async delete(endpoint) {
    const response = await this.makeRequest(endpoint, { method: 'DELETE' });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Upload file
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': storage.getToken() ? `Bearer ${storage.getToken()}` : '',
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

//----------API endpoints----------//

//----------USER END-POINTS----------//
class UserAPI extends ApiClient {
  // Authentication
  async register(userData) {
    return this.post('/api/v1/auth/register', userData);
  }

  async login(credentials) {
    const result = await this.post('/api/v1/auth/login', credentials);
    
    // Store user data and token after successful login
    if (result.token) {
      storage.setToken(result.token);
      storage.setUser(result.user);
    }
    
    return result;
  }

  async logout() {
    try {
      await this.post('/api/v1/auth/logout');
    } finally {
      // Clear local storage regardless of server response
      storage.clearUserData();
    }
  }

  // Profile management
  async getProfile() {
    return this.get('/api/v1/auth/me');
  }

  async updateProfile(profileData) {
    const result = await this.post('/api/v1/auth/update-account', profileData);
    
    // Update cached user data
    if (result.data) {
      storage.setUser(result.data);
      storage.setProfile(result.data);
    }
    
    return result;
  }

  // Admin operations
  async getAllUsers() {
    const users = await this.get('/api/v1/auth/get-users-account');
    
    // Cache users data for admin
    storage.setCachedUsers(users);
    
    return users;
  }

  async adminUpdateUser(userId, userData) {
    return this.put(`/api/v1/auth/admin/user/${userId}`, userData);
  };

  async adminDeleteUser(userId) {
    return this.delete(`/api/v1/auth/admin/user/${userId}`);
  }

  async adminToggleUserStatus(userId, status) {
    return this.patch(`/api/v1/auth/admin/user/${userId}/status`, { status });
  }
}

class OnBoardingAPI extends ApiClient {
  async onBoarding(options) {
    return this.post('/api/v1/auth/onBoarding', options);
  }
}

//----------TICKET END-POINTS----------//
class TicketAPI extends ApiClient {
  //-----Ticket operations-----//

  //-----Get All Tickets-----//....
  async getAllTickets() {
    const tickets = await this.get('/api/v1/tickets/get-all-tickets');
    
    //-----Cache tickets data-----//
    storage.setCachedTickets(tickets);
    
    return tickets;
  }

  async getTicket(ticketId) {
    return this.get(`/api/v1/tickets/get-ticket/${ticketId}`);
  }

  async createTicket(ticketData) {
    return this.post('/api/v1/tickets/create-ticket', ticketData);
  }

  async updateTicket(ticketId, ticketData) {
    return this.put(`/api/v1/tickets/update-ticket/${ticketId}`, ticketData);
  }

  async deleteTicket(ticketId) {
    return this.delete(`/api/v1/tickets/delete-ticket/${ticketId}`);
  }

  async assignTicket(ticketId, assigneeId) {
    return this.post(`/api/v1/tickets/assign-ticket`, { ticketId, assigneeId });
  }

  async updateTicketStatus(ticketId, status) {
    return this.patch(`/api/v1/tickets/admin/status/${ticketId}`, { status });
  }

  async adminAssignTicket(ticketId, assigneeId) {
    return this.post(`/api/v1/tickets/admin/assign/${ticketId}`, { assigneeId });
  }

  async adminDeleteTicket(ticketId) {
    return this.delete(`/api/v1/tickets/admin/delete/${ticketId}`);
  }

  async adminUpdateTicketStatus(ticketId, status) {
    return this.patch(`/api/v1/tickets/admin/status/${ticketId}`, { status });
  }
}

//----------Create singleton instances----------//
const userAPI = new UserAPI();
const ticketAPI = new TicketAPI();

export { userAPI, ticketAPI, UserAPI, TicketAPI, ApiClient };
export default { user: userAPI, ticket: ticketAPI };
