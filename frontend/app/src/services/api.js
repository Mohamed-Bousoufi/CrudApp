// API URL - works with nginx proxy in Docker
const API_URL = '/api';

export const userApi = {
  // Get all users
  async getUsers() {
    const response = await fetch(`${API_URL}/users/`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Get single user
  async getUser(id) {
    const response = await fetch(`${API_URL}/users/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // Create user
  async createUser(userData) {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.email?.[0] || 'Failed to create user');
    }
    return response.json();
  },

  // Update user
  async updateUser(id, userData) {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.email?.[0] || 'Failed to update user');
    }
    return response.json();
  },

  // Delete user
  async deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return true;
  },
};
