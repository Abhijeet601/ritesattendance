import api from './axios';

export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data.users;
};

export const fetchUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.user;
};

export const createUser = async (payload) => {
  const response = await api.post('/users', payload);
  return response.data.user;
};

export const markCheckIn = async (payload) => {
  const response = await api.post('/attendance/check-in', payload);
  return response.data;
};

export const markCheckOut = async (payload) => {
  const response = await api.post('/attendance/check-out', payload);
  return response.data;
};

export const fetchAttendanceLogs = async (userId) => {
  const response = await api.get(`/attendance/${userId}`);
  return response.data.attendance;
};

export const registerFaceEncoding = async (payload) => {
  const response = await api.post('/face/register', payload);
  return response.data;
};

export const fetchFaceEncodings = async (userId) => {
  const response = await api.get(`/face/${userId}`);
  return response.data.encodings;
};

export const uploadDocument = async (userId, document) => {
  const formData = new FormData();
  formData.append('user_id', String(userId));
  formData.append('document', document);

  const response = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchDocuments = async (userId) => {
  const response = await api.get(`/documents/${userId}`);
  return response.data.documents;
};
