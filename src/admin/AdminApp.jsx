import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth'
import { AdminLayout } from './components'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { ClientsPage } from './pages/Clients'
import { ClientDetailPage } from './pages/ClientDetail'
import { PlansPage } from './pages/Plans'
import { PaymentsPage } from './pages/Payments'
import { DemosPage } from './pages/Demos'
import { EmbudoPage } from './pages/Embudo'
import { ConsultasPage } from './pages/Consultas'
import { WhatsAppPage } from './pages/WhatsApp'
import { AsistentePage } from './pages/Asistente'
import './admin.css'
import './admin-crm.css'

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="consultas" element={<ConsultasPage />} />
          <Route path="whatsapp" element={<WhatsAppPage />} />
          <Route path="asistente" element={<AsistentePage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="clientes/:id" element={<ClientDetailPage />} />
          <Route path="planes" element={<PlansPage />} />
          <Route path="pagos" element={<PaymentsPage />} />
          <Route path="demos" element={<DemosPage />} />
          <Route path="embudo" element={<EmbudoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}
