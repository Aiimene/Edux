import { academicApi, handleApiError } from './apiConfig';

// Get attendance summary
export const getAttendanceSummary = async (filters?: {
  level?: string;
  module?: string;
  subject?: string;
  teacher?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params: Record<string, any> = {};
    if (filters?.level && filters.level !== 'All Levels') params.level = filters.level;
    if (filters?.module && filters.module !== 'All Modules') params.module = filters.module;
    if (filters?.subject && filters.subject !== 'All Subjects') params.subject = filters.subject;
    if (filters?.teacher && filters.teacher !== 'All Teachers') params.teacher = filters.teacher;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await academicApi.get('/attendances/summary/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getAttendanceSummary');
  }
};

// Get teachers attendance
export const getTeachersAttendance = async (filters?: {
  level?: string;
  module?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params: Record<string, any> = {};
    if (filters?.level && filters.level !== 'All Levels') params.level = filters.level;
    if (filters?.module && filters.module !== 'All Modules') params.module = filters.module;
    if (filters?.subject && filters.subject !== 'All Subjects') params.subject = filters.subject;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await academicApi.get('/attendances/teachers/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getTeachersAttendance');
  }
};

// Get students attendance
export const getStudentsAttendance = async (filters?: {
  level?: string;
  module?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params: Record<string, any> = {};
    if (filters?.level && filters.level !== 'All Levels') params.level = filters.level;
    if (filters?.module && filters.module !== 'All Modules') params.module = filters.module;
    if (filters?.subject && filters.subject !== 'All Subjects') params.subject = filters.subject;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await academicApi.get('/attendances/students/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getStudentsAttendance');
  }
};


