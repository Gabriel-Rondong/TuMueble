import api from './axios'
export const usuariosAPI = {
  listar: (params) => api.get('/usuarios/', { params }),
  obtener: (id) => api.get(`/usuarios/${id}/`),
  crear: (data) => api.post('/usuarios/', data),
  actualizar: (id, data) => api.patch(`/usuarios/${id}/`, data),
  activar: (id) => api.post(`/usuarios/${id}/activar/`),
  desactivar: (id) => api.post(`/usuarios/${id}/desactivar/`),
  resetearPassword: (id, nueva_password) => api.post(`/usuarios/${id}/resetear_password/`, { nueva_password }),
  roles: {
    listar: () => api.get('/roles/'),
    crear: (data) => api.post('/roles/', data),
    asignarPermisos: (id, permisos) => api.post(`/roles/${id}/asignar_permisos/`, { permisos }),
  },
}