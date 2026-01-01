import { academicApi, handleApiError } from './apiConfig';

// Get timetable
export const getTimetable = async (filters?: {
  level?: string;
  module?: string;
  teacher?: string;
}) => {
  try {
    const params: Record<string, any> = {};
    if (filters?.level && filters.level !== 'All') params.level = filters.level;
    if (filters?.module && filters.module !== 'All') params.module = filters.module;
    if (filters?.teacher && filters.teacher !== 'All') params.teacher = filters.teacher;

    const response = await academicApi.get('/timetable/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getTimetable');
  }
};


