import React from 'react'
import { api } from '../api'
import { Badge, Btn, Card, ErrorBox, PageHeader, Select } from '../components'
import {
  alCambiarVoces,
  crearDictado,
  crearLocutor,
  detenerVoz,
  esNatural,
  extraerOraciones,
  hablar,
  hayDictado,
  hayVoz,
  vocesEspanol,
} from '../voz'

const PREFS_KEY = 'cns_entrenador_prefs'
const NIVELES = { amigable: 'Amigable', normal: 'Normal', duro: 'Duro' }

function leerPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
  } catch {
    return {}
  }
}

function guardarPrefs(p) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p))
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

const SUGERENCIAS_COACH = [
  'Un cliente me dice "es caro". ¿Qué le contesto?',
  '¿Cómo hago para que me diga cuál es su problema real?',
  '¿Cómo cierro una venta después de la auditoría gratis?',
]

const FRASE_DE_PRUEBA =
  'Hola Mario, así voy a sonar. Por ejemplo: la auditoría dura 15 minutos y el sistema sale $150.000 por mes. ¿Te parece bien?'

export function EntrenadorPage() {
  const inicial = React.useMemo(leerPrefs, [])
  const [status, setStatus] = React.useState(null)
  const [escenarios, setEscenarios] = React.useState([])
  const [modo, setModo] = React.useState(inicial.modo || 'roleplay')
  const [escenario, setEscenario] = React.useState(inicial.escenario || 'gimnasio')
  const [nivel, setNivel] = React.useState(inicial.nivel || 'normal')
  const [modelo, setModelo] = React.useState('')
  const [turnos, setTurnos] = React.useState([])
  const [empezo, setEmpezo] = React.useState(false)
  const [ocupado, setOcupado] = React.useState(false) // generando una respuesta
  const [esperando, setEsperando] = React.useState(false) // todavía no llegó ni la primera palabra
  const [error, setError] = React.useState('')
  const [devolucion, setDevolucion] = React.useState(null)
  const [pidiendoDev, setPidiendoDev] = React.useState(false)
  const [texto, setTexto] = React.useState('')

  // Voz
  const [vozOn, setVozOn] = React.useState(inicial.vozOn ?? true)
  const [manosLibres, setManosLibres] = React.useState(inicial.manosLibres ?? false)
  const [vozNombre, setVozNombre] = React.useState(inicial.vozNombre || '')
  const [velocidad, setVelocidad] = React.useState(inicial.velocidad || 1)
  const [voces, setVoces] = React.useState(() => vocesEspanol())
  const [escuchando, setEscuchando] = React.useState(false)
  const [hablando, setHablando] = React.useState(false)
  const [parcial, setParcial] = React.useState('')

  const logRef = React.useRef(null)
  const dictadoRef = React.useRef(null)
  const enviarRef = React.useRef(null)
  const locutorRef = React.useRef(null)
  const cortarRef = React.useRef(null)

  const puedeDictar = hayDictado()
  const puedeHablar = hayVoz()
  const hayNatural = voces.some(esNatural)

  /** Corta lo que esté pasando: la voz, la respuesta que llega y el micrófono. */
  const pararTodo = React.useCallback(() => {
    locutorRef.current?.cancelar()
    locutorRef.current = null
    cortarRef.current?.abort()
    cortarRef.current = null
    detenerVoz()
    setHablando(false)
  }, [])

  React.useEffect(() => {
    api.ai
      .status()
      .then((s) => {
        setStatus(s)
        setModelo(s.modeloVentas || s.modelo)
      })
      .catch((e) => setError(e.message))
    api.ai.entrenador
      .escenarios()
      .then((d) => setEscenarios(d.escenarios))
      .catch((e) => setError(e.message))
    const off = alCambiarVoces(() => setVoces(vocesEspanol()))
    return () => {
      off()
      pararTodo()
      dictadoRef.current?.detener()
    }
  }, [pararTodo])

  React.useEffect(() => {
    guardarPrefs({ modo, escenario, nivel, vozOn, manosLibres, vozNombre, velocidad })
  }, [modo, escenario, nivel, vozOn, manosLibres, vozNombre, velocidad])

  React.useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turnos, esperando, parcial, devolucion])

  const escuchar = React.useCallback(() => {
    const d = dictadoRef.current
    if (!d || d.activo()) return
    pararTodo() // si la IA estaba hablando, se corta: hablar encima = interrumpirla
    setParcial('')
    setError('')
    d.iniciar()
    setEscuchando(true)
  }, [pararTodo])

  // El dictado se crea una vez; llama a `enviarRef` para usar siempre la versión más nueva de `enviar`.
  React.useEffect(() => {
    dictadoRef.current = crearDictado({
      onParcial: setParcial,
      onFin: () => {
        setEscuchando(false)
        setParcial('')
      },
      onFinal: (t) => enviarRef.current?.(t),
      onError: (m) => {
        setEscuchando(false)
        setError(m)
      },
    })
  }, [])

  /** Genera la respuesta de la IA por pedazos y la va diciendo en voz alta frase por frase. */
  const turnoIA = async (historial) => {
    setOcupado(true)
    setEsperando(true)
    setError('')
    setTurnos([...historial, { role: 'assistant', content: '' }])

    const corte = new AbortController()
    cortarRef.current = corte
    const locutor =
      vozOn && puedeHablar
        ? crearLocutor({
            vozNombre,
            velocidad,
            onFin: () => {
              setHablando(false)
              if (locutorRef.current === locutor) locutorRef.current = null
              if (manosLibres) escuchar()
            },
          })
        : null
    locutorRef.current = locutor

    let acumulado = ''
    let buffer = ''
    const alLlegar = (pedazo) => {
      acumulado += pedazo
      buffer += pedazo
      setEsperando(false)
      setTurnos([...historial, { role: 'assistant', content: acumulado }])
      if (!locutor) return
      const { oraciones, resto } = extraerOraciones(buffer)
      buffer = resto
      if (oraciones.length) setHablando(true)
      oraciones.forEach((o) => locutor.decir(o))
    }

    try {
      if (modo === 'roleplay') {
        await api.ai.entrenador.roleplayStream(escenario, nivel, historial, modelo, alLlegar, corte.signal)
      } else {
        await api.ai.entrenador.coachStream(historial, modelo, alLlegar, corte.signal)
      }
      if (locutor) {
        if (buffer.trim()) {
          setHablando(true)
          locutor.decir(buffer)
        }
        locutor.cerrar()
      } else if (manosLibres) {
        escuchar()
      }
    } catch (e) {
      locutor?.cancelar()
      setHablando(false)
      if (!corte.signal.aborted) setError(e.message)
    } finally {
      setEsperando(false)
      setOcupado(false)
      if (cortarRef.current === corte) cortarRef.current = null
    }
  }

  const enviar = (contenido) => {
    const t = String(contenido ?? texto).trim()
    if (!t || ocupado) return
    pararTodo()
    setTexto('')
    const historial = [...turnos, { role: 'user', content: t }]
    setTurnos(historial)
    turnoIA(historial)
  }
  enviarRef.current = enviar

  const empezar = () => {
    pararTodo()
    setTurnos([])
    setDevolucion(null)
    setEmpezo(true)
    turnoIA([])
  }

  const reiniciar = () => {
    pararTodo()
    dictadoRef.current?.detener()
    setTurnos([])
    setDevolucion(null)
    setEmpezo(false)
    setOcupado(false)
    setEsperando(false)
    setError('')
  }

  const pedirDevolucion = async () => {
    pararTodo()
    dictadoRef.current?.detener()
    setPidiendoDev(true)
    setError('')
    try {
      setDevolucion(await api.ai.entrenador.feedback(escenario, nivel, turnos, modelo))
    } catch (e) {
      setError(e.message)
    } finally {
      setPidiendoDev(false)
    }
  }

  // Barra espaciadora = tocar el micrófono (si no estás escribiendo en un campo).
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
      if (!dictadoRef.current) return
      e.preventDefault()
      if (dictadoRef.current.activo()) dictadoRef.current.detener()
      else escuchar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [escuchar])

  const probarVoz = () => {
    pararTodo()
    hablar(FRASE_DE_PRUEBA, { vozNombre, velocidad })
  }

  const roleplay = modo === 'roleplay'
  const configurado = status?.configurado
  const activo = roleplay ? empezo : true
  const pasoMario = turnos.filter((t) => t.role === 'user').length
  const esc = escenarios.find((e) => e.id === escenario)

  return (
    <>
      <PageHeader
        title="Entrenador de ventas"
        subtitle="Practicá tus llamadas hablando: la IA hace de cliente, te contesta con voz y después te dice cómo mejorar. Usa lo que aprendiste en tu cerebro."
        actions={status && <Badge tone={configurado ? 'success' : 'danger'}>{configurado ? 'Conectado' : 'Falta la clave'}</Badge>}
      />
      <ErrorBox message={error} />

      <div className="ent-layout">
        <Card title="Configuración">
          <div className="ent-config">
            <div className="admin-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={roleplay} className={roleplay ? 'on' : ''} onClick={() => { reiniciar(); setModo('roleplay') }}>
                Práctica
              </button>
              <button type="button" role="tab" aria-selected={!roleplay} className={!roleplay ? 'on' : ''} onClick={() => { reiniciar(); setModo('coach') }}>
                Preguntale al coach
              </button>
            </div>

            {roleplay && (
              <>
                <label className="admin-field">
                  <span>Escenario</span>
                  <Select value={escenario} onChange={(e) => { reiniciar(); setEscenario(e.target.value) }}>
                    {escenarios.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.titulo}
                      </option>
                    ))}
                  </Select>
                </label>
                {esc && <p className="admin-muted ent-persona">Vas a hablar con: {esc.personaje}.</p>}
                <label className="admin-field">
                  <span>Dificultad</span>
                  <Select value={nivel} onChange={(e) => { reiniciar(); setNivel(e.target.value) }}>
                    {Object.entries(NIVELES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </label>
              </>
            )}

            {status && (
              <label className="admin-field">
                <span>Modelo</span>
                <Select value={modelo} onChange={(e) => setModelo(e.target.value)}>
                  {status.modelos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </label>
            )}

            <div className="ent-voz">
              <h4>Voz</h4>
              {!puedeDictar && (
                <p className="admin-muted">Tu navegador no tiene dictado por micrófono. Usá Chrome o Edge para hablar; igual podés escribir.</p>
              )}
              {!puedeHablar && <p className="admin-muted">Tu navegador no puede leer en voz alta.</p>}
              <label className="ent-check">
                <input type="checkbox" checked={vozOn} disabled={!puedeHablar} onChange={(e) => { setVozOn(e.target.checked); if (!e.target.checked) pararTodo() }} />
                La IA me responde con voz
              </label>
              <label className="ent-check">
                <input type="checkbox" checked={manosLibres} disabled={!puedeDictar} onChange={(e) => setManosLibres(e.target.checked)} />
                Manos libres: el micrófono se prende solo después de que la IA habla
              </label>
              {puedeHablar && (
                <>
                  <label className="admin-field">
                    <span>Voz</span>
                    <Select value={vozNombre} onChange={(e) => setVozNombre(e.target.value)}>
                      <option value="">Automática (la más natural disponible)</option>
                      {voces.map((v) => (
                        <option key={v.name} value={v.name}>
                          {esNatural(v) ? '★ ' : ''}
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </Select>
                  </label>
                  {!hayNatural && (
                    <p className="admin-muted ent-persona">
                      Tu navegador no tiene voces “Natural”. En Microsoft Edge vienen gratis en español argentino (Elena y Tomás) y suenan mucho mejor.
                    </p>
                  )}
                  <label className="admin-field">
                    <span>Velocidad: {velocidad.toFixed(2)}x</span>
                    <input type="range" min="0.8" max="1.4" step="0.05" value={velocidad} onChange={(e) => setVelocidad(Number(e.target.value))} />
                  </label>
                  <Btn variant="ghost" onClick={probarVoz}>
                    Probar la voz
                  </Btn>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card
          title={roleplay ? (esc ? esc.titulo : 'Práctica') : 'Coach de ventas'}
          actions={
            <div className="admin-actions">
              {roleplay && empezo && (
                <Btn variant="ghost" disabled={pasoMario < 2 || pidiendoDev || ocupado} onClick={pedirDevolucion}>
                  {pidiendoDev ? 'Evaluando…' : 'Terminar y ver devolución'}
                </Btn>
              )}
              {(empezo || turnos.length > 0) && (
                <Btn variant="ghost" onClick={reiniciar}>
                  {roleplay ? 'Nueva práctica' : 'Limpiar'}
                </Btn>
              )}
            </div>
          }
        >
          <div className="wa-chat">
            <div className="wa-chat-body ent-log" ref={logRef}>
              {roleplay && !empezo && (
                <div className="ent-vacio">
                  <p>
                    Elegí un escenario y tocá empezar. El cliente abre la conversación y vos le vendés: podés hablar con el
                    micrófono o escribir. Con la barra espaciadora prendés y apagás el micrófono.
                  </p>
                  <Btn onClick={empezar} disabled={!configurado || !escenarios.length}>
                    Empezar práctica
                  </Btn>
                </div>
              )}
              {!roleplay && turnos.length === 0 && (
                <div className="ai-sugerencias">
                  <p className="admin-muted">Preguntale lo que quieras sobre ventas. Probá con una de estas:</p>
                  {SUGERENCIAS_COACH.map((s) => (
                    <button key={s} type="button" className="admin-chip" disabled={!configurado} onClick={() => enviar(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {turnos
                .filter((t) => t.content)
                .map((t, i) => (
                  <div key={i} className={`wa-msg ${t.role === 'user' ? 'wa-msg--out' : 'wa-msg--in'}`}>
                    <small className="ent-quien">{t.role === 'user' ? 'Vos' : roleplay ? 'Cliente' : 'Coach'}</small>
                    <p>{t.content}</p>
                  </div>
                ))}
              {parcial && (
                <div className="wa-msg wa-msg--out ent-parcial">
                  <p>{parcial}</p>
                </div>
              )}
              {esperando && (
                <div className="wa-msg wa-msg--in ai-pensando" aria-label="Pensando">
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {devolucion && <Devolucion d={devolucion} />}
            </div>

            {activo && !devolucion && (
              <div className="ent-controles">
                {puedeDictar && (
                  <button
                    type="button"
                    className={`ent-mic${escuchando ? ' on' : ''}`}
                    disabled={!configurado || (ocupado && !hablando)}
                    onClick={() => (escuchando ? dictadoRef.current?.detener() : escuchar())}
                    aria-pressed={escuchando}
                    aria-label={escuchando ? 'Dejar de escuchar' : 'Hablar'}
                  >
                    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" fill="currentColor" />
                    </svg>
                  </button>
                )}
                <div className="ent-estado" aria-live="polite">
                  {escuchando
                    ? 'Escuchando… hablá y se envía solo cuando termines'
                    : hablando
                      ? 'La IA está hablando… tocá el micrófono para interrumpirla'
                      : ocupado
                        ? 'Pensando…'
                        : puedeDictar
                          ? 'Tocá el micrófono (o la barra espaciadora) y hablá'
                          : 'Escribí tu respuesta'}
                  {hablando && (
                    <button type="button" className="admin-link-btn" onClick={pararTodo}>
                      Silenciar
                    </button>
                  )}
                </div>
                <form
                  className="ent-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    enviar()
                  }}
                >
                  <input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="…o escribí acá"
                    maxLength={1500}
                    disabled={!configurado || (roleplay && !empezo)}
                  />
                  <Btn type="submit" disabled={ocupado || !texto.trim()}>
                    Enviar
                  </Btn>
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}

function Devolucion({ d }) {
  return (
    <div className="ent-dev">
      <div className="ent-dev-top">
        <span className="ent-nota">{d.puntaje ?? '—'}<small>/10</small></span>
        <p>{d.resumen}</p>
      </div>
      <div className="coach-body">
        {d.loQueHizoBien?.length > 0 && (
          <section className="coach-sec coach-sec--ok">
            <h4>Lo que hiciste bien</h4>
            <ul>{d.loQueHizoBien.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {d.aMejorar?.length > 0 && (
          <section className="coach-sec coach-sec--riesgo">
            <h4>Para mejorar</h4>
            <ul>{d.aMejorar.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {d.momentosClave?.length > 0 && (
          <section className="coach-sec">
            <h4>Momentos clave: cómo decirlo mejor</h4>
            <div className="coach-objs">
              {d.momentosClave.map((m, i) => (
                <article key={i}>
                  {m.loQueDijo && <small className="admin-muted">Dijiste: “{m.loQueDijo}”</small>}
                  {m.problema && <strong>{m.problema}</strong>}
                  {m.comoDecirloMejor && <p>Probá: “{m.comoDecirloMejor}”</p>}
                </article>
              ))}
            </div>
          </section>
        )}
        {d.proximaPractica && (
          <section className="coach-cierre">
            <h4>Para la próxima práctica</h4>
            <p>{d.proximaPractica}</p>
          </section>
        )}
        <small className="admin-muted coach-pie">
          {d.dolorDescubierto ? 'Descubriste el dolor' : 'No llegaste al dolor real'} · {d.pidioSiguientePaso ? 'pediste un siguiente paso' : 'no pediste un siguiente paso'} · {d.modelo}
        </small>
      </div>
    </div>
  )
}
