const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('crm_token')
}

function setToken(token) {
  if (token) localStorage.setItem('crm_token', token)
  else localStorage.removeItem('crm_token')
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    setToken(null)
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) {
    let msg = `Error ${res.status}`
    try {
      const body = await res.json()
      msg = body.message || body.error || msg
      if (Array.isArray(msg)) msg = msg.join(', ')
    } catch { /* ignore */ }
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getToken,
  setToken,
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request('/auth/me'),
  stats: () => request('/crm/stats'),
  analytics: {
    embudo: (dias = 28) => request(`/analytics/embudo?dias=${dias}`),
  },
  clients: {
    list: () => request('/clients'),
    get: (id) => request(`/clients/${id}`),
    create: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
    assignPlan: (id, data) =>
      request(`/clients/${id}/plans`, { method: 'POST', body: JSON.stringify(data) }),
    updatePlanStatus: (clientPlanId, status) =>
      request(`/client-plans/${clientPlanId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  plans: {
    list: () => request('/plans'),
    create: (data) => request('/plans', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/plans/${id}`, { method: 'DELETE' }),
  },
  payments: {
    list: () => request('/payments'),
    create: (clientId, data) =>
      request(`/payments/client/${clientId}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/payments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/payments/${id}`, { method: 'DELETE' }),
  },
  demos: {
    list: () => request('/demos'),
    create: (clientId, data) =>
      request(`/demos/client/${clientId}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/demos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/demos/${id}`, { method: 'DELETE' }),
  },
  consultas: {
    list: () => request('/consultas'),
    get: (id) => request(`/consultas/${id}`),
    create: (data) => request('/consultas', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/consultas/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addNote: (id, texto) =>
      request(`/consultas/${id}/notas`, { method: 'POST', body: JSON.stringify({ texto }) }),
    toClient: (id) => request(`/consultas/${id}/convertir`, { method: 'POST' }),
    remove: (id) => request(`/consultas/${id}`, { method: 'DELETE' }),
  },
  whatsapp: {
    status: () => request('/integrations/whatsapp/status'),
    lines: () => request('/integrations/whatsapp/lineas'),
    createLine: (nombre) =>
      request('/integrations/whatsapp/lineas', { method: 'POST', body: JSON.stringify({ nombre }) }),
    removeLine: (id) => request(`/integrations/whatsapp/lineas/${id}`, { method: 'DELETE' }),
    connect: (id) => request(`/integrations/whatsapp/lineas/${id}/connect`, { method: 'POST' }),
    disconnect: (id) => request(`/integrations/whatsapp/lineas/${id}/disconnect`, { method: 'POST' }),
    unread: () => request('/integrations/whatsapp/unread'),
    messages: (consultaId) => request(`/integrations/whatsapp/consultas/${consultaId}/mensajes`),
    markRead: (consultaId) =>
      request(`/integrations/whatsapp/consultas/${consultaId}/leer`, { method: 'POST' }),
    send: (consultaId, cuerpo, lineaId) =>
      request(`/integrations/whatsapp/consultas/${consultaId}/enviar`, {
        method: 'POST',
        body: JSON.stringify({ cuerpo, ...(lineaId ? { lineaId } : {}) }),
      }),
  },
  ai: {
    status: () => request('/ai/status'),
    chat: (mensajes, modelo) =>
      request('/ai/chat', { method: 'POST', body: JSON.stringify({ mensajes, ...(modelo ? { modelo } : {}) }) }),
  },
  setupSteps: {
    update: (id, data) =>
      request(`/setup-steps/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
}

export const ETAPAS = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'contactado', label: 'Contactado' },
  { id: 'auditoria', label: 'Auditoría' },
  { id: 'propuesta', label: 'Propuesta' },
  { id: 'ganado', label: 'Ganado' },
  { id: 'perdido', label: 'Perdido' },
]

export const LABELS = {
  clientStatus: {
    lead: 'Lead',
    active: 'Activo',
    paused: 'Pausado',
    churned: 'Baja',
  },
  paymentStatus: {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  },
  paymentMethod: {
    mercadopago: 'Mercado Pago',
    transfer: 'Transferencia',
    cash: 'Efectivo',
    card: 'Tarjeta',
  },
  paymentBillingType: {
    monthly: 'Cuota mensual',
    commission: 'Comisión',
    one_time: 'Pago único',
  },
  demoStatus: {
    scheduled: 'Programada',
    done: 'Realizada',
    cancelled: 'Cancelada',
  },
  setupStatus: {
    pending: 'Pendiente',
    in_progress: 'En curso',
    completed: 'Completado',
  },
  productType: {
    ecommerce: 'Ecommerce',
    ticket: 'E-ticketera',
    gastro: 'Gastronomía',
    gym: 'Gimnasios',
    queue: 'Turneros',
    landing: 'Landing pro',
  },
}

export function fmtMoney(n) {
  if (n == null || n === '') return '—'
  return `$ ${Number(n).toLocaleString('es-AR')}`
}

export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-AR')
}

export function fmtDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
