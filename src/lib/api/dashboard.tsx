import { createApiInstance, handleApiError, API_BASE_URLS } from './apiConfig';

// Create dashboard API instance
const dashboardApi = createApiInstance(API_BASE_URLS.DASHBOARD);

// Dashboard overview
export const getDashboardOverview = async (month?: number, year?: number) => {
  try {
    const response = await dashboardApi.get('/overview/', {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Dashboard Overview');
  }
};

// Classes ranking
export const getClassesRanking = async (months?: number[], year?: number) => {
  try {
    const response = await dashboardApi.get('/classes-ranking/', {
      params: { months: months?.join(','), year },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Classes Ranking');
  }
};

// Students evolvement
export const getStudentsEvolvement = async (months?: number[], year?: number) => {
  try {
    const response = await dashboardApi.get('/students-evolvement/', {
      params: { months: months?.join(','), year },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Students Evolvement');
  }
};

// Teachers ranking
export const getTeachersRanking = async (month?: number, year?: number) => {
  try {
    const response = await dashboardApi.get('/teachers-ranking/', {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Teachers Ranking');
  }
};

// Weekly sessions
export const getWeeklySessions = async () => {
  try {
    const response = await dashboardApi.get('/weekly-sessions/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Weekly Sessions');
  }
};

// Analytics data with filters
export const getAnalytics = async (filters?: {
  level?: string;
  module?: string;
  subject?: string;
  teacher?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params: Record<string, string> = {};
    
    // Only include non-empty, non-"All" filters (matching backend expectations)
    if (filters?.level && filters.level.trim() !== '' && 
        filters.level !== 'All Levels' && filters.level !== 'All') {
      params.level = filters.level.trim();
    }
    if (filters?.module && filters.module.trim() !== '' && 
        filters.module !== 'All Modules' && filters.module !== 'All') {
      params.module = filters.module.trim();
    }
    if (filters?.subject && filters.subject.trim() !== '' && 
        filters.subject !== 'All Subjects' && filters.subject !== 'All') {
      params.subject = filters.subject.trim();
    }
    if (filters?.teacher && filters.teacher.trim() !== '' && 
        filters.teacher !== 'All Teachers' && filters.teacher !== 'All') {
      params.teacher = filters.teacher.trim();
    }
    // Date format: YYYY-MM-DD (backend expects this format)
    if (filters?.startDate && filters.startDate.trim() !== '') {
      params.startDate = filters.startDate.trim();
    }
    if (filters?.endDate && filters.endDate.trim() !== '') {
      params.endDate = filters.endDate.trim();
    }

    const response = await dashboardApi.get('/analytics/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Get Analytics');
  }
};
