import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, fmtDate, fmtDateTime, fmtMoney, LABELS } from '../api'
import { PaymentBillingFields } from '../PaymentBillingFields'
import {
  Badge,
  Btn,
  Card,
  ErrorBox,
  Field,
  Modal,
  PageHeader,
  Select,
} from '../components'
import {
  DueDateCell,
  getDueUrgencyLabel,
  getPaymentDueUrgency,
  paymentListItemClass,
  sortPaymentsByUrgency,
} from '../payment-billing'

const STATUS_TONE = {
  lead: 'neutral',
  active: 'success',
  paused: 'warn',
  churned: 'danger',
  pending: 'warn',
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
  scheduled: 'warn',
  done: 'success',
  cancelled: 'neutral',
  in_progress: 'warn',
  completed: 'success',
}

export function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = React.useState(null)
  const [plans, setPlans] = React.useState([])
  const [error, setError] = React.useState('')
  const [planModal, setPlanModal] = React.useState(false)
  const [payModal, setPayModal] = React.useState(false)
  const [demoModal, setDemoModal] = React.useState(false)
  const [planForm, setPlanForm] = React.useState({ planId: '', startDate: '', notes: '' })
  const [payForm, setPayForm] = React.useState({
    amount: '',
    method: 'transfer',
    status: 'pending',
    billingType: 'monthly',
    dueDate: '',
    description: 'Cuota mensual',
  })
  const [demoForm, setDemoForm] = React.useState({
    title: 'Demo personalizada',
    url: '',
    scheduledAt: '',
    status: 'scheduled',
  })

  const load = React.useCallback(() => {
    Promise.all([api.clients.get(id), api.plans.list()])
      .then(([c, p]) => {
        setClient(c)
        setPlans(p.filter((x) => x.isActive))
      })
      .catch((e) => setError(e.message))
  }, [id])

  React.useEffect(() => { load() }, [load])

  const updateClient = async (patch) => {
    setError('')
    try {
      const updated = await api.clients.update(id, patch)
      setClient(updated)
    } catch (e) {
      setError(e.message)
    }
  }

  const assignPlan = async (e) => {
    e.preventDefault()
    try {
      await api.clients.assignPlan(id, planForm)
      setPlanModal(false)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const addPayment = async (e) => {
    e.preventDefault()
    try {
      await api.payments.create(id, { ...payForm, amount: Number(payForm.amount) })
      setPayModal(false)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const addDemo = async (e) => {
    e.preventDefault()
    try {
      await api.demos.create(id, demoForm)
      setDemoModal(false)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const updateStep = async (stepId, status) => {
    try {
      await api.setupSteps.update(stepId, { status })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (!client && !error) return <div className="admin-loading">Cargando cliente…</div>

  return (
    <>
      <PageHeader
        title={client?.name || 'Cliente'}
        subtitle={client?.company || client?.email}
        actions={
          <Link to="/admin/clientes" className="admin-btn admin-btn--ghost">
            ← Volver
          </Link>
        }
      />
      <ErrorBox message={error} />

      {client && (
        <div className="admin-grid admin-grid--2">
          <Card title="Datos del cliente">
            <div className="admin-form admin-form--inline">
              <Field label="Estado">
                <Select
                  value={client.status}
                  onChange={(e) => updateClient({ status: e.target.value })}
                >
                  {Object.entries(LABELS.clientStatus).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </Select>
              </Field>
              <Field label="URL en producción">
                <input
                  type="url"
                  placeholder="https://..."
                  defaultValue={client.productionUrl || ''}
                  onBlur={(e) =>
                    updateClient({ productionUrl: e.target.value.trim() || undefined })
                  }
                />
                {client.productionUrl && (
                  <a
                    className="admin-field-link"
                    href={client.productionUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir sitio en producción ↗
                  </a>
                )}
              </Field>
              <Field label="Teléfono">
                <input
                  defaultValue={client.phone || ''}
                  onBlur={(e) => updateClient({ phone: e.target.value })}
                />
              </Field>
              <Field label="Notas">
                <textarea
                  defaultValue={client.notes || ''}
                  rows={4}
                  onBlur={(e) => updateClient({ notes: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card
            title="Plan asignado"
            actions={<Btn onClick={() => setPlanModal(true)}>Asignar plan</Btn>}
          >
            {client.clientPlans?.length ? (
              <ul className="admin-list">
                {client.clientPlans.map((cp) => (
                  <li key={cp.id}>
                    <div>
                      <strong>{cp.plan?.name}</strong>
                      <div className="admin-muted">
                        {LABELS.productType[cp.plan?.productType]} · {cp.plan?.tier}
                      </div>
                    </div>
                    <div className="admin-list-actions">
                      <Badge tone={STATUS_TONE[cp.status]}>{cp.status}</Badge>
                      <Select
                        size="compact"
                        value={cp.status}
                        onChange={(e) =>
                          api.clients.updatePlanStatus(cp.id, e.target.value).then(load)
                        }
                      >
                        <option value="pending">Pendiente</option>
                        <option value="active">Activo</option>
                        <option value="cancelled">Cancelado</option>
                      </Select>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-muted">Sin plan asignado.</p>
            )}
          </Card>

          <Card title="Pasos de configuración">
            <ol className="admin-steps">
              {(client.setupSteps || []).map((step) => (
                <li key={step.id} data-status={step.status}>
                  <div>
                    <strong>{step.title}</strong>
                    {step.completedAt && (
                      <div className="admin-muted">Completado {fmtDateTime(step.completedAt)}</div>
                    )}
                  </div>
                  <Select
                    size="compact"
                    value={step.status}
                    onChange={(e) => updateStep(step.id, e.target.value)}
                  >
                    {Object.entries(LABELS.setupStatus).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </Select>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Pagos" actions={<Btn onClick={() => setPayModal(true)}>+ Pago</Btn>}>
            {client.payments?.length ? (
              <ul className="admin-list admin-list--payments">
                {sortPaymentsByUrgency(client.payments).map((p) => {
                  const urgency = getPaymentDueUrgency(p)
                  const tag = getDueUrgencyLabel(urgency, p)
                  return (
                    <li key={p.id} className={paymentListItemClass(p)}>
                      <div>
                        <strong>{fmtMoney(p.amount)}</strong>
                        <div className="admin-muted">
                          {LABELS.paymentBillingType[p.billingType] || p.billingType}
                          {' · '}
                          {p.description || '—'}
                        </div>
                        <DueDateCell payment={p} fmtDate={fmtDate} />
                      </div>
                      <div className="admin-list-actions">
                        {tag && <span className={`admin-due-tag admin-due-tag--inline admin-due-tag--${urgency}`}>{tag}</span>}
                        <Badge tone={STATUS_TONE[p.status]}>{LABELS.paymentStatus[p.status]}</Badge>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="admin-muted">Sin pagos registrados.</p>
            )}
          </Card>

          <Card title="Demos" actions={<Btn onClick={() => setDemoModal(true)}>+ Demo</Btn>}>
            {client.demos?.length ? (
              <ul className="admin-list">
                {client.demos.map((d) => (
                  <li key={d.id}>
                    <div>
                      <strong>{d.title}</strong>
                      <div className="admin-muted">
                        {fmtDateTime(d.scheduledAt)}
                        {d.url && (
                          <> · <a href={d.url} target="_blank" rel="noreferrer">Ver demo</a></>
                        )}
                      </div>
                    </div>
                    <Badge tone={STATUS_TONE[d.status]}>{LABELS.demoStatus[d.status]}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-muted">Sin demos.</p>
            )}
          </Card>
        </div>
      )}

      <Modal open={planModal} title="Asignar plan" onClose={() => setPlanModal(false)}>
        <form className="admin-form" onSubmit={assignPlan}>
          <Field label="Plan">
            <Select required value={planForm.planId} onChange={(e) => setPlanForm({ ...planForm, planId: e.target.value })}>
              <option value="">Seleccionar…</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {fmtMoney(p.monthlyPrice)}/mes
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Inicio">
            <input type="date" value={planForm.startDate} onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })} />
          </Field>
          <Field label="Notas">
            <textarea value={planForm.notes} onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })} />
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setPlanModal(false)}>Cancelar</Btn>
            <Btn type="submit">Asignar</Btn>
          </div>
        </form>
      </Modal>

      <Modal open={payModal} title="Registrar pago" onClose={() => setPayModal(false)}>
        <form className="admin-form" onSubmit={addPayment}>
          <PaymentBillingFields form={payForm} setForm={setPayForm} />
          <Field label="Monto (ARS)">
            <input type="number" required min="0" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
          </Field>
          <Field label="Método">
            <Select value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
              {Object.entries(LABELS.paymentMethod).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select value={payForm.status} onChange={(e) => setPayForm({ ...payForm, status: e.target.value })}>
              {Object.entries(LABELS.paymentStatus).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Descripción">
            <input value={payForm.description} onChange={(e) => setPayForm({ ...payForm, description: e.target.value })} />
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setPayModal(false)}>Cancelar</Btn>
            <Btn type="submit">Guardar</Btn>
          </div>
        </form>
      </Modal>

      <Modal open={demoModal} title="Agendar demo" onClose={() => setDemoModal(false)}>
        <form className="admin-form" onSubmit={addDemo}>
          <Field label="Título">
            <input required value={demoForm.title} onChange={(e) => setDemoForm({ ...demoForm, title: e.target.value })} />
          </Field>
          <Field label="URL (opcional)">
            <input type="url" placeholder="https://..." value={demoForm.url} onChange={(e) => setDemoForm({ ...demoForm, url: e.target.value })} />
          </Field>
          <Field label="Fecha y hora">
            <input type="datetime-local" value={demoForm.scheduledAt} onChange={(e) => setDemoForm({ ...demoForm, scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : '' })} />
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setDemoModal(false)}>Cancelar</Btn>
            <Btn type="submit">Agendar</Btn>
          </div>
        </form>
      </Modal>
    </>
  )
}
