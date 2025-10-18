// localStorage utility for centralized data management
class LocalStorageManager {
  constructor() {
    this.prefix = 'ticketing_';
    this.defaultExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Set item with optional expiration
  setItem(key, value, expiry = null) {
    try {
      const now = Date.now();
      const item = {
        value,
        timestamp: now,
        expires: expiry ? now + expiry : now + this.defaultExpiry
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }

  // Get item with expiration check
  getItem(key) {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      //-----Check if item is expired-----//
      if (item.expires && now > item.expires) {
        this.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      this.removeItem(key); // Remove corrupted item
      return null;
    }
  }

  // Remove item
  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  // Check if item exists and is not expired
  hasItem(key) {
    return this.getItem(key) !== null;
  }

  // Clear all items with our prefix
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Get item info including metadata
  getItemInfo(key) {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;
      return JSON.parse(itemStr);
    } catch (error) {
      console.error('Error getting localStorage item info:', error);
      return null;
    }
  }
}

// User-specific methods
class UserStorageManager extends LocalStorageManager {
  //-----Set user token with longer expiry-----//
  setToken(token) {
    return this.setItem('token', token, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  getToken() {
    return this.getItem('token');
  }

  //-----Set user data-----//
  setUser(userData) {
    return this.setItem('user', userData);
  }

  getUser() {
    return this.getItem('user');
  }

  // Set profile data
  setProfile(profileData) {
    return this.setItem('profile', profileData);
  }

  getProfile() {
    return this.getItem('profile');
  }

  // Cache users list for admin
  setCachedUsers(users, customExpiry = 5 * 60 * 1000) { // 5 minutes default
    return this.setItem('cached_users', users, customExpiry);
  }

  getCachedUsers() {
    return this.getItem('cached_users');
  }

  // Cache tickets
  setCachedTickets(tickets, customExpiry = 10 * 60 * 1000) { // 10 minutes default
    return this.setItem('cached_tickets', tickets, customExpiry);
  }

  getCachedTickets() {
    return this.getItem('cached_tickets');
  }

  // Set user preferences
  setPreferences(preferences) {
    return this.setItem('preferences', preferences, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  getPreferences() {
    return this.getItem('preferences') || {
      theme: 'dark',
      language: 'en',
      notifications: true
    };
  }

  // Clear all user-related data (for logout)
  clearUserData() {
    this.removeItem('token');
    this.removeItem('user');
    this.removeItem('profile');
    this.removeItem('cached_users');
    this.removeItem('cached_tickets');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check JWT token expiration
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.exp * 1000 > Date.now();
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
      this.removeItem('token');
      return false;
    }

    return false;
  }

  // Get user role from token
  getUserRole() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.role;
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return null;
  }

  // Get user ID from token
  getUserId() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload._id;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }

    return null;
  }
}

// Create singleton instance
const storage = new UserStorageManager();

export default storage; 
export { LocalStorageManager, UserStorageManager };