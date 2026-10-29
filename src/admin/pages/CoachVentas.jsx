import React from 'react'
import { api, ETAPAS, fmtDateTime } from '../api'
import { Badge, Btn, EmptyState, ErrorBox } from '../components'

const TEMPERATURA = {
  frio: ['Frío', 'neutral'],
  tibio: ['Tibio', 'warn'],
  caliente: ['Caliente', 'danger'],
}

const PILAR = {
  quimica: 'Química',
  dolor: 'Dolor',
  objetivo: 'Objetivo',
  cualificacion: 'Cualificación',
  cierre: 'Cierre',
}

const usd = (n) => (n == null ? '' : ` · US$ ${Number(n).toFixed(4)}`)

function Lista({ titulo, items, tono }) {
  if (!items?.length) return null
  return (
    <section className={`coach-sec${tono ? ` coach-sec--${tono}` : ''}`}>
      <h4>{titulo}</h4>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}

/** Estudia la conversación de una consulta y aconseja cómo cerrar. No le escribe nada al cliente. */
export function CoachVentas({ consultaId, etapaActual, onUsarEtapa }) {
  const [a, setA] = React.useState(undefined)
  const [cargando, setCargando] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let vivo = true
    setA(undefined)
    api.ai.ventas
      .last(consultaId)
      .then((d) => vivo && setA(d))
      .catch((e) => vivo && setError(e.message))
    return () => {
      vivo = false
    }
  }, [consultaId])

  const analizar = async () => {
    setCargando(true)
    setError('')
    try {
      setA(await api.ai.ventas.analyze(consultaId))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  const [tempLabel, tempTone] = TEMPERATURA[a?.temperatura] || TEMPERATURA.tibio
  const etapaSug = a?.etapaSugerida && a.etapaSugerida !== etapaActual ? ETAPAS.find((e) => e.id === a.etapaSugerida) : null

  return (
    <div className="coach">
      <div className="coach-hd">
        <p className="admin-muted">
          Lee la conversación y los datos de esta consulta y te aconseja cómo cerrar la venta, con lo que aprendiste en tu
          cerebro. <strong>Solo te aconseja: no le escribe nada al cliente.</strong>
        </p>
        <Btn onClick={analizar} disabled={cargando}>
          {cargando ? 'Estudiando…' : a ? 'Volver a analizar' : 'Analizar esta consulta'}
        </Btn>
      </div>
      <ErrorBox message={error} />

      {a === undefined && !error && <p className="admin-muted">Buscando el último análisis…</p>}
      {a === null && !cargando && (
        <EmptyState>Todavía no se analizó. Tocá “Analizar esta consulta” y en unos segundos tenés el consejo.</EmptyState>
      )}

      {a && (
        <div className="coach-body">
          <div className="coach-top">
            <Badge tone={tempTone}>{tempLabel}</Badge>
            {a.probabilidadCierre != null && (
              <div className="coach-prob" title="Qué tan probable es que se cierre">
                <span>{a.probabilidadCierre}% de cierre</span>
                <i style={{ '--p': `${a.probabilidadCierre}%` }} />
              </div>
            )}
            {a.pilarActual && <span className="crm-origin">Pilar: {PILAR[a.pilarActual]}</span>}
          </div>

          {a.resumen && <p className="coach-resumen">{a.resumen}</p>}

          {a.comoCerrar && (
            <section className="coach-cierre">
              <h4>Cómo cerrar</h4>
              <p>{a.comoCerrar}</p>
            </section>
          )}

          {a.proximosPasos?.length > 0 && (
            <section className="coach-sec">
              <h4>Próximos pasos</h4>
              <ol className="coach-pasos">
                {a.proximosPasos.map((p) => (
                  <li key={p.accion}>
                    <strong>{p.accion}</strong>
                    {p.cuando && <span className="coach-cuando">{p.cuando}</span>}
                    {p.porQue && <small>{p.porQue}</small>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {a.dolorDetectado && (
            <section className="coach-sec">
              <h4>Dolor del cliente</h4>
              <p>{a.dolorDetectado}</p>
            </section>
          )}

          {a.objeciones?.length > 0 && (
            <section className="coach-sec">
              <h4>Objeciones y cómo encararlas</h4>
              <div className="coach-objs">
                {a.objeciones.map((o) => (
                  <article key={o.objecion}>
                    <strong>{o.objecion}</strong>
                    {o.comoManejarla && <p>{o.comoManejarla}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          <Lista titulo="Señales de compra" items={a.senalesDeCompra} tono="ok" />
          <Lista titulo="Riesgos" items={a.riesgos} tono="riesgo" />
          <Lista titulo="Lo que todavía no sabés (averigualo)" items={a.faltanDatos} />

          {etapaSug && onUsarEtapa && (
            <div className="coach-etapa">
              <span>
                Etapa sugerida: <strong>{etapaSug.label}</strong>
              </span>
              <Btn variant="ghost" onClick={() => onUsarEtapa(etapaSug.id)}>
                Cargarla en el formulario
              </Btn>
            </div>
          )}

          <small className="admin-muted coach-pie">
            {a.mensajesAnalizados} mensajes leídos · {a.modelo} · {fmtDateTime(a.analizadoEn)}
            {usd(a.costoUsd)}
          </small>
        </div>
      )}
    </div>
  )
}

/** Panel con todas las consultas abiertas: a quién atender primero hoy y qué se repite. */
export function PanoramaVentas({ onClose, onAbrir }) {
  const [p, setP] = React.useState(null)
  const [cargando, setCargando] = React.useState(true)
  const [error, setError] = React.useState('')

  const cargar = React.useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      setP(await api.ai.ventas.panorama())
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  React.useEffect(() => {
    cargar()
  }, [cargar])

  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()} aria-label="Panorama de ventas">
        <header className="admin-drawer-hd">
          <div>
            <h2>Panorama de ventas</h2>
            <p className="admin-muted">Estudia todas tus consultas abiertas y te dice a quién atender primero. No escribe a nadie.</p>
          </div>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="admin-drawer-body">
          <ErrorBox message={error} />
          {cargando && <div className="admin-loading">Estudiando tus consultas…</div>}
          {!cargando && p?.vacio && <EmptyState>No hay consultas abiertas para estudiar.</EmptyState>}
          {!cargando && p && !p.vacio && (
            <div className="coach-body">
              {p.consejoGeneral && (
                <section className="coach-cierre">
                  <h4>Lo más importante esta semana</h4>
                  <p>{p.consejoGeneral}</p>
                </section>
              )}
              <section className="coach-sec">
                <h4>A quién atender primero</h4>
                <ol className="coach-prioridades">
                  {p.prioridades.map((x, i) => (
                    <li key={x.consultaId}>
                      <button type="button" onClick={() => onAbrir(x.consultaId)}>
                        <span className="coach-n">{i + 1}</span>
                        <span>
                          <strong>{x.nombre}</strong>
                          <small>{x.motivo}</small>
                          <em>{x.accionHoy}</em>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
              <Lista titulo="Lo que se repite" items={p.patrones} />
              <small className="admin-muted coach-pie">
                {p.consultas} consultas estudiadas · {p.modelo}
                {usd(p.costoUsd)}
              </small>
              <Btn variant="ghost" onClick={cargar}>
                Volver a estudiar
              </Btn>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
