import { dashboardApi as api } from './apiConfig';

// Dashboard overview
export const getDashboardOverview = async (month?: number, year?: number) => {
  try {
    const response = await api.get('/overview/', { params: { month, year } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    throw error;
  }
};

// Classes ranking
export const getClassesRanking = async (months?: number[], year?: number) => {
  try {
    const response = await api.get('/classes-ranking/', {
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
    const response = await api.get('/students-evolvement/', {
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
    const response = await api.get('/teachers-ranking/', { params: { month, year } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers ranking:', error);
    throw error;
  }
};

// Weekly sessions
export const getWeeklySessions = async () => {
  try {
    const response = await api.get('/weekly-sessions/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weekly sessions:', error);
    throw error;
  }
};
