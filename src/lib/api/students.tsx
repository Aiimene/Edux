import { membersApi, handleApiError } from './apiConfig';

// Student API functions

// Get all students
export const getStudents = async () => {
  try {
    const response = await membersApi.get('/students/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getStudents');
  }
};

// Get a single student by ID
export const getStudentById = async (id: string) => {
  try {
    const response = await membersApi.get(`/students/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getStudentById');
  }
};

// Create a student
export const createStudent = async (studentData: any) => {
  try {
    const response = await membersApi.post('/students/', studentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createStudent');
  }
};

// Update a student (partial update)
export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await membersApi.patch(`/students/${id}/`, studentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateStudent');
  }
};

// Partial update a student
export const patchStudent = async (id: string, studentData: any) => {
  try {
    const response = await membersApi.patch(`/students/${id}/`, studentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'patchStudent');
  }
};

// Delete a student
export const deleteStudent = async (id: string) => {
  try {
    const response = await membersApi.delete(`/students/${id}/`);
    return response.data;
  } catch (error: any) {
    // If resource is already gone, consider it a successful no-op
    if (error?.status === 404) {
      return { ok: true, status: 404 };
    }
    throw handleApiError(error, 'deleteStudent');
  }
};

// Add payment to a student
export const addPaymentToStudent = async (id: string, amount: number) => {
  try {
    const response = await membersApi.post(`/students/${id}/add-payment/`, { amount });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'addPaymentToStudent');
  }
};

// Add debt to a student
export const addDebtToStudent = async (id: string, amount: number) => {
  try {
    const response = await membersApi.post(`/students/${id}/add-debt/`, { amount });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'addDebtToStudent');
  }
};
