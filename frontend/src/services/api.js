// API Client Service for Smart Campus Management System

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('smart_campus_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem('smart_campus_token');
      localStorage.removeItem('smart_campus_user');
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    me: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },
  complaints: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE}/complaints${queryString}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    create: async (complaintData) => {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(complaintData)
      });
      return handleResponse(res);
    },
    update: async (id, updateData) => {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },
  stats: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE}/stats/dashboard`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },
  users: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getStaff: async () => {
      const res = await fetch(`${API_BASE}/users/staff`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateRole: async (id, data) => {
      const res = await fetch(`${API_BASE}/users/${id}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },
  health: {
    get: async () => {
      const res = await fetch(`${API_BASE}/health`);
      return handleResponse(res);
    }
  }
};

