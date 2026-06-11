import api from './axios'
export const reportesAPI = {
  dashboardGerencial: () => api.get('/dashboard/gerencial/'),
  dashboardProduccion: () => api.get('/dashboard/produccion/'),
  ordenesAtrasadas: () => api.get('/reportes/ordenes-atrasadas/'),
  stockCritico: () => api.get('/reportes/stock-critico/'),
}