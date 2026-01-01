import { membersApi as api } from './apiConfig';

// Student API functions

// Get all students
export const getStudents = async () => {
  try {
    const response = await api.get('/students/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
};

// Get a single student by ID
export const getStudentById = async (id: string) => {
  try {
    const response = await api.get(`/students/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch student ${id}:`, error);
    throw error;
  }
};

// Create a student
export const createStudent = async (studentData: any) => {
  try {
    const response = await api.post('/students/', studentData);
    return response.data;
  } catch (error) {
    console.error('Failed to create student:', error);
    throw error;
  }
};

// Update a student (partial update)
export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await api.patch(`/students/${id}/`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    throw error;
  }
};

// Partial update a student
export const patchStudent = async (id: string, studentData: any) => {
  try {
    const response = await api.patch(`/students/${id}/`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Failed to patch student ${id}:`, error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id: string) => {
  try {
    const response = await api.delete(`/students/${id}/`);
    return response.data;
  } catch (error: any) {
    // Normalize backend HTML/500 errors into a user-friendly message so the UI
    // can present a concise warning instead of a raw stack trace.
    const status = error?.response?.status;
    const isHtml = error?.response?.headers?.['content-type']?.includes('text/html');
    // If resource is already gone, consider it a successful no-op
    if (status === 404) {
      return { ok: true, status };
    }

    const message =
      status && status >= 500
        ? `Delete failed on the server (${status}). Please try again later.`
        : isHtml
          ? 'Delete failed because the server returned an unexpected response.'
          : error?.response?.data?.error || error?.message || 'Failed to delete student.';

    console.error(`Failed to delete student ${id}:`, error);
    const friendlyError = new Error(message);
    // Preserve status for callers that need it
    // @ts-expect-error augmenting error with status for downstream checks
    friendlyError.status = status;
    throw friendlyError;
  }
};

// Add payment to a student
export const addPaymentToStudent = async (id: string, amount: number) => {
  try {
    const response = await api.post(`/students/${id}/add-payment/`, { amount });
    return response.data;
  } catch (error) {
    console.error(`Failed to add payment for student ${id}:`, error);
    throw error;
  }
};

// Add debt to a student
export const addDebtToStudent = async (id: string, amount: number) => {
  try {
    const response = await api.post(`/students/${id}/add-debt/`, { amount });
    return response.data;
  } catch (error) {
    console.error(`Failed to add debt for student ${id}:`, error);
    throw error;
  }
};
