import api from './axios'
export const productosAPI = {
  listar: (params) => api.get('/productos/productos/', { params }),
  obtener: (id) => api.get(`/productos/productos/${id}/`),
  crear: (data) => api.post('/productos/productos/', data),
  actualizar: (id, data) => api.patch(`/productos/productos/${id}/`, data),
  etapas: () => api.get('/productos/etapas/'),
  categorias: () => api.get('/productos/categorias/'),
}