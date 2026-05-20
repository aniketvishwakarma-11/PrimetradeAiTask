import axios from 'axios';

// API URL must be set via environment variable VITE_API_URL
// For local development: VITE_API_URL=http://localhost:5000
// For production: VITE_API_URL=https://your-backend-url.com
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

if (!import.meta.env.VITE_API_URL) {
  console.error('Error: VITE_API_URL environment variable is not set!');
  console.error('Please set VITE_API_URL in your .env file');
}

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

// Admin API calls
export const adminAPI = {
  getAllUsers: () =>
    api.get('/admin/users'),
  getUserById: (id) =>
    api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),
  getAllNotes: () =>
    api.get('/admin/notes'),
  deleteNote: (id) =>
    api.delete(`/admin/notes/${id}`),
  getStats: () =>
    api.get('/admin/stats'),
};

export default api;
