import api from './axios'

export const portalAPI = {
  consultarOrden: (data) => api.post('/cliente/consultar-orden/', data),
  estadoOrden: (token) => api.get(`/cliente/orden/${token}/`),
}
