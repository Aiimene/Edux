import { academicApi as api } from './apiConfig';

export const getAnnouncements = async () => {
  try {
    const response = await api.get('/announcements/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await api.delete(`/announcements/${id}/`);
    console.log('Announcement deleted:', id);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete announcement:', error);
    throw error;
  }
};

export const createAnnouncement = async (payload: {
  title: string;
  message: string;
  name?: string;
  sender?: string;
  role?: string;
}) => {
  try {
    // Send payload with both name and sender fields for compatibility
    const finalPayload = {
      title: payload.title,
      message: payload.message,
      ...(payload.name && { name: payload.name }),
      ...(payload.sender && { sender: payload.sender }),
      ...(payload.role && { role: payload.role }),
    };
    console.log('Creating announcement with payload:', finalPayload);
    const response = await api.post('/announcements/', finalPayload);
    console.log('Announcement created, response:', response.data);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    let message = 'Failed to create announcement';
    if (data?.error) {
      message = data.error;
    } else if (data && typeof data === 'object') {
      const parts: string[] = [];
      for (const key of Object.keys(data)) {
        const val = Array.isArray(data[key]) ? data[key].join(', ') : String(data[key]);
        parts.push(`${key}: ${val}`);
      }
      if (parts.length) message = parts.join(' | ');
    } else if (error?.message) {
      message = error.message;
    }
    const friendlyError = new Error(message);
    // @ts-expect-error expose status
    friendlyError.status = status;
    throw friendlyError;
  }
};
