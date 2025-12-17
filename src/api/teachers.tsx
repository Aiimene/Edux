import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/dashboard';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add JWT token to every request if available (support both authToken and access_token keys)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all teachers
export const getTeachers = async () => {
  try {
    const response = await api.get('/teachers/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    throw error;
  }
};

// Get a single teacher
export const getTeacherById = async (id: string) => {
  try {
    const response = await api.get(`/teachers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch teacher ${id}:`, error);
    throw error;
  }
};

// Create teacher
export const createTeacher = async (teacherData: any) => {
  try {
    const response = await api.post('/teachers/', teacherData);
    return response.data;
  } catch (error) {
    console.error('Failed to create teacher:', error);
    throw error;
  }
};

// Update teacher
export const updateTeacher = async (id: string, teacherData: any) => {
  try {
    const response = await api.patch(`/teachers/${id}/`, teacherData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update teacher ${id}:`, error);
    throw error;
  }
};

// Delete teacher
export const deleteTeacher = async (id: string) => {
  try {
    const response = await api.delete(`/teachers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete teacher ${id}:`, error);
    throw error;
  }
};
