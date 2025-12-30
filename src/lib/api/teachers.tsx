import { membersApi as api } from './apiConfig';

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
  } catch (error: any) {
    // Normalize backend HTML/500 errors into a user-friendly message
    const status = error?.response?.status;
    const isHtml = error?.response?.headers?.['content-type']?.includes('text/html');
    
    // If resource is already gone, consider it a successful no-op
    if (status === 404) {
      return { ok: true, status };
    }

    // Extract structured backend validation errors (e.g., active classes, enrolled students)
    const backendError = error?.response?.data?.error;
    const activeClasses = error?.response?.data?.active_classes;
    const enrolledStudents = error?.response?.data?.enrolled_students;

    let message = 'Failed to delete teacher.';
    
    if (backendError) {
      message = backendError;
      if (activeClasses) message += ` (Active classes: ${activeClasses})`;
      if (enrolledStudents) message += ` (Enrolled students: ${enrolledStudents})`;
    } else if (status && status >= 500) {
      message = `Delete failed on the server (${status}). Please try again later.`;
    } else if (isHtml) {
      message = 'Delete failed because the server returned an unexpected response.';
    } else if (error?.message) {
      message = error.message;
    }

    console.error(`Failed to delete teacher ${id}:`, error);
    const friendlyError = new Error(message);
    // Preserve status for callers that need it
    // @ts-expect-error augmenting error with status for downstream checks
    friendlyError.status = status;
    throw friendlyError;
  }
};
