import axios from 'axios';

// Align with backend members routes
const API_BASE_URL = 'http://127.0.0.1:8000/api/members';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add auth token to requests if available (support both authToken and access_token keys)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
  console.log('API Interceptor - Token available:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Adding Authorization header to request:', config.url);
  } else {
    console.warn('No token found in localStorage for request:', config.url);
  }
  return config;
});

// Get all parents
export const getParents = async () => {
  try {
    const response = await api.get('/parents/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch parents:', error);
    throw error;
  }
};

// Get a single parent
export const getParentById = async (id: string) => {
  try {
    const response = await api.get(`/parents/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch parent ${id}:`, error);
    throw error;
  }
};

// Create parent
export const createParent = async (parentData: any) => {
  try {
    const response = await api.post('/parents/', parentData);
    return response.data;
  } catch (error) {
    console.error('Failed to create parent:', error);
    throw error;
  }
};

// Update parent
export const updateParent = async (id: string, parentData: any) => {
  try {
    const response = await api.patch(`/parents/${id}/`, parentData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update parent ${id}:`, error);
    throw error;
  }
};

// Delete parent
export const deleteParent = async (id: string) => {
  try {
    const response = await api.delete(`/parents/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete parent ${id}:`, error);
    throw error;
  }
};
