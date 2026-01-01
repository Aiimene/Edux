import { membersApi, handleApiError } from './apiConfig';

// Get all teachers
export const getTeachers = async () => {
  try {
    const response = await membersApi.get('/teachers/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getTeachers');
  }
};

// Get a single teacher
export const getTeacherById = async (id: string) => {
  try {
    const response = await membersApi.get(`/teachers/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getTeacherById');
  }
};

// Create teacher
export const createTeacher = async (teacherData: any) => {
  try {
    const response = await membersApi.post('/teachers/', teacherData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createTeacher');
  }
};

// Update teacher
export const updateTeacher = async (id: string, teacherData: any) => {
  try {
    const response = await membersApi.patch(`/teachers/${id}/`, teacherData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateTeacher');
  }
};

// Delete teacher
export const deleteTeacher = async (id: string) => {
  try {
    const response = await membersApi.delete(`/teachers/${id}/`);
    return response.data;
  } catch (error: any) {
    // If resource is already gone, consider it a successful no-op
    if (error?.status === 404) {
      return { ok: true, status: 404 };
    }
    throw handleApiError(error, 'deleteTeacher');
  }
};
