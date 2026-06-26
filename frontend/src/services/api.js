import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const peliculasAPI = {
  getAll: () => api.get('/peliculas'),
  getById: (id) => api.get(`/peliculas/${id}`),
  create: (data) => api.post('/peliculas', data),
  update: (id, data) => api.put(`/peliculas/${id}`, data),
  delete: (id) => api.delete(`/peliculas/${id}`),
  uploadImage: (id, formData) => api.post(`/peliculas/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getImageUrl: (id) => `/api/peliculas/${id}/imagen`,
  search: (query) => api.get(`/peliculas/buscar?q=${query}`)
};

export const seriesAPI = {
  getAll: () => api.get('/series'),
  getById: (id) => api.get(`/series/${id}`),
  create: (data) => api.post('/series', data),
  update: (id, data) => api.put(`/series/${id}`, data),
  delete: (id) => api.delete(`/series/${id}`),
  uploadImage: (id, formData) => api.post(`/series/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getImageUrl: (id) => `/api/series/${id}/imagen`,
  search: (query) => api.get(`/series/buscar?q=${query}`)
};

export const statsAPI = {
  get: () => api.get('/stats')
};

export const exportAPI = {
  peliculasCSV: () => api.get('/export/peliculas/csv', { responseType: 'blob' }),
  seriesCSV: () => api.get('/export/series/csv', { responseType: 'blob' }),
  todoCSV: () => api.get('/export/todo/csv', { responseType: 'blob' }),
  peliculasJSON: () => api.get('/export/peliculas/json', { responseType: 'blob' }),
  seriesJSON: () => api.get('/export/series/json', { responseType: 'blob' }),
  todoJSON: () => api.get('/export/todo/json', { responseType: 'blob' })
};

export default api;
