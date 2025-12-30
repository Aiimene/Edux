import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/dashboard';

// Dashboard overview
export const getDashboardOverview = async (month?: number, year?: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/overview/`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    throw error;
  }
};

// Classes ranking
export const getClassesRanking = async (months?: number[], year?: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes-ranking/`, {
      params: { months: months?.join(','), year },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch classes ranking:', error);
    throw error;
  }
};

// Students evolvement
export const getStudentsEvolvement = async (months?: number[], year?: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students-evolvement/`, {
      params: { months: months?.join(','), year },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch students evolvement:', error);
    throw error;
  }
};

// Teachers ranking
export const getTeachersRanking = async (month?: number, year?: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teachers-ranking/`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers ranking:', error);
    throw error;
  }
};

// Weekly sessions
export const getWeeklySessions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weekly-sessions/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weekly sessions:', error);
    throw error;
  }
};
