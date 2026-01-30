import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  userSignup: (data) => apiClient.post('/auth/signup', data),
  userLogin: (data) => apiClient.post('/auth/login', data),
  adminSignup: (data) => apiClient.post('/auth/admin/signup', data),
  adminLogin: (data) => apiClient.post('/auth/admin/login', data),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.get('/auth/logout'),
};

// Exam API
export const examApi = {
  getAllExams: () => apiClient.get('/exam'),
  getExamById: (id) => apiClient.get(`/exam/${id}`),
  createExam: (data) => apiClient.post('/exam', data),
  updateExam: (id, data) => apiClient.put(`/exam/${id}`, data),
  deleteExam: (id) => apiClient.delete(`/exam/${id}`),
  publishExam: (id) => apiClient.put(`/exam/${id}/publish`, {}),
  startExam: (id) => apiClient.post(`/exam/${id}/start`, {}),
  submitExam: (submissionId, data) => apiClient.post(`/exam/submission/${submissionId}`, data),
  getExamResults: (id) => apiClient.get(`/exam/${id}/results`),
};

// Result API
export const resultApi = {
  getUserResults: () => apiClient.get('/exam/result/my-results'),
  getResult: (id) => apiClient.get(`/exam/result/${id}`),
};

export default apiClient;
