import { membersApi, handleApiError } from './apiConfig';

// Get all parents
export const getParents = async () => {
  try {
    const response = await membersApi.get('/parents/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getParents');
  }
};

// Get a single parent
export const getParentById = async (id: string) => {
  try {
    const response = await membersApi.get(`/parents/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getParentById');
  }
};

// Create parent
export const createParent = async (parentData: any) => {
  try {
    const response = await membersApi.post('/parents/', parentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createParent');
  }
};

// Update parent
export const updateParent = async (id: string, parentData: any) => {
  try {
    const response = await membersApi.patch(`/parents/${id}/`, parentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateParent');
  }
};

// Delete parent
export const deleteParent = async (id: string) => {
  try {
    const response = await membersApi.delete(`/parents/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'deleteParent');
  }
};
