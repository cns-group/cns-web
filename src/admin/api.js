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

/**
 * POST que responde por eventos (SSE) con `{ t: "pedazo" }`, `{ fin: true }` o `{ error: "…" }`.
 * Llama a `onPedazo` con cada trozo de texto a medida que llega.
 */
async function stream(path, body, onPedazo, signal) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body), signal })
  if (res.status === 401) {
    setToken(null)
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok || !res.body) {
    let msg = `Error ${res.status}`
    try {
      const j = await res.json()
      msg = Array.isArray(j.message) ? j.message.join(', ') : j.message || msg
    } catch { /* ignore */ }
    throw new Error(msg)
  }
  const lector = res.body.getReader()
  const decodificador = new TextDecoder()
  let resto = ''
  for (;;) {
    const { done, value } = await lector.read()
    if (done) break
    resto += decodificador.decode(value, { stream: true })
    let corte
    while ((corte = resto.indexOf('\n\n')) >= 0) {
      const bloque = resto.slice(0, corte)
      resto = resto.slice(corte + 2)
      if (!bloque.startsWith('data:')) continue
      let evento
      try {
        evento = JSON.parse(bloque.slice(5))
      } catch {
        continue
      }
      if (evento.error) throw new Error(evento.error)
      if (evento.t) onPedazo(evento.t)
    }
  }
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
    ventas: {
      last: (consultaId) => request(`/ai/ventas/consultas/${consultaId}`),
      analyze: (consultaId, modelo) =>
        request(`/ai/ventas/consultas/${consultaId}/analizar`, { method: 'POST', body: JSON.stringify(modelo ? { modelo } : {}) }),
      panorama: (modelo) =>
        request('/ai/ventas/panorama', { method: 'POST', body: JSON.stringify(modelo ? { modelo } : {}) }),
    },
    entrenador: {
      escenarios: () => request('/ai/entrenador/escenarios'),
      roleplay: (escenario, nivel, turnos, modelo) =>
        request('/ai/entrenador/roleplay', { method: 'POST', body: JSON.stringify({ escenario, nivel, turnos, ...(modelo ? { modelo } : {}) }) }),
      generateScenario: (descripcion, modelo) =>
        request('/ai/entrenador/escenarios/generar', { method: 'POST', body: JSON.stringify({ descripcion, ...(modelo ? { modelo } : {}) }) }),
      createScenario: (datos) => request('/ai/entrenador/escenarios', { method: 'POST', body: JSON.stringify(datos) }),
      updateScenario: (id, datos) => request(`/ai/entrenador/escenarios/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }),
      deleteScenario: (id) => request(`/ai/entrenador/escenarios/${id}`, { method: 'DELETE' }),
      roleplayStream: (escenario, nivel, turnos, modelo, onPedazo, signal) =>
        stream('/ai/entrenador/roleplay/stream', { escenario, nivel, turnos, ...(modelo ? { modelo } : {}) }, onPedazo, signal),
      coachStream: (turnos, modelo, onPedazo, signal) =>
        stream('/ai/entrenador/coach/stream', { turnos, ...(modelo ? { modelo } : {}) }, onPedazo, signal),
      coach: (turnos, modelo) =>
        request('/ai/entrenador/coach', { method: 'POST', body: JSON.stringify({ turnos, ...(modelo ? { modelo } : {}) }) }),
      feedback: (escenario, nivel, turnos, modelo) =>
        request('/ai/entrenador/feedback', { method: 'POST', body: JSON.stringify({ escenario, nivel, turnos, ...(modelo ? { modelo } : {}) }) }),
    },
    ingles: {
      escenarios: () => request('/ai/ingles/escenarios'),
      conversarStream: (escenario, nivel, turnos, modelo, onPedazo, signal) =>
        stream('/ai/ingles/conversar/stream', { escenario, nivel, turnos, ...(modelo ? { modelo } : {}) }, onPedazo, signal),
      corregir: (texto, nivel, contexto, modelo) =>
        request('/ai/ingles/corregir', { method: 'POST', body: JSON.stringify({ texto, nivel, ...(contexto ? { contexto } : {}), ...(modelo ? { modelo } : {}) }) }),
      traducir: (texto, modelo) =>
        request('/ai/ingles/traducir', { method: 'POST', body: JSON.stringify({ texto, ...(modelo ? { modelo } : {}) }) }),
      feedback: (escenario, nivel, turnos, modelo) =>
        request('/ai/ingles/feedback', { method: 'POST', body: JSON.stringify({ escenario, nivel, turnos, ...(modelo ? { modelo } : {}) }) }),
    },
    chat: (mensajes, modelo) =>
      request('/ai/chat', { method: 'POST', body: JSON.stringify({ mensajes, ...(modelo ? { modelo } : {}) }) }),
  },
  articulos: {
    listAdmin: () => request('/articulos/admin/todos'),
    getAdmin: (id) => request(`/articulos/admin/${id}`),
    create: (datos) => request('/articulos', { method: 'POST', body: JSON.stringify(datos) }),
    update: (id, datos) => request(`/articulos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }),
    remove: (id) => request(`/articulos/${id}`, { method: 'DELETE' }),
    /** La imagen viaja como binario puro: el Content-Type es el de la propia imagen. */
    uploadImage: (archivo) =>
      request('/articulos/imagenes', { method: 'POST', body: archivo, headers: { 'Content-Type': archivo.type || 'image/jpeg' } }),
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
