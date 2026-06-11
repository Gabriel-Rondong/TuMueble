import api from './axios'
export const clientesAPI = {
  listar: (params) => api.get('/clientes/', { params }),
  obtener: (id) => api.get(`/clientes/${id}/`),
  crear: (data) => api.post('/clientes/', data),
  actualizar: (id, data) => api.patch(`/clientes/${id}/`, data),
  eliminar: (id) => api.delete(`/clientes/${id}/`),
}