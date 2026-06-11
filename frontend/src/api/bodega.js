import api from './axios'
export const bodegaAPI = {
  materiales: {
    listar: (params) => api.get('/bodega/materiales/', { params }),
    obtener: (id) => api.get(`/bodega/materiales/${id}/`),
    crear: (data) => api.post('/bodega/materiales/', data),
    actualizar: (id, data) => api.patch(`/bodega/materiales/${id}/`, data),
    stockCritico: () => api.get('/bodega/materiales/stock_critico/'),
  },
  lotes: {
    listar: (params) => api.get('/bodega/lotes/', { params }),
    crear: (data) => api.post('/bodega/lotes/', data),
  },
  movimientos: {
    listar: (params) => api.get('/bodega/movimientos/', { params }),
    crear: (data) => api.post('/bodega/movimientos/', data),
  },
  categorias: () => api.get('/bodega/categorias/'),
  ubicaciones: () => api.get('/bodega/ubicaciones/'),
  unidades: () => api.get('/bodega/unidades-medida/'),
}