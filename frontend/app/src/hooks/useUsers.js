import useSWR, { useSWRConfig } from 'swr';
import { userApi } from '@/services/api';

const USERS_QUERY_KEY = '/users/';

export const useUsers = () => {
  const { data, error, isLoading } = useSWR(USERS_QUERY_KEY, userApi.getAll);
  return {
    data,
    error,
    isLoading,
  };
};

export const useUser = (id) => {
  const { data, error, isLoading } = useSWR(
    id ? `/user/${id}/` : null,
    () => userApi.getById(id)
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
    mutate(USERS_QUERY_KEY);
    return result;
  };

  return { mutate: updateUser };
};

export const useDeleteUser = () => {
  const { mutate } = useSWRConfig();
  
  const deleteUser = async (id) => {
    const result = await userApi.delete(id);
    mutate(USERS_QUERY_KEY);
    return result;
  };

  return { mutate: deleteUser };
};
