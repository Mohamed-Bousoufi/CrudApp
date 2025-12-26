// API URL - works with nginx proxy in Docker
const API_URL = '/api';

export const userApi = {
  // Get all users
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users/`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Get single user
  getUser: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // Create user
  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return true;
  },
};
