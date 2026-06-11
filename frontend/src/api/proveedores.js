import api from './axios'
export const proveedoresAPI = {
  listar: (params) => api.get('/proveedores/', { params }),
  obtener: (id) => api.get(`/proveedores/${id}/`),
  crear: (data) => api.post('/proveedores/', data),
  actualizar: (id, data) => api.patch(`/proveedores/${id}/`, data),
}