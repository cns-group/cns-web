import React from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Card, PageHeader } from '../components'

export function DashboardPage() {
  const [stats, setStats] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api.stats()
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  const tiles = stats
    ? [
        { label: 'Clientes totales', value: stats.clients, to: '/admin/clientes' },
        { label: 'Clientes activos', value: stats.activeClients, to: '/admin/clientes' },
        { label: 'Pagos pendientes', value: stats.pendingPayments, to: '/admin/pagos' },
        { label: 'Demos programadas', value: stats.upcomingDemos, to: '/admin/demos' },
      ]
    : []

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen del CRM — clientes, pagos, demos y configuración por cuenta."
      />
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-grid admin-grid--4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="admin-stat">
            <span>{t.label}</span>
            <strong>{t.value}</strong>
          </Link>
        ))}
      </div>
      <Card title="Accesos rápidos">
        <div className="admin-quick-links">
          <Link to="/admin/clientes">+ Nuevo cliente</Link>
          <Link to="/admin/planes">Ver catálogo de planes</Link>
          <Link to="/admin/pagos">Registrar pago</Link>
          <Link to="/admin/demos">Agendar demo</Link>
        </div>
      </Card>
    </>
  )
}
