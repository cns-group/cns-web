import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api, LABELS } from '../api'
import {
  Badge,
  Btn,
  EmptyState,
  ErrorBox,
  Field,
  Modal,
  PageHeader,
  Select,
  Table,
} from '../components'

const STATUS_TONE = {
  lead: 'neutral',
  active: 'success',
  paused: 'warn',
  churned: 'danger',
}

const EMPTY_FORM = {
  name: '',
  email: '',
  company: '',
  phone: '',
  productionUrl: '',
  status: 'lead',
}

export function ClientsPage() {
  const navigate = useNavigate()
  const [clients, setClients] = React.useState([])
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_FORM)

  const load = React.useCallback(() => {
    api.clients.list()
      .then(setClients)
      .catch((e) => setError(e.message))
  }, [])

  React.useEffect(() => { load() }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        productionUrl: form.productionUrl.trim() || undefined,
      }
      const created = await api.clients.create(payload)
      setOpen(false)
      setForm(EMPTY_FORM)
      navigate(`/admin/clientes/${created.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { key: 'name', label: 'Cliente', render: (r) => (
      <div>
        <strong>{r.name}</strong>
        {r.company && <div className="admin-muted">{r.company}</div>}
      </div>
    )},
    { key: 'email', label: 'Email' },
    {
      key: 'productionUrl',
      label: 'Producción',
      render: (r) =>
        r.productionUrl ? (
          <a href={r.productionUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Ver sitio
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'phone', label: 'Teléfono', render: (r) => r.phone || '—' },
    { key: 'status', label: 'Estado', render: (r) => (
      <Badge tone={STATUS_TONE[r.status]}>{LABELS.clientStatus[r.status]}</Badge>
    )},
    { key: 'plans', label: 'Plan', render: (r) => {
      const active = r.clientPlans?.find((cp) => cp.status === 'active')
      const pending = r.clientPlans?.find((cp) => cp.status === 'pending')
      const cp = active || pending || r.clientPlans?.[0]
      return cp ? `${cp.plan?.name} (${cp.status})` : '—'
    }},
  ]

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle="Cada cliente tiene su plan, pagos, demos y pasos de configuración."
        actions={<Btn onClick={() => setOpen(true)}>+ Nuevo cliente</Btn>}
      />
      <ErrorBox message={error} />
      {clients.length === 0 && !error ? (
        <EmptyState>No hay clientes todavía. Creá el primero.</EmptyState>
      ) : (
        <Table columns={columns} rows={clients} onRowClick={(r) => navigate(`/admin/clientes/${r.id}`)} />
      )}

      <Modal open={open} title="Nuevo cliente" onClose={() => setOpen(false)}>
        <form className="admin-form" onSubmit={handleCreate}>
          <Field label="Nombre">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Empresa">
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </Field>
          <Field label="URL en producción">
            <input
              type="url"
              placeholder="https://..."
              value={form.productionUrl}
              onChange={(e) => setForm({ ...form, productionUrl: e.target.value })}
            />
          </Field>
          <Field label="Teléfono">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Estado">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {Object.entries(LABELS.clientStatus).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancelar</Btn>
            <Btn type="submit" variant="primary">Crear cliente</Btn>
          </div>
        </form>
      </Modal>
    </>
  )
}
