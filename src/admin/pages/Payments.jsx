import React from 'react'
import { Link } from 'react-router-dom'
import { api, fmtDate, fmtMoney, LABELS } from '../api'
import { PaymentBillingFields } from '../PaymentBillingFields'
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
import {
  DueDateCell,
  countPaymentUrgencies,
  paymentRowClass,
  sortPaymentsByUrgency,
} from '../payment-billing'

const STATUS_TONE = {
  pending: 'warn',
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
}

const EMPTY_PAYMENT = {
  clientId: '',
  amount: '',
  method: 'transfer',
  status: 'pending',
  billingType: 'monthly',
  dueDate: '',
  description: 'Cuota mensual',
}

export function PaymentsPage() {
  const [payments, setPayments] = React.useState([])
  const [clients, setClients] = React.useState([])
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY_PAYMENT)
  const [saving, setSaving] = React.useState(false)

  const load = React.useCallback(() => {
    Promise.all([api.payments.list(), api.clients.list()])
      .then(([p, c]) => {
        setPayments(sortPaymentsByUrgency(p))
        setClients(c)
      })
      .catch((e) => setError(e.message))
  }, [])

  React.useEffect(() => { load() }, [load])

  const { overdue, dueSoon, dueWeek } = countPaymentUrgencies(payments)
  const hasAlerts = overdue > 0 || dueSoon > 0 || dueWeek > 0

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.payments.create(form.clientId, {
        amount: Number(form.amount),
        method: form.method,
        status: form.status,
        billingType: form.billingType,
        dueDate: form.dueDate || undefined,
        description: form.description,
      })
      setOpen(false)
      setForm(EMPTY_PAYMENT)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'client',
      label: 'Cliente',
      render: (r) => (
        <Link to={`/admin/clientes/${r.clientId}`} onClick={(e) => e.stopPropagation()}>
          {r.client?.name || r.clientId}
        </Link>
      ),
    },
    {
      key: 'billingType',
      label: 'Modalidad',
      render: (r) => (
        <Badge tone="neutral">{LABELS.paymentBillingType[r.billingType] || r.billingType}</Badge>
      ),
    },
    { key: 'amount', label: 'Monto', render: (r) => fmtMoney(r.amount) },
    { key: 'method', label: 'Método', render: (r) => LABELS.paymentMethod[r.method] },
    {
      key: 'status',
      label: 'Estado',
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status]}>{LABELS.paymentStatus[r.status]}</Badge>
      ),
    },
    {
      key: 'dueDate',
      label: 'Vence',
      render: (r) => <DueDateCell payment={r} fmtDate={fmtDate} />,
    },
    { key: 'description', label: 'Concepto', render: (r) => r.description || '—' },
  ]

  return (
    <>
      <PageHeader
        title="Pagos"
        subtitle="Cuota mensual, comisión o pago único. Los próximos a vencer se destacan automáticamente."
        actions={<Btn onClick={() => setOpen(true)}>+ Registrar pago</Btn>}
      />
      <ErrorBox message={error} />

      {hasAlerts && (
        <div className="admin-pay-alerts">
          {overdue > 0 && (
            <span className="admin-pay-alert admin-pay-alert--overdue">
              {overdue} vencido{overdue > 1 ? 's' : ''}
            </span>
          )}
          {dueSoon > 0 && (
            <span className="admin-pay-alert admin-pay-alert--due_soon">
              {dueSoon} vence{dueSoon > 1 ? 'n' : ''} pronto
            </span>
          )}
          {dueWeek > 0 && (
            <span className="admin-pay-alert admin-pay-alert--due_week">
              {dueWeek} próximo{dueWeek > 1 ? 's' : ''} a vencer
            </span>
          )}
        </div>
      )}

      {payments.length === 0 && !error ? (
        <EmptyState>No hay pagos registrados.</EmptyState>
      ) : (
        <Table
          columns={columns}
          rows={payments}
          rowClassName={paymentRowClass}
        />
      )}

      <Modal open={open} title="Registrar pago" onClose={() => setOpen(false)}>
        <form className="admin-form" onSubmit={handleCreate}>
          <Field label="Cliente">
            <Select
              required
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">Seleccionar cliente…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company ? ` · ${c.company}` : ''}
                </option>
              ))}
            </Select>
          </Field>
          <PaymentBillingFields form={form} setForm={setForm} />
          <Field label="Monto (ARS)">
            <input
              type="number"
              required
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </Field>
          <Field label="Método">
            <Select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              {Object.entries(LABELS.paymentMethod).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {Object.entries(LABELS.paymentStatus).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Descripción">
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancelar</Btn>
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar pago'}
            </Btn>
          </div>
        </form>
      </Modal>
    </>
  )
}
