import api from './axios'
export const documentosAPI = {
  listar: (params) => api.get('/documentos/', { params }),
  obtener: (id) => api.get(`/documentos/${id}/`),
  crear: (data) => api.post('/documentos/', data),
  actualizar: (id, data) => api.patch(`/documentos/${id}/`, data),
  adjuntarPdf: (id, archivo) => {
    const form = new FormData()
    form.append('archivo', archivo)
    return api.post(`/documentos/${id}/adjuntar_pdf/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}