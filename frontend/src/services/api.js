import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const userService = {
  getAll: () => api.get('/users').then(r => r.data),
  getById: (id) => api.get(`/users/${id}`).then(r => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
};

export const addressService = {
  add: (userId, data) => api.post(`/users/${userId}/addresses`, data).then(r => r.data),
  update: (userId, addressId, data) => api.put(`/users/${userId}/addresses/${addressId}`, data).then(r => r.data),
  delete: (userId, addressId) => api.delete(`/users/${userId}/addresses/${addressId}`),
};
