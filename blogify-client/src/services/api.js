import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Posts API
export const postsAPI = {
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },
  
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
  
  getFeaturedPosts: async () => {
    const response = await api.get('/posts/featured');
    return response.data;
  },
  
  getTrendingPosts: async () => {
    const response = await api.get('/posts/trending');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getUserProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  getUserPosts: async (id) => {
    const response = await api.get(`/users/${id}/posts`);
    return response.data;
  }
};

export default api;
