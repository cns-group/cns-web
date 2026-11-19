import React from 'react'
import { Link } from 'react-router-dom'
import { api, fmtMoney } from '../api'
import { Btn, ErrorBox, Field, Modal, PageHeader, Select } from '../components'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const PRIORIDADES = { high: 'Alta', normal: 'Normal', low: 'Baja' }

const dos = (n) => String(n).padStart(2, '0')
/** Fecha local como AAAA-MM-DD (sin pasar por UTC, para que no se corra un día). */
const iso = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
const desdeIso = (s) => {
  const [a, m, d] = s.split('-').map(Number)
  return new Date(a, m - 1, d)
}
const sumarDias = (s, n) => {
  const d = desdeIso(s)
  d.setDate(d.getDate() + n)
  return iso(d)
}
/** Lunes de la semana de la fecha dada. */
const lunesDe = (s) => {
  const d = desdeIso(s)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return iso(d)
}
const etiquetaSemana = (lunes) => {
  const a = desdeIso(lunes)
  const b = desdeIso(sumarDias(lunes, 6))
  const mismoMes = a.getMonth() === b.getMonth()
  return mismoMes
    ? `${a.getDate()} al ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`
    : `${a.getDate()} de ${MESES[a.getMonth()]} al ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`
}
const hora = (t) => (t ? t.slice(0, 5) : '')
const rangoHora = (t) => (t.startTime ? `${hora(t.startTime)}${t.endTime ? `–${hora(t.endTime)}` : ''}` : 'Todo el día')

const VACIA = { title: '', date: '', startTime: '', endTime: '', priority: 'normal', clientId: '', notes: '' }

export function AgendaPage() {
  const hoy = iso(new Date())
  const [lunes, setLunes] = React.useState(lunesDe(hoy))
  const [tareas, setTareas] = React.useState([])
  const [atrasadas, setAtrasadas] = React.useState([])
  const [pagos, setPagos] = React.useState([])
  const [demos, setDemos] = React.useState([])
  const [clientes, setClientes] = React.useState([])
  const [error, setError] = React.useState('')
  const [editando, setEditando] = React.useState(null) // null | { id?: string, ...campos }
  const [guardando, setGuardando] = React.useState(false)

  const domingo = sumarDias(lunes, 6)
  const dias = React.useMemo(() => Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i)), [lunes])

  const cargar = React.useCallback(() => {
    setError('')
    Promise.all([
      api.agenda.list(lunes, domingo),
      api.agenda.list(sumarDias(lunes, -90), sumarDias(lunes, -1)),
    ])
      .then(([semana, previas]) => {
        setTareas(semana)
        setAtrasadas(previas.filter((t) => !t.done))
      })
      .catch((e) => setError(e.message))
  }, [lunes, domingo])

  React.useEffect(() => {
    cargar()
  }, [cargar])

  // Cobros y demos se muestran en el día que corresponden, solo para verlos (se gestionan en Pagos y Demos).
  React.useEffect(() => {
    Promise.all([api.payments.list(), api.demos.list(), api.clients.list()])
      .then(([p, d, c]) => {
        setPagos(p)
        setDemos(d)
        setClientes(c)
      })
      .catch((e) => setError(e.message))
  }, [])

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.name
  const porDia = (dia) => tareas.filter((t) => t.date === dia)
  const pagosDelDia = (dia) => pagos.filter((p) => p.status === 'pending' && p.dueDate && String(p.dueDate).slice(0, 10) === dia)
  const demosDelDia = (dia) => demos.filter((d) => d.status === 'scheduled' && d.scheduledAt && iso(new Date(d.scheduledAt)) === dia)

  const hechas = tareas.filter((t) => t.done).length

  const abrirNueva = (fecha) => setEditando({ ...VACIA, date: fecha })
  const abrirEditar = (t) =>
    setEditando({
      id: t.id,
      title: t.title,
      date: String(t.date).slice(0, 10),
      startTime: hora(t.startTime),
      endTime: hora(t.endTime),
      priority: t.priority,
      clientId: t.clientId || '',
      notes: t.notes || '',
    })

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    const datos = {
      title: editando.title.trim(),
      date: editando.date,
      startTime: editando.startTime || null,
      endTime: editando.startTime ? editando.endTime || null : null,
      priority: editando.priority,
      clientId: editando.clientId || null,
      notes: editando.notes.trim() || null,
    }
    try {
      if (editando.id) await api.agenda.update(editando.id, datos)
      else await api.agenda.create(datos)
      setEditando(null)
      cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const alternar = async (t) => {
    // Se marca al instante y se corrige si el servidor falla.
    const cambio = (lista) => lista.map((x) => (x.id === t.id ? { ...x, done: !t.done } : x))
    setTareas(cambio)
    setAtrasadas((a) => (t.done ? [...a, t] : a.filter((x) => x.id !== t.id)))
    try {
      await api.agenda.update(t.id, { done: !t.done })
    } catch (err) {
      setError(err.message)
      cargar()
    }
  }

  const eliminar = async () => {
    if (!window.confirm('¿Eliminar esta tarea?')) return
    try {
      await api.agenda.remove(editando.id)
      setEditando(null)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const pasarAHoy = async (t) => {
    try {
      await api.agenda.update(t.id, { date: hoy })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const campo = (k) => (e) => setEditando((x) => ({ ...x, [k]: e.target.value }))

  return (
    <>
      <PageHeader
        title="Agenda semanal"
        subtitle="Tus tareas de la semana por día. Los cobros que vencen y las demos agendadas aparecen en su día, solo para tenerlos presentes."
        actions={<Btn onClick={() => abrirNueva(dias.includes(hoy) ? hoy : lunes)}>+ Nueva tarea</Btn>}
      />
      <ErrorBox message={error} />

      <div className="agenda-barra">
        <div className="agenda-nav">
          <Btn variant="ghost" onClick={() => setLunes(sumarDias(lunes, -7))} aria-label="Semana anterior">
            ← Anterior
          </Btn>
          <Btn variant="ghost" onClick={() => setLunes(lunesDe(hoy))} disabled={lunes === lunesDe(hoy)}>
            Hoy
          </Btn>
          <Btn variant="ghost" onClick={() => setLunes(sumarDias(lunes, 7))} aria-label="Semana siguiente">
            Siguiente →
          </Btn>
        </div>
        <h2 className="agenda-semana">{etiquetaSemana(lunes)}</h2>
        <span className="agenda-avance">
          {tareas.length ? `${hechas} de ${tareas.length} tareas hechas` : 'Sin tareas esta semana'}
        </span>
      </div>

      {atrasadas.length > 0 && (
        <section className="agenda-atrasadas" aria-label="Tareas atrasadas">
          <strong>
            {atrasadas.length} {atrasadas.length === 1 ? 'tarea atrasada' : 'tareas atrasadas'} sin hacer
          </strong>
          <ul>
            {atrasadas.slice(0, 6).map((t) => (
              <li key={t.id}>
                <button type="button" className="agenda-link" onClick={() => abrirEditar(t)}>
                  {t.title}
                </button>
                <span className="agenda-meta"> · {desdeIso(String(t.date).slice(0, 10)).toLocaleDateString('es-AR')}</span>
                <button type="button" className="agenda-link agenda-link--accion" onClick={() => pasarAHoy(t)}>
                  Pasar a hoy
                </button>
              </li>
            ))}
          </ul>
          {atrasadas.length > 6 && <span className="agenda-meta">y {atrasadas.length - 6} más</span>}
        </section>
      )}

      <div className="agenda-grid">
        {dias.map((dia, i) => {
          const lista = porDia(dia)
          const cobros = pagosDelDia(dia)
          const dm = demosDelDia(dia)
          const esHoy = dia === hoy
          return (
            <section key={dia} className={`agenda-dia${esHoy ? ' agenda-dia--hoy' : ''}${dia < hoy ? ' agenda-dia--pasado' : ''}`}>
              <header className="agenda-dia-hd">
                <div>
                  <span className="agenda-dia-nombre">{DIAS[i]}</span>
                  <span className="agenda-dia-num">{desdeIso(dia).getDate()}</span>
                </div>
                <button type="button" className="agenda-mas" onClick={() => abrirNueva(dia)} aria-label={`Agregar tarea el ${DIAS[i]}`}>
                  +
                </button>
              </header>

              <div className="agenda-dia-cuerpo">
                {cobros.map((p) => (
                  <Link key={p.id} to={`/admin/clientes/${p.clientId}`} className="agenda-evento agenda-evento--cobro">
                    <span>Cobro · {p.client?.name || nombreCliente(p.clientId) || 'Cliente'}</span>
                    <small>{p.currency === 'USD' ? `USD ${Number(p.amount).toLocaleString('es-AR')}` : fmtMoney(p.amount)}</small>
                  </Link>
                ))}
                {dm.map((d) => (
                  <Link key={d.id} to={`/admin/clientes/${d.clientId}`} className="agenda-evento agenda-evento--demo">
                    <span>Demo · {d.client?.name || nombreCliente(d.clientId) || d.title}</span>
                    <small>{new Date(d.scheduledAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</small>
                  </Link>
                ))}

                {lista.map((t) => (
                  <article key={t.id} className={`agenda-tarea agenda-tarea--${t.priority}${t.done ? ' agenda-tarea--hecha' : ''}`}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => alternar(t)}
                      aria-label={t.done ? 'Marcar como pendiente' : 'Marcar como hecha'}
                    />
                    <button type="button" className="agenda-tarea-cuerpo" onClick={() => abrirEditar(t)}>
                      <span className="agenda-hora">{rangoHora(t)}</span>
                      <span className="agenda-titulo">{t.title}</span>
                      {t.clientId && <span className="agenda-meta">{nombreCliente(t.clientId)}</span>}
                    </button>
                  </article>
                ))}

                {!lista.length && !cobros.length && !dm.length && <p className="agenda-vacio">Libre</p>}
              </div>
            </section>
          )
        })}
      </div>

      <Modal open={Boolean(editando)} title={editando?.id ? 'Editar tarea' : 'Nueva tarea'} onClose={() => setEditando(null)}>
        {editando && (
          <form onSubmit={guardar} className="agenda-form">
            <Field label="Qué hay que hacer">
              <input autoFocus required maxLength={200} value={editando.title} onChange={campo('title')} placeholder="Por ejemplo: llamar a Hangar por el cobro" />
            </Field>
            <div className="agenda-form-fila">
              <Field label="Día">
                <input type="date" required value={editando.date} onChange={campo('date')} />
              </Field>
              <Field label="Desde (opcional)">
                <input type="time" value={editando.startTime} onChange={campo('startTime')} />
              </Field>
              <Field label="Hasta (opcional)">
                <input type="time" value={editando.endTime} min={editando.startTime || undefined} disabled={!editando.startTime} onChange={campo('endTime')} />
              </Field>
            </div>
            <div className="agenda-form-fila">
              <Field label="Prioridad">
                <Select value={editando.priority} onChange={campo('priority')}>
                  {Object.entries(PRIORIDADES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Cliente (opcional)">
                <Select value={editando.clientId} onChange={campo('clientId')}>
                  <option value="">Sin cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Notas (opcional)">
              <textarea rows={3} maxLength={2000} value={editando.notes} onChange={campo('notes')} />
            </Field>
            <div className="agenda-form-acciones">
              {editando.id && (
                <Btn variant="danger" onClick={eliminar}>
                  Eliminar
                </Btn>
              )}
              <span style={{ flex: 1 }} />
              <Btn variant="ghost" onClick={() => setEditando(null)}>
                Cancelar
              </Btn>
              <Btn type="submit" disabled={guardando || !editando.title.trim()}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </Btn>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
