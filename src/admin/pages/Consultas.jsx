import React from 'react'
import { Link } from 'react-router-dom'
import { api, ETAPAS, fmtDate, fmtDateTime, fmtMoney } from '../api'
import { Badge, Btn, EmptyState, ErrorBox, Field, Modal, PageHeader, Select } from '../components'

const POLL_MS = 15000
const SIN_LEIDOS = { total: 0, consultas: 0, porConsulta: {} }

const cerrada = (c) => c.etapa === 'ganado' || c.etapa === 'perdido'
const vencida = (c) => c.proximoContactoEn && !cerrada(c) && new Date(c.proximoContactoEn) < new Date()
const tel = (t) => (t ? `+${t}` : '')

function toDateInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function ConsultasPage() {
  const [items, setItems] = React.useState([])
  const [unread, setUnread] = React.useState(SIN_LEIDOS)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [onlyUnread, setOnlyUnread] = React.useState(false)
  const [openId, setOpenId] = React.useState(null)
  const [creating, setCreating] = React.useState(false)
  const [dragId, setDragId] = React.useState(null)
  const [overStage, setOverStage] = React.useState(null)

  const load = React.useCallback(async () => {
    try {
      const [list, sinLeer] = await Promise.all([
        api.consultas.list(),
        api.whatsapp.unread().catch(() => SIN_LEIDOS),
      ])
      setItems(list)
      setUnread(sinLeer)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])

  const visibles = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((c) => {
      if (onlyUnread && !unread.porConsulta[c.id]) return false
      if (!q) return true
      return [c.nombre, c.empresa, c.telefono, c.email, ...(c.etiquetas || [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [items, query, onlyUnread, unread])

  const move = async (id, etapa) => {
    const actual = items.find((c) => c.id === id)
    if (!actual || actual.etapa === etapa) return
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, etapa } : c)))
    try {
      await api.consultas.update(id, { etapa })
    } catch (e) {
      setError(e.message)
      load()
    }
  }

  return (
    <>
      <PageHeader
        title="Consultas"
        subtitle="Cada persona que escribe por WhatsApp (o que cargás a mano) entra al embudo. Arrastrá las tarjetas entre etapas."
        actions={
          <>
            <Link className="admin-btn admin-btn--ghost" to="/admin/whatsapp">
              Números de WhatsApp
            </Link>
            <Btn onClick={() => setCreating(true)}>+ Nueva consulta</Btn>
          </>
        }
      />
      <ErrorBox message={error} />

      <div className="crm-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Buscar por nombre, empresa, teléfono o etiqueta…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className={`admin-chip${onlyUnread ? ' on' : ''}`}
          onClick={() => setOnlyUnread((v) => !v)}
        >
          Sin leer{unread.total > 0 ? ` (${unread.total})` : ''}
        </button>
      </div>

      {loading && <div className="admin-loading">Cargando…</div>}
      {!loading && items.length === 0 && (
        <EmptyState>
          Todavía no hay consultas. Cuando alguien escriba a un número de WhatsApp vinculado, aparece acá.
        </EmptyState>
      )}

      {items.length > 0 && (
        <div className="crm-board">
          {ETAPAS.map((etapa, col) => {
            const cards = visibles.filter((c) => c.etapa === etapa.id)
            const total = cards.reduce((s, c) => s + (Number(c.montoEstimado) || 0), 0)
            return (
              <section
                key={etapa.id}
                className={`crm-col crm-col--${etapa.id}${overStage === etapa.id ? ' is-over' : ''}`}
                style={{ '--i': col }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOverStage(etapa.id)
                }}
                onDragLeave={() => setOverStage((s) => (s === etapa.id ? null : s))}
                onDrop={(e) => {
                  e.preventDefault()
                  setOverStage(null)
                  if (dragId) move(dragId, etapa.id)
                  setDragId(null)
                }}
              >
                <header className="crm-col-hd">
                  <h3>{etapa.label}</h3>
                  <span className="crm-count">{cards.length}</span>
                </header>
                {total > 0 && <small className="crm-total">{fmtMoney(total)}</small>}
                <div className="crm-col-body">
                  {cards.map((c, i) => {
                    const sinLeer = unread.porConsulta[c.id] || 0
                    return (
                      <article
                        key={c.id}
                        className={`crm-card${dragId === c.id ? ' is-dragging' : ''}${sinLeer ? ' has-unread' : ''}`}
                        style={{ '--i': i }}
                        draggable
                        onDragStart={() => setDragId(c.id)}
                        onDragEnd={() => {
                          setDragId(null)
                          setOverStage(null)
                        }}
                        onClick={() => setOpenId(c.id)}
                      >
                        <header>
                          <strong>{c.nombre}</strong>
                          {sinLeer > 0 && <span className="crm-unread">{sinLeer}</span>}
                        </header>
                        {c.empresa && <small>{c.empresa}</small>}
                        <div className="crm-meta">
                          <span className={`crm-origin crm-origin--${c.origen}`}>
                            {c.origen === 'whatsapp' ? 'WhatsApp' : 'Manual'}
                          </span>
                          {c.telefono && <span>{tel(c.telefono)}</span>}
                        </div>
                        {c.etiquetas?.length > 0 && (
                          <div className="crm-tags">
                            {c.etiquetas.slice(0, 3).map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        )}
                        {(c.montoEstimado || c.proximoContactoEn) && (
                          <footer>
                            {c.montoEstimado ? <span>{fmtMoney(c.montoEstimado)}</span> : <span />}
                            {c.proximoContactoEn && (
                              <Badge tone={vencida(c) ? 'danger' : 'neutral'}>{fmtDate(c.proximoContactoEn)}</Badge>
                            )}
                          </footer>
                        )}
                      </article>
                    )
                  })}
                  {cards.length === 0 && <p className="crm-empty">Sin consultas</p>}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {openId && (
        <Ficha
          id={openId}
          onClose={() => setOpenId(null)}
          onChanged={load}
          unread={unread.porConsulta[openId] || 0}
        />
      )}
      <NuevaConsulta
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(c) => {
          setCreating(false)
          load()
          setOpenId(c.id)
        }}
      />
    </>
  )
}

function NuevaConsulta({ open, onClose, onCreated }) {
  const vacio = { nombre: '', telefono: '', email: '', empresa: '', mensaje: '' }
  const [form, setForm] = React.useState(vacio)
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim()))
      const created = await api.consultas.create(payload)
      setForm(vacio)
      onCreated(created)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Nueva consulta" onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        <ErrorBox message={error} />
        <Field label="Nombre">
          <input value={form.nombre} onChange={set('nombre')} required autoFocus />
        </Field>
        <Field label="Teléfono (con código de área)">
          <input value={form.telefono} onChange={set('telefono')} placeholder="351 555-1234" />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Empresa">
          <input value={form.empresa} onChange={set('empresa')} />
        </Field>
        <Field label="Qué necesita">
          <textarea rows={3} value={form.mensaje} onChange={set('mensaje')} />
        </Field>
        <div className="admin-actions">
          <Btn variant="ghost" onClick={onClose}>
            Cancelar
          </Btn>
          <Btn type="submit" disabled={saving || !form.nombre.trim()}>
            {saving ? 'Guardando…' : 'Crear'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}

function Ficha({ id, onClose, onChanged, unread }) {
  const [c, setC] = React.useState(null)
  const [form, setForm] = React.useState(null)
  const [tab, setTab] = React.useState('chat')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const [nota, setNota] = React.useState('')
  const [cliente, setCliente] = React.useState(null)

  const cargar = React.useCallback(async () => {
    try {
      const data = await api.consultas.get(id)
      setC(data)
      setForm({
        nombre: data.nombre || '',
        empresa: data.empresa || '',
        email: data.email || '',
        telefono: data.telefono || '',
        etapa: data.etapa,
        etiquetas: (data.etiquetas || []).join(', '),
        montoEstimado: data.montoEstimado ?? '',
        proximoContactoEn: toDateInput(data.proximoContactoEn),
        motivoPerdida: data.motivoPerdida || '',
      })
      if (!data.telefono) setTab('historial')
    } catch (e) {
      setError(e.message)
    }
  }, [id])

  React.useEffect(() => {
    cargar()
  }, [cargar])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const guardar = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.consultas.update(id, {
        nombre: form.nombre,
        empresa: form.empresa,
        email: form.email,
        telefono: form.telefono,
        etapa: form.etapa,
        etiquetas: form.etiquetas.split(',').map((t) => t.trim()).filter(Boolean),
        montoEstimado: form.montoEstimado === '' ? null : Number(form.montoEstimado),
        proximoContactoEn: form.proximoContactoEn ? new Date(`${form.proximoContactoEn}T12:00:00`).toISOString() : null,
        motivoPerdida: form.motivoPerdida,
      })
      await cargar()
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const agregarNota = async (e) => {
    e.preventDefault()
    if (!nota.trim()) return
    try {
      await api.consultas.addNote(id, nota.trim())
      setNota('')
      await cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const convertir = async () => {
    setError('')
    try {
      setCliente(await api.consultas.toClient(id))
      await cargar()
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminar = async () => {
    if (!window.confirm('¿Eliminar esta consulta y su historial? La conversación de WhatsApp se conserva.')) return
    try {
      await api.consultas.remove(id)
      onChanged()
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()} aria-label="Ficha de la consulta">
        <header className="admin-drawer-hd">
          <div>
            <h2>{c?.nombre || 'Consulta'}</h2>
            {c && (
              <p className="admin-muted">
                {c.origen === 'whatsapp' ? 'Escribió por WhatsApp' : 'Cargada a mano'} · {fmtDateTime(c.creadoEn)}
                {unread > 0 && ` · ${unread} sin leer`}
              </p>
            )}
          </div>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <ErrorBox message={error} />
        {!c && !error && <div className="admin-loading">Cargando…</div>}

        {c && form && (
          <div className="admin-drawer-body">
            <form className="admin-form crm-form" onSubmit={guardar}>
              <div className="crm-form-grid">
                <Field label="Nombre">
                  <input value={form.nombre} onChange={set('nombre')} required />
                </Field>
                <Field label="Empresa">
                  <input value={form.empresa} onChange={set('empresa')} />
                </Field>
                <Field label="Teléfono">
                  <input value={form.telefono} onChange={set('telefono')} />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={set('email')} />
                </Field>
                <Field label="Etapa">
                  <Select value={form.etapa} onChange={set('etapa')}>
                    {ETAPAS.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Monto estimado ($)">
                  <input type="number" min="0" value={form.montoEstimado} onChange={set('montoEstimado')} />
                </Field>
                <Field label="Próximo contacto">
                  <input type="date" value={form.proximoContactoEn} onChange={set('proximoContactoEn')} />
                </Field>
                <Field label="Etiquetas (separadas por coma)">
                  <input value={form.etiquetas} onChange={set('etiquetas')} placeholder="gimnasio, turnero" />
                </Field>
              </div>
              {form.etapa === 'perdido' && (
                <Field label="Motivo de la pérdida">
                  <input value={form.motivoPerdida} onChange={set('motivoPerdida')} />
                </Field>
              )}
              <div className="admin-actions">
                <Btn type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </Btn>
                {c.clientId || cliente ? (
                  <Link className="admin-btn admin-btn--ghost" to={`/admin/clientes/${c.clientId || cliente.id}`}>
                    Ver cliente →
                  </Link>
                ) : (
                  <Btn variant="ghost" onClick={convertir}>
                    Pasar a clientes
                  </Btn>
                )}
                <Btn variant="ghost" onClick={eliminar}>
                  Eliminar
                </Btn>
              </div>
            </form>

            <div className="admin-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'chat'}
                className={tab === 'chat' ? 'on' : ''}
                disabled={!c.telefono}
                onClick={() => setTab('chat')}
              >
                WhatsApp
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'historial'}
                className={tab === 'historial' ? 'on' : ''}
                onClick={() => setTab('historial')}
              >
                Historial y notas
              </button>
            </div>

            {tab === 'chat' && c.telefono && <Chat consulta={c} onSent={() => { cargar(); onChanged() }} />}
            {tab === 'chat' && !c.telefono && <EmptyState>Cargá un teléfono para chatear por WhatsApp.</EmptyState>}

            {tab === 'historial' && (
              <div className="crm-history">
                <form className="crm-note-form" onSubmit={agregarNota}>
                  <input
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Agregar una nota (llamada, acuerdo, pendiente…)"
                    maxLength={2000}
                  />
                  <Btn type="submit" disabled={!nota.trim()}>
                    Agregar
                  </Btn>
                </form>
                <ol className="crm-timeline">
                  {c.eventos.map((ev) => (
                    <li key={ev.id} className={`crm-ev crm-ev--${ev.tipo}`}>
                      <span className="crm-ev-dot" />
                      <div>
                        <p>{ev.texto}</p>
                        <small>{fmtDateTime(ev.creadoEn)}</small>
                      </div>
                    </li>
                  ))}
                  {c.eventos.length === 0 && <li className="admin-muted">Todavía no hay movimientos.</li>}
                </ol>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

function Chat({ consulta, onSent }) {
  const [msgs, setMsgs] = React.useState(null)
  const [lines, setLines] = React.useState([])
  const [linea, setLinea] = React.useState('')
  const [texto, setTexto] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [error, setError] = React.useState('')
  const bodyRef = React.useRef(null)
  const id = consulta.id

  const cargar = React.useCallback(async () => {
    try {
      setMsgs(await api.whatsapp.messages(id))
    } catch (e) {
      setError(e.message)
    }
  }, [id])

  React.useEffect(() => {
    cargar()
    api.whatsapp.markRead(id).catch(() => {})
    api.whatsapp.lines().then(setLines).catch(() => {})
    const t = setInterval(cargar, 6000)
    return () => clearInterval(t)
  }, [cargar, id])

  React.useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs])

  const enviar = async (e) => {
    e?.preventDefault()
    if (!texto.trim() || sending) return
    setSending(true)
    setError('')
    try {
      await api.whatsapp.send(id, texto.trim(), linea || undefined)
      setTexto('')
      await cargar()
      onSent()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="wa-chat">
      <div className="wa-chat-body" ref={bodyRef}>
        {msgs === null && <p className="admin-muted">Cargando conversación…</p>}
        {msgs?.length === 0 && <p className="admin-muted">Todavía no hay mensajes de WhatsApp con esta persona.</p>}
        {msgs?.map((m) => (
          <div key={m.id} className={`wa-msg wa-msg--${m.direccion}`}>
            <p>{m.cuerpo}</p>
            <small>{fmtDateTime(m.recibidoEn)}</small>
          </div>
        ))}
      </div>
      <ErrorBox message={error} />
      <form className="wa-chat-form" onSubmit={enviar}>
        {lines.length > 1 && (
          <Select size="compact" value={linea} onChange={(e) => setLinea(e.target.value)} aria-label="Número desde el que respondés">
            <option value="">Responder por el último número</option>
            {lines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </Select>
        )}
        <textarea
          rows={2}
          value={texto}
          maxLength={4000}
          placeholder={`Responder a ${consulta.nombre}…`}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) enviar(e)
          }}
        />
        <Btn type="submit" disabled={sending || !texto.trim()}>
          {sending ? 'Enviando…' : 'Enviar'}
        </Btn>
      </form>
    </div>
  )
}
