import { academicApi as api } from './apiConfig';

// Sessions
export const getSessions = async (filters?: { status?: string; teacher?: string; day?: string }) => {
  try {
    let url = '/sessions/';
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.teacher) params.append('teacher', filters.teacher);
    if (filters?.day) params.append('day', filters.day);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    throw error;
  }
};

export const getSessionById = async (id: string) => {
  try {
    const response = await api.get(`/sessions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch session ${id}:`, error);
    throw error;
  }
};

export const createSession = async (sessionData: any) => {
  try {
    const response = await api.post('/sessions/', sessionData);
    return response.data;
  } catch (error) {
    const status = (error as any)?.response?.status;
    const data = (error as any)?.response?.data;
    let message = 'Failed to create session';
    if (data?.error) {
      message = data.error;
    } else if (data && typeof data === 'object') {
      const parts: string[] = [];
      for (const key of Object.keys(data)) {
        const val = Array.isArray(data[key]) ? data[key].join(', ') : String(data[key]);
        parts.push(`${key}: ${val}`);
      }
      if (parts.length) message = parts.join(' | ');
    } else if ((error as any)?.message) {
      message = (error as any).message;
    }
    const friendlyError = new Error(message);
    // @ts-expect-error attach status
    friendlyError.status = status;
    throw friendlyError;
  }
};

export const updateSession = async (id: string, sessionData: any) => {
  try {
    const response = await api.patch(`/sessions/${id}/`, sessionData);
    return response.data;
  } catch (error) {
    const status = (error as any)?.response?.status;
    const data = (error as any)?.response?.data;
    let message = 'Failed to update session';
    if (data?.error) {
      message = data.error;
    } else if (data && typeof data === 'object') {
      const parts: string[] = [];
      for (const key of Object.keys(data)) {
        const val = Array.isArray(data[key]) ? data[key].join(', ') : String(data[key]);
        parts.push(`${key}: ${val}`);
      }
      if (parts.length) message = parts.join(' | ');
    } else if ((error as any)?.message) {
      message = (error as any).message;
    }
    const friendlyError = new Error(message);
    // @ts-expect-error attach status
    friendlyError.status = status;
    throw friendlyError;
  }
};

export const deleteSession = async (id: string) => {
  try {
    const response = await api.delete(`/sessions/${id}/`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const isHtml = error?.response?.headers?.['content-type']?.includes('text/html');
    if (status === 404) {
      return { ok: true, status };
    }
    const backendError = error?.response?.data?.error;
    const enrolledStudents = error?.response?.data?.enrolled_students;
    let message = 'Failed to delete session.';
    if (backendError) {
      message = backendError;
      if (enrolledStudents) message += ` (Enrolled students: ${enrolledStudents})`;
    } else if (status && status >= 500) {
      message = `Delete failed on the server (${status}). Please try again later.`;
    } else if (isHtml) {
      message = 'Delete failed because the server returned an unexpected response.';
    } else if (error?.message) {
      message = error.message;
    }
    console.error(`Failed to delete session ${id}:`, error);
    const friendlyError = new Error(message);
    // @ts-expect-error augmenting error with status
    friendlyError.status = status;
    throw friendlyError;
  }
};

export const enrollStudent = async (sessionId: string, studentId: string) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/enroll-student/`, {
      student_id: studentId,
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.message || 'Failed to enroll student';
    throw new Error(message);
  }
};

export const unenrollStudent = async (sessionId: string, studentId: string) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/unenroll-student/`, {
      student_id: studentId,
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.message || 'Failed to unenroll student';
    throw new Error(message);
  }
};
