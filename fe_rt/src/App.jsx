import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import DashboardPage from '@/pages/DashboardPage'
import WargaPage from '@/pages/WargaPage'
import RumahPage from '@/pages/RumahPage'
import KeuanganPage from '@/pages/KeuanganPage'
import { ToastProvider } from '@/components/ui/toast'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/warga" element={<WargaPage />} />
            <Route path="/rumah" element={<RumahPage />} />
            <Route path="/keuangan" element={<KeuanganPage />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
