import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Notes API calls
export const notesAPI = {
  createNote: (title, content) =>
    api.post('/notes', { title, content }),
  getAllNotes: () =>
    api.get('/notes'),
  getNoteById: (id) =>
    api.get(`/notes/${id}`),
  updateNote: (id, title, content) =>
    api.put(`/notes/${id}`, { title, content }),
  deleteNote: (id) =>
    api.delete(`/notes/${id}`),
};

export default api;
