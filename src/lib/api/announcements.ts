import { academicApi, handleApiError } from './apiConfig';

// Get all announcements
export const getAnnouncements = async () => {
  try {
    const response = await academicApi.get('/announcements/');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getAnnouncements');
  }
};

// Get a single announcement
export const getAnnouncementById = async (id: string | number) => {
  try {
    const response = await academicApi.get(`/announcements/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'getAnnouncementById');
  }
};

// Create announcement
export const createAnnouncement = async (announcementData: {
  title: string;
  message: string;
  target_audience?: 'all' | 'teachers' | 'students' | 'parents';
}) => {
  try {
    const response = await academicApi.post('/announcements/', announcementData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'createAnnouncement');
  }
};

// Update announcement
export const updateAnnouncement = async (id: string | number, announcementData: {
  title?: string;
  message?: string;
  target_audience?: 'all' | 'teachers' | 'students' | 'parents';
}) => {
  try {
    const response = await academicApi.patch(`/announcements/${id}/`, announcementData);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updateAnnouncement');
  }
};

// Delete announcement
export const deleteAnnouncement = async (id: string | number) => {
  try {
    const response = await academicApi.delete(`/announcements/${id}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'deleteAnnouncement');
  }
};


