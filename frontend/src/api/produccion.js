import api from './axios'

export const produccionAPI = {
  listarOrdenes: (params) => api.get('/produccion/ordenes/', { params }),
  obtenerOrden: (id) => api.get(`/produccion/ordenes/${id}/`),
  crearOrden: (data) => api.post('/produccion/ordenes/', data),
  actualizarOrden: (id, data) => api.patch(`/produccion/ordenes/${id}/`, data),
  cambiarEstado: (id, data) => api.post(`/produccion/ordenes/${id}/cambiar_estado/`, data),
  iniciarEtapa: (id, data) => api.post(`/produccion/ordenes/${id}/iniciar_etapa/`, data),
  finalizarEtapa: (id, data) => api.post(`/produccion/ordenes/${id}/finalizar_etapa/`, data),
  trazabilidad: (id) => api.get(`/produccion/ordenes/${id}/trazabilidad/`),
}
