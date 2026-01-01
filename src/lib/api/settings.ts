import { settingsApi, handleApiError } from './apiConfig';

// General Settings
export const getGeneralSettings = async () => {
  try {
    const response = await settingsApi.get('/general/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getGeneralSettings');
  }
};

export const updateGeneralSettings = async (data: {
  school_name?: string;
  school_email?: string;
  address?: string;
  timezone?: string;
  language?: string;
  logo?: File | string;
  dark_mode?: boolean;
  accent_color?: string;
  sidebar_layout?: string;
}) => {
  try {
    const formData = new FormData();
    if (data.school_name) formData.append('school_name', data.school_name);
    if (data.school_email) formData.append('school_email', data.school_email);
    if (data.address) formData.append('address', data.address);
    if (data.timezone) formData.append('timezone', data.timezone);
    if (data.language) formData.append('language', data.language);
    if (data.logo && typeof data.logo !== 'string') {
      formData.append('logo', data.logo);
    }
    if (data.dark_mode !== undefined) formData.append('dark_mode', String(data.dark_mode));
    if (data.accent_color) formData.append('accent_color', data.accent_color);
    if (data.sidebar_layout) formData.append('sidebar_layout', data.sidebar_layout);

    const response = await settingsApi.patch('/general/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateGeneralSettings');
  }
};

// Users Management
export const getUsers = async () => {
  try {
    const response = await settingsApi.get('/users/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getUsers');
  }
};

export const getUserById = async (userId: number) => {
  try {
    const response = await settingsApi.get(`/users/${userId}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getUserById');
  }
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  first_name?: string;
  last_name?: string;
}) => {
  try {
    const response = await settingsApi.post('/users/', userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createUser');
  }
};

export const updateUser = async (userId: number, userData: {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}) => {
  try {
    const response = await settingsApi.patch(`/users/${userId}/`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateUser');
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await settingsApi.delete(`/users/${userId}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'deleteUser');
  }
};

// Billing
export const getBillingPlan = async () => {
  try {
    const response = await settingsApi.get('/billing/plan/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getBillingPlan');
  }
};

export const getBillingPayments = async () => {
  try {
    const response = await settingsApi.get('/billing/payments/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getBillingPayments');
  }
};

export const createPayment = async (paymentData: {
  amount: number;
  payment_method: string;
  payment_date?: string;
  notes?: string;
}) => {
  try {
    const response = await settingsApi.post('/billing/payments/', paymentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createPayment');
  }
};


