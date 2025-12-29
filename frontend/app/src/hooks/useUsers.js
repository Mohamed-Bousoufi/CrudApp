import useSWR, { useSWRConfig } from 'swr';
import { userApi } from '@/services/api';

// Helper to handle unauthorized responses
function handleUnauthorized(response) {
  if (response.status === 401) {
    window.location.href = '/login'; // Redirect to login page
    return true;
  }
  return false;
}

const USERS_QUERY_KEY = '/users/';

export const useUsers = () => {
  const { data, error, isLoading } = useSWR(USERS_QUERY_KEY, async () => {
    const response = await userApi.getAll();
    if (handleUnauthorized(response)) return null;
    return response;
  });
  return {
    data,
    error,
    isLoading,
  };
};

export const useUser = (id) => {
  const { data, error, isLoading } = useSWR(
    id ? `/user/${id}/` : null,
    async () => {
      const response = await userApi.getById(id);
      if (handleUnauthorized(response)) return null;
      return response;
    }
  );
  return {
    data,
    error,
    isLoading,
  };
};

export const useCreateUser = () => {
  const { mutate } = useSWRConfig();

  const createUser = async (userData) => {
    const token = localStorage.getItem("token");
    const response = await fetch('/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });
    if (handleUnauthorized(response)) return null;
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || JSON.stringify(errorData));
    }
    mutate(USERS_QUERY_KEY);
    return response.json();
  };

  return { mutate: createUser };
};

export const useUpdateUser = () => {
  const { mutate } = useSWRConfig();

  const updateUser = async ({ id: userId, data: userData }) => {
    const result = await userApi.update(userId, userData);
    if (result && result.status === 401) {
      window.location.href = '/login';
      return null;
    }
    mutate(USERS_QUERY_KEY);
    return result;
  };

  return { mutate: updateUser };
};

export const useDeleteUser = () => {
  const { mutate } = useSWRConfig();
  
  const deleteUser = async (id) => {
    const result = await userApi.delete(id);
    if (result && result.status === 401) {
      window.location.href = '/login';
      return null;
    }
    mutate(USERS_QUERY_KEY);
    return result;
  };

  return { mutate: deleteUser };
};
