import React from 'react'
import { LABELS } from './api'
import { BILLING_DEFAULTS, applyBillingType } from './payment-billing'
import { Field, Select } from './components'

export function PaymentBillingFields({ form, setForm }) {
  const billing = form.billingType || 'monthly'
  const hints = BILLING_DEFAULTS[billing] || BILLING_DEFAULTS.monthly

  const onBillingChange = (e) => {
    setForm(applyBillingType(form, e.target.value))
  }

  return (
    <>
      <Field label="Modalidad de cobro">
        <Select value={billing} onChange={onBillingChange}>
          {Object.entries(LABELS.paymentBillingType).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <span className="admin-field-hint">{hints.dueLabel}</span>
      </Field>
      <Field label={hints.dueOptional ? hints.dueLabel : `${hints.dueLabel} *`}>
        <input
          type="date"
          value={form.dueDate}
          required={!hints.dueOptional}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </Field>
    </>
  )
}
