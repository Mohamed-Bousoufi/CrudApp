const API_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function withAuthHeaders(headers = {}) {
  return { ...headers, ...getAuthHeaders() };
}

export const userApi = {
  // Get all users
  getAll: async () => {
    const response = await fetch(`${API_URL}/users/`, {
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Get single user
  getById: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Create user
  create: async (userData) => {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // Update user
  update: async (id, userData) => {
    console.log("API - Updating user:", id, userData);
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'PUT',
      headers: withAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // Delete user
  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};
