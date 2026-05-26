import React from 'react'
import { Link } from 'react-router-dom'
import { api, fmtDateTime, LABELS } from '../api'
import {
  Badge,
  EmptyState,
  ErrorBox,
  PageHeader,
  Table,
} from '../components'

const STATUS_TONE = {
  scheduled: 'warn',
  done: 'success',
  cancelled: 'neutral',
}

export function DemosPage() {
  const [demos, setDemos] = React.useState([])
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api.demos.list()
      .then(setDemos)
      .catch((e) => setError(e.message))
  }, [])

  const columns = [
    {
      key: 'client',
      label: 'Cliente',
      render: (r) => (
        <Link to={`/admin/clientes/${r.clientId}`}>{r.client?.name || r.clientId}</Link>
      ),
    },
    { key: 'title', label: 'Demo' },
    {
      key: 'scheduledAt',
      label: 'Fecha',
      render: (r) => fmtDateTime(r.scheduledAt),
    },
    {
      key: 'url',
      label: 'Link',
      render: (r) =>
        r.url ? (
          <a href={r.url} target="_blank" rel="noreferrer">Abrir</a>
        ) : (
          '—'
        ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status]}>{LABELS.demoStatus[r.status]}</Badge>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Demos"
        subtitle="Demos personalizadas por cliente. Agendá nuevas desde la ficha del cliente."
      />
      <ErrorBox message={error} />
      {demos.length === 0 && !error ? (
        <EmptyState>No hay demos programadas.</EmptyState>
      ) : (
        <Table columns={columns} rows={demos} />
      )}
    </>
  )
}
