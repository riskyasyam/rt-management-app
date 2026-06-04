import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

// ─── Warga ────────────────────────────────────────────────
export const wargaApi = {
  getAll: () => api.get('/warga'),
  getById: (id) => api.get(`/warga/${id}`),
  create: (formData) => api.post('/warga', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.post(`/warga/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/warga/${id}`),
}

// ─── Rumah ────────────────────────────────────────────────
export const rumahApi = {
  getAll: () => api.get('/rumah'),
  create: (data) => api.post('/rumah', data),
  setPenghuni: (id, data) => api.post(`/rumah/${id}/set-penghuni`, data),
  kosongkan: (id, data) => api.post(`/rumah/${id}/kosongkan`, data),
  getHistoriPenghuni: (id) => api.get(`/rumah/${id}/histori-penghuni`),
  getHistoriPembayaran: (id) => api.get(`/rumah/${id}/histori-pembayaran`),
}

// ─── Keuangan ─────────────────────────────────────────────
export const keuanganApi = {
  bayarIuran: (data) => api.post('/keuangan/bayar-iuran', data),
  tambahPengeluaran: (data) => api.post('/keuangan/pengeluaran', data),
  getReportSummary: (tahun) => api.get('/keuangan/report-summary', { params: { tahun } }),
  getReportDetail: (bulan, tahun) => api.get('/keuangan/report-detail', { params: { bulan, tahun } }),
}

export default api
