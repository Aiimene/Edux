import { academicApi as api } from './apiConfig';

// Levels
export const getLevels = async () => {
  try {
    const response = await api.get('/levels/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch levels:', error);
    throw error;
  }
};

export const getLevelById = async (id: string) => {
  try {
    const response = await api.get(`/levels/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch level ${id}:`, error);
    throw error;
  }
};

export const createLevel = async (levelData: any) => {
  try {
    const response = await api.post('/levels/', levelData);
    return response.data;
  } catch (error) {
    console.error('Failed to create level:', error);
    throw error;
  }
};

export const updateLevel = async (id: string, levelData: any) => {
  try {
    const response = await api.patch(`/levels/${id}/`, levelData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update level ${id}:`, error);
    throw error;
  }
};

export const deleteLevel = async (id: string) => {
  try {
    const response = await api.delete(`/levels/${id}/`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const isHtml = error?.response?.headers?.['content-type']?.includes('text/html');
    if (status === 404) {
      return { ok: true, status };
    }
    const backendError = error?.response?.data?.error;
    const coursesCount = error?.response?.data?.courses_count;
    let message = 'Failed to delete level.';
    if (backendError) {
      message = backendError;
      if (coursesCount) message += ` (Courses: ${coursesCount})`;
    } else if (status && status >= 500) {
      message = `Delete failed on the server (${status}). Please try again later.`;
    } else if (isHtml) {
      message = 'Delete failed because the server returned an unexpected response.';
    } else if (error?.message) {
      message = error.message;
    }
    console.error(`Failed to delete level ${id}:`, error);
    const friendlyError = new Error(message);
    // @ts-expect-error augmenting error with status
    friendlyError.status = status;
    throw friendlyError;
  }
};

// Modules (Courses) - Backend registered as /modules/
export const getCourses = async (levelId?: string) => {
  try {
    const url = levelId ? `/modules/?level=${levelId}` : '/modules/';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch course ${id}:`, error);
    throw error;
  }
};

export const createModule = async (moduleData: any) => {
  try {
    const response = await api.post('/modules/', moduleData);
    return response.data;
  } catch (error) {
    console.error('Failed to create module:', error);
    throw error;
  }
};

// Preferred endpoint: add a module directly to a level
export const addModuleToLevel = async (levelId: string, moduleData: { name: string; description?: string; price_per_session?: number; order?: number; }) => {
  try {
    const response = await api.post(`/levels/${levelId}/modules/`, moduleData);
    return response.data;
  } catch (error) {
    console.error(`Failed to add module to level ${levelId}:`, error);
    throw error;
  }
};

export const deleteModule = async (moduleId: string) => {
  try {
    const response = await api.delete(`/modules/${moduleId}/`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const backendError = error?.response?.data?.error;
    let message = 'Failed to delete module.';
    if (backendError) message = backendError;
    console.error(`Failed to delete module ${moduleId}:`, error);
    const friendlyError = new Error(message);
    // @ts-expect-error attach status
    friendlyError.status = status;
    throw friendlyError;
  }
};

export const createCourse = async (courseData: any) => {
  try {
    const response = await api.post('/courses/', courseData);
    return response.data;
  } catch (error) {
    console.error('Failed to create course:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: any) => {
  try {
    const response = await api.patch(`/courses/${id}/`, courseData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update course ${id}:`, error);
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await api.delete(`/courses/${id}/`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const isHtml = error?.response?.headers?.['content-type']?.includes('text/html');
    if (status === 404) {
      return { ok: true, status };
    }
    const backendError = error?.response?.data?.error;
    const activeSessions = error?.response?.data?.active_sessions;
    let message = 'Failed to delete course.';
    if (backendError) {
      message = backendError;
      if (activeSessions) message += ` (Active sessions: ${activeSessions})`;
    } else if (status && status >= 500) {
      message = `Delete failed on the server (${status}). Please try again later.`;
    } else if (isHtml) {
      message = 'Delete failed because the server returned an unexpected response.';
    } else if (error?.message) {
      message = error.message;
    }
    console.error(`Failed to delete course ${id}:`, error);
    const friendlyError = new Error(message);
    // @ts-expect-error augmenting error with status
    friendlyError.status = status;
    throw friendlyError;
  }
};
