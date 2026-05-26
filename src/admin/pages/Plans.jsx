import React from 'react'
import { api, fmtMoney, LABELS } from '../api'
import {
  Btn,
  EmptyState,
  ErrorBox,
  Field,
  Modal,
  PageHeader,
  Select,
  Table,
} from '../components'

const EMPTY = {
  name: '',
  productType: 'ecommerce',
  tier: 'Starter',
  monthlyPrice: '',
  setupPrice: '',
  description: '',
}

export function PlansPage() {
  const [plans, setPlans] = React.useState([])
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState(EMPTY)

  const load = React.useCallback(() => {
    api.plans.list().then(setPlans).catch((e) => setError(e.message))
  }, [])

  React.useEffect(() => { load() }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.plans.create({
        ...form,
        monthlyPrice: form.monthlyPrice === '' ? null : Number(form.monthlyPrice),
        setupPrice: form.setupPrice === '' ? null : Number(form.setupPrice),
      })
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const columns = [
    { key: 'name', label: 'Plan' },
    { key: 'productType', label: 'Producto', render: (r) => LABELS.productType[r.productType] },
    { key: 'tier', label: 'Tier' },
    { key: 'monthlyPrice', label: 'Mensual', render: (r) => fmtMoney(r.monthlyPrice) },
    { key: 'setupPrice', label: 'Setup', render: (r) => fmtMoney(r.setupPrice) },
    { key: 'isActive', label: 'Activo', render: (r) => (r.isActive ? 'Sí' : 'No') },
  ]

  return (
    <>
      <PageHeader
        title="Planes"
        subtitle="Catálogo de planes por producto. Asignalos desde la ficha de cada cliente."
        actions={<Btn onClick={() => setOpen(true)}>+ Nuevo plan</Btn>}
      />
      <ErrorBox message={error} />
      {plans.length === 0 && !error ? (
        <EmptyState>Sin planes en catálogo.</EmptyState>
      ) : (
        <Table columns={columns} rows={plans} />
      )}

      <Modal open={open} title="Nuevo plan" onClose={() => setOpen(false)}>
        <form className="admin-form" onSubmit={handleCreate}>
          <Field label="Nombre">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Producto">
            <Select value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })}>
              {Object.entries(LABELS.productType).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tier">
            <input required value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
          </Field>
          <Field label="Precio mensual (vacío = comisión / único)">
            <input type="number" min="0" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} />
          </Field>
          <Field label="Setup">
            <input type="number" min="0" value={form.setupPrice} onChange={(e) => setForm({ ...form, setupPrice: e.target.value })} />
          </Field>
          <Field label="Descripción">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="admin-form-actions">
            <Btn variant="ghost" onClick={() => setOpen(false)}>Cancelar</Btn>
            <Btn type="submit">Crear</Btn>
          </div>
        </form>
      </Modal>
    </>
  )
}
