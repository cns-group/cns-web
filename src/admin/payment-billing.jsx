/** Umbrales en días para alertar según modalidad de cobro */
export const DUE_THRESHOLDS = {
  monthly: { soon: 5, week: 12 },
  one_time: { soon: 7, week: 14 },
  commission: { soon: 10, week: 21 },
}

export const BILLING_DEFAULTS = {
  monthly: {
    description: 'Cuota mensual',
    dueLabel: 'Próximo vencimiento de cuota',
    dueOptional: false,
  },
  commission: {
    description: 'Comisión por ventas',
    dueLabel: 'Liquidación de comisión (opcional)',
    dueOptional: true,
  },
  one_time: {
    description: 'Pago único',
    dueLabel: 'Fecha de cobro',
    dueOptional: false,
  },
}

export function applyBillingType(form, billingType) {
  const d = BILLING_DEFAULTS[billingType] || BILLING_DEFAULTS.monthly
  return { ...form, billingType, description: d.description }
}

function parseDueDate(dueDate) {
  if (!dueDate) return null
  const d = new Date(`${dueDate}T12:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function daysUntil(due) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(due)
  end.setHours(0, 0, 0, 0)
  return Math.round((end - today) / 86400000)
}

/** @returns {null | 'overdue' | 'due_soon' | 'due_week' | 'missing_due'} */
export function getPaymentDueUrgency(payment) {
  if (!payment || payment.status === 'paid' || payment.status === 'refunded') {
    return null
  }

  const type = payment.billingType || 'monthly'
  const due = parseDueDate(payment.dueDate)

  if (!due) {
    if (type === 'monthly' || type === 'one_time') return 'missing_due'
    return null
  }

  const diff = daysUntil(due)
  const t = DUE_THRESHOLDS[type] || DUE_THRESHOLDS.monthly

  if (diff < 0) return 'overdue'
  if (diff <= t.soon) return 'due_soon'
  if (diff <= t.week) return 'due_week'
  return null
}

export function getDueUrgencyLabel(urgency, payment) {
  if (!urgency) return null
  const type = payment?.billingType || 'monthly'
  const due = parseDueDate(payment?.dueDate)
  const diff = due ? daysUntil(due) : null

  if (urgency === 'overdue') {
    const n = Math.abs(diff)
    return n === 0 ? 'Vence hoy' : `Vencido hace ${n}d`
  }
  if (urgency === 'due_soon') {
    if (diff === 0) return 'Vence hoy'
    if (diff === 1) return 'Vence mañana'
    return `Vence en ${diff}d`
  }
  if (urgency === 'due_week') {
    if (type === 'commission') return 'Liquidación próxima'
    if (type === 'one_time') return 'Cobro próximo'
    return 'Cuota próxima'
  }
  if (urgency === 'missing_due') {
    return type === 'one_time' ? 'Sin fecha de cobro' : 'Sin vencimiento'
  }
  return null
}

const URGENCY_ORDER = {
  overdue: 0,
  due_soon: 1,
  due_week: 2,
  missing_due: 3,
}

export function sortPaymentsByUrgency(payments) {
  return [...payments].sort((a, b) => {
    const ua = getPaymentDueUrgency(a)
    const ub = getPaymentDueUrgency(b)
    const oa = ua != null ? URGENCY_ORDER[ua] ?? 9 : 9
    const ob = ub != null ? URGENCY_ORDER[ub] ?? 9 : 9
    if (oa !== ob) return oa - ob
    const da = parseDueDate(a.dueDate)?.getTime() ?? Infinity
    const db = parseDueDate(b.dueDate)?.getTime() ?? Infinity
    return da - db
  })
}

export function countPaymentUrgencies(payments) {
  let overdue = 0
  let dueSoon = 0
  let dueWeek = 0
  for (const p of payments) {
    const u = getPaymentDueUrgency(p)
    if (u === 'overdue') overdue++
    else if (u === 'due_soon') dueSoon++
    else if (u === 'due_week') dueWeek++
  }
  return { overdue, dueSoon, dueWeek }
}

export function paymentRowClass(payment) {
  const u = getPaymentDueUrgency(payment)
  return u ? `admin-row--${u}` : ''
}

export function paymentListItemClass(payment) {
  const u = getPaymentDueUrgency(payment)
  return u ? `admin-pay-item admin-pay-item--${u}` : 'admin-pay-item'
}

export function DueDateCell({ payment, fmtDate }) {
  const urgency = getPaymentDueUrgency(payment)
  const tag = getDueUrgencyLabel(urgency, payment)
  const type = payment.billingType || 'monthly'

  return (
    <span className={`admin-due${urgency ? ` admin-due--${urgency}` : ''}`}>
      <span className="admin-due-date">
        {payment.dueDate ? fmtDate(payment.dueDate) : (
          type === 'commission' ? 'Sin fecha' : '—'
        )}
      </span>
      {tag && <span className="admin-due-tag">{tag}</span>}
    </span>
  )
}
