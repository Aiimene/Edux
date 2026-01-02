import { settingsApi, handleApiError } from './apiConfig';

// General Settings
export const getGeneralSettings = async () => {
  try {
    const response = await settingsApi.get('/general/');
    // Backend returns nested structure: { schoolData: {...}, interfaceData: {...} }
    const data = response.data;
    if (data.schoolData && data.interfaceData) {
      return {
        schoolName: data.schoolData.schoolName || '',
        schoolEmail: data.schoolData.schoolEmail || '',
        address: data.schoolData.address || '',
        timezone: data.schoolData.timezone || 'UTC',
        language: data.schoolData.language || 'English',
        logo: data.schoolData.logo || null,
        darkMode: data.interfaceData.darkMode || false,
        accentColor: data.interfaceData.accentColor || 'Default',
        sidebarLayout: data.interfaceData.sidebarLayout || 'Default',
      };
    }
    return data;
  } catch (error) {
    throw handleApiError(error, 'getGeneralSettings');
  }
};

export const updateGeneralSettings = async (data: {
  schoolName?: string;
  schoolEmail?: string;
  address?: string;
  timezone?: string;
  language?: string;
  logo?: string | null;
  darkMode?: boolean;
  accentColor?: string;
  sidebarLayout?: string;
}) => {
  try {
    // Backend expects camelCase fields in JSON format (POST request)
    const payload: any = {};
    if (data.schoolName !== undefined) payload.schoolName = data.schoolName;
    if (data.schoolEmail !== undefined) payload.schoolEmail = data.schoolEmail;
    if (data.address !== undefined) payload.address = data.address;
    if (data.timezone !== undefined) payload.timezone = data.timezone;
    if (data.language !== undefined) payload.language = data.language;
    if (data.logo !== undefined) payload.logo = data.logo;
    if (data.darkMode !== undefined) payload.darkMode = data.darkMode;
    if (data.accentColor !== undefined) payload.accentColor = data.accentColor;
    if (data.sidebarLayout !== undefined) payload.sidebarLayout = data.sidebarLayout;

    const response = await settingsApi.post('/general/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateGeneralSettings');
  }
};

// Users Management
export const getUsers = async () => {
  try {
    const response = await settingsApi.get('/users/');
    // Backend returns: { users: [{ id, name, email, role, status }] }
    return response.data.users || [];
  } catch (error) {
    throw handleApiError(error, 'getUsers');
  }
};

export const createUser = async (userData: {
  name: string;
  email?: string;
  username: string;
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
  status?: 'Active' | 'Inactive';
  password?: string;
}) => {
  try {
    // Backend expects: { name, email (optional), username, role, status (optional), password (optional) }
    const payload: any = {
      name: userData.name,
      username: userData.username,
      role: userData.role,
    };
    if (userData.email !== undefined) payload.email = userData.email;
    if (userData.status !== undefined) payload.status = userData.status;
    if (userData.password !== undefined) payload.password = userData.password;

    const response = await settingsApi.post('/users/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createUser');
  }
};

export const updateUser = async (userId: number, userData: {
  name: string;
  email?: string;
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent';
  status: 'Active' | 'Inactive';
}) => {
  try {
    // Backend expects PUT with: { name, email (optional), role, status }
    const payload: any = {
      name: userData.name,
      role: userData.role,
      status: userData.status,
    };
    if (userData.email !== undefined) payload.email = userData.email;

    const response = await settingsApi.put(`/users/${userId}/`, payload);
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

export const getBillingPayments = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await settingsApi.get('/billing/payments/', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getBillingPayments');
  }
};

export const createPayment = async (paymentData: {
  method: string;
  date: string;
  proof: string; // Base64 encoded file
}) => {
  try {
    const response = await settingsApi.post('/billing/payments/', paymentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createPayment');
  }
};

export const approvePayment = async (paymentId: number, action: 'approve' | 'reject', notes?: string) => {
  try {
    const response = await settingsApi.post(`/billing/payments/${paymentId}/approve/`, {
      action,
      notes,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'approvePayment');
  }
};

// Admin Account Management
export const getAllAccounts = async () => {
  try {
    const response = await settingsApi.get('/admin/accounts/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getAllAccounts');
  }
};

export const updateAccountPlan = async (workspaceId: number, planData: {
  planName: string;
  maxUsers: number;
  price: number;
  status: 'active' | 'inactive' | 'expired';
}) => {
  try {
    const response = await settingsApi.put(`/admin/accounts/${workspaceId}/plan/`, planData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateAccountPlan');
  }
};

export const getPendingPayments = async () => {
  try {
    const response = await settingsApi.get('/admin/payments/pending/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getPendingPayments');
  }
};

// Support
export const sendSupportMessage = async (data: {
  message: string;
}) => {
  try {
    const response = await settingsApi.post('/support/', { message: data.message });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'sendSupportMessage');
  }
};

