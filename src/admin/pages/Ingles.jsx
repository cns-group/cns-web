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
  vocesIdioma,
} from '../voz'

const PREFS_KEY = 'cns_ingles_prefs'
const IDIOMA_VOZ = 'en'
const IDIOMA_DICTADO = 'en-US'

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

// Cuando le hablás en español para pedir ayuda, la IA sale del personaje y empieza la respuesta con esta marca.
const MARCA_TUTOR = '[[TUTOR]]'

const FRASE_DE_PRUEBA = 'Hi Mario, this is how I sound. Today we are going to practice a short conversation. Are you ready?'

let contador = 0
const nuevoId = () => `t${++contador}`

export function InglesPage() {
  const inicial = React.useMemo(leerPrefs, [])
  const [status, setStatus] = React.useState(null)
  const [escenarios, setEscenarios] = React.useState([])
  const [niveles, setNiveles] = React.useState([])
  const [escenario, setEscenario] = React.useState(inicial.escenario || 'libre')
  const [nivel, setNivel] = React.useState(inicial.nivel || 'B1')
  const [modelo, setModelo] = React.useState('')
  const [turnos, setTurnos] = React.useState([]) // { id, role, content, correccion?, traduccion? }
  const [empezo, setEmpezo] = React.useState(false)
  const [ocupado, setOcupado] = React.useState(false)
  const [esperando, setEsperando] = React.useState(false)
  const [error, setError] = React.useState('')
  const [devolucion, setDevolucion] = React.useState(null)
  const [pidiendoDev, setPidiendoDev] = React.useState(false)
  const [texto, setTexto] = React.useState('')

  const [vozOn, setVozOn] = React.useState(inicial.vozOn ?? true)
  const [manosLibres, setManosLibres] = React.useState(inicial.manosLibres ?? false)
  const [corregirOn, setCorregirOn] = React.useState(inicial.corregirOn ?? true)
  const [vozNombre, setVozNombre] = React.useState(inicial.vozNombre || '')
  const [velocidad, setVelocidad] = React.useState(inicial.velocidad || 0.9)
  const [voces, setVoces] = React.useState(() => vocesIdioma(IDIOMA_VOZ))
  const [escuchando, setEscuchando] = React.useState(false)
  const [hablando, setHablando] = React.useState(false)
  const [parcial, setParcial] = React.useState('')

  const logRef = React.useRef(null)
  const dictadoRef = React.useRef(null)
  const dictadoEsRef = React.useRef(null) // micrófono en español, para preguntarle cosas al tutor
  const enviarRef = React.useRef(null)
  const locutorRef = React.useRef(null)
  const cortarRef = React.useRef(null)

  const puedeDictar = hayDictado()
  const puedeHablar = hayVoz()
  const hayNatural = voces.some(esNatural)

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
    api.ai.ingles
      .escenarios()
      .then((d) => {
        setEscenarios(d.escenarios)
        setNiveles(d.niveles)
      })
      .catch((e) => setError(e.message))
    const off = alCambiarVoces(() => setVoces(vocesIdioma(IDIOMA_VOZ)))
    return () => {
      off()
      pararTodo()
      dictadoRef.current?.detener()
      dictadoEsRef.current?.detener()
    }
  }, [pararTodo])

  React.useEffect(() => {
    guardarPrefs({ escenario, nivel, vozOn, manosLibres, corregirOn, vozNombre, velocidad })
  }, [escenario, nivel, vozOn, manosLibres, corregirOn, vozNombre, velocidad])

  React.useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turnos, esperando, parcial, devolucion])

  const escuchar = React.useCallback((enEspanol = false) => {
    const d = enEspanol ? dictadoEsRef.current : dictadoRef.current
    if (!d || d.activo()) return
    dictadoRef.current?.detener()
    dictadoEsRef.current?.detener()
    pararTodo()
    setParcial('')
    setError('')
    d.iniciar()
    setEscuchando(true)
  }, [pararTodo])

  React.useEffect(() => {
    const armar = (idioma) =>
      crearDictado({
        idioma,
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
    dictadoRef.current = armar(IDIOMA_DICTADO)
    dictadoEsRef.current = armar('es-AR')
  }, [])

  const soloMensajes = (lista) => lista.map(({ role, content, tutor }) => ({ role, content: tutor ? `${MARCA_TUTOR} ${content}` : content }))

  /** La IA responde por pedazos y se va diciendo en voz alta frase por frase. */
  const turnoIA = async (historial) => {
    setOcupado(true)
    setEsperando(true)
    setError('')
    const idIA = nuevoId()
    setTurnos([...historial, { id: idIA, role: 'assistant', content: '' }])

    const corte = new AbortController()
    cortarRef.current = corte
    let locutor = null
    let decidido = false
    let esTutor = false
    let crudo = ''
    let acumulado = ''
    let buffer = ''

    const nuevoLocutor = () =>
      vozOn && puedeHablar
        ? crearLocutor({
            vozNombre: esTutor ? '' : vozNombre,
            velocidad,
            idioma: esTutor ? 'es' : IDIOMA_VOZ,
            onFin: () => {
              setHablando(false)
              if (locutorRef.current === locutor) locutorRef.current = null
              if (manosLibres) escuchar()
            },
          })
        : null

    const alLlegar = (pedazo) => {
      let nuevo = pedazo
      if (!decidido) {
        // Los primeros caracteres dicen si la IA salió del personaje para ayudarte en español.
        crudo += pedazo
        const t = crudo.trimStart()
        if (t.length < MARCA_TUTOR.length && MARCA_TUTOR.startsWith(t)) return
        decidido = true
        esTutor = t.startsWith(MARCA_TUTOR)
        nuevo = esTutor ? t.slice(MARCA_TUTOR.length).trimStart() : crudo
        locutor = nuevoLocutor()
        locutorRef.current = locutor
      }
      acumulado += nuevo
      buffer += nuevo
      setEsperando(false)
      setTurnos([...historial, { id: idIA, role: 'assistant', content: acumulado, tutor: esTutor }])
      if (!locutor) return
      const { oraciones, resto } = extraerOraciones(buffer, { minimo: 18 })
      buffer = resto
      if (oraciones.length) setHablando(true)
      oraciones.forEach((o) => locutor.decir(o))
    }

    try {
      await api.ai.ingles.conversarStream(escenario, nivel, soloMensajes(historial), modelo, alLlegar, corte.signal)
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

  /** Revisa la frase en paralelo, sin frenar la conversación, y deja la corrección debajo de tu mensaje. */
  const corregirFrase = async (id, frase, contexto) => {
    try {
      const r = await api.ai.ingles.corregir(frase, nivel, contexto, modelo)
      // Si le preguntaste algo en español al tutor, no hay nada que corregir.
      if (r.esPregunta) return
      setTurnos((lista) => lista.map((t) => (t.id === id ? { ...t, correccion: r } : t)))
    } catch {
      /* la corrección es un extra: si falla, la charla sigue */
    }
  }

  const enviar = (contenido) => {
    const t = String(contenido ?? texto).trim()
    if (!t || ocupado) return
    pararTodo()
    setTexto('')
    const id = nuevoId()
    const ultimaIA = [...turnos].reverse().find((x) => x.role === 'assistant')?.content
    const historial = [...turnos, { id, role: 'user', content: t }]
    setTurnos(historial)
    if (corregirOn) corregirFrase(id, t, ultimaIA)
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

  const traducir = async (turno) => {
    if (turno.traduccion) {
      setTurnos((lista) => lista.map((t) => (t.id === turno.id ? { ...t, traduccion: null } : t)))
      return
    }
    try {
      const r = await api.ai.ingles.traducir(turno.content, modelo)
      setTurnos((lista) => lista.map((t) => (t.id === turno.id ? { ...t, traduccion: r.es } : t)))
    } catch (e) {
      setError(e.message)
    }
  }

  const pedirDevolucion = async () => {
    pararTodo()
    dictadoRef.current?.detener()
    dictadoEsRef.current?.detener()
    setPidiendoDev(true)
    setError('')
    try {
      setDevolucion(await api.ai.ingles.feedback(escenario, nivel, soloMensajes(turnos), modelo))
    } catch (e) {
      setError(e.message)
    } finally {
      setPidiendoDev(false)
    }
  }

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
      if (!dictadoRef.current) return
      e.preventDefault()
      if (dictadoRef.current.activo() || dictadoEsRef.current?.activo()) {
        dictadoRef.current.detener()
        dictadoEsRef.current?.detener()
      } else escuchar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [escuchar])

  const escucharFrase = (frase) => {
    pararTodo()
    hablar(frase, { vozNombre, velocidad, idioma: IDIOMA_VOZ })
  }

  const configurado = status?.configurado
  const pasoMario = turnos.filter((t) => t.role === 'user').length
  const esc = escenarios.find((e) => e.id === escenario)

  return (
    <>
      <PageHeader
        title="Entrenador de inglés"
        subtitle="Practicá conversaciones hablando en inglés: la IA hace de la otra persona, te contesta con voz, te corrige frase por frase y al final te dice qué mejorar."
        actions={status && <Badge tone={configurado ? 'success' : 'danger'}>{configurado ? 'Conectado' : 'Falta la clave'}</Badge>}
      />
      <ErrorBox message={error} />

      <div className="ent-layout">
        <Card title="Configuración">
          <div className="ent-config">
            <label className="admin-field">
              <span>Situación</span>
              <Select value={escenario} onChange={(e) => { reiniciar(); setEscenario(e.target.value) }}>
                {escenarios.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.titulo}
                  </option>
                ))}
              </Select>
            </label>
            {esc && <p className="admin-muted ent-persona">{esc.descripcion}</p>}

            <label className="admin-field">
              <span>Tu nivel</span>
              <Select value={nivel} onChange={(e) => { reiniciar(); setNivel(e.target.value) }}>
                {niveles.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.titulo}
                  </option>
                ))}
              </Select>
            </label>

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

            <label className="ent-check">
              <input type="checkbox" checked={corregirOn} onChange={(e) => setCorregirOn(e.target.checked)} />
              Corregirme cada frase (aparece debajo de lo que decís)
            </label>

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
                    <span>Voz en inglés</span>
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
                  {voces.length === 0 && <p className="admin-muted ent-persona">Tu navegador no tiene voces en inglés instaladas.</p>}
                  {voces.length > 0 && !hayNatural && (
                    <p className="admin-muted ent-persona">
                      Tu navegador no tiene voces “Natural” en inglés. En Microsoft Edge vienen gratis voces neuronales y suenan mucho mejor.
                    </p>
                  )}
                  <label className="admin-field">
                    <span>Velocidad: {velocidad.toFixed(2)}x</span>
                    <input type="range" min="0.6" max="1.2" step="0.05" value={velocidad} onChange={(e) => setVelocidad(Number(e.target.value))} />
                  </label>
                  <Btn variant="ghost" onClick={() => escucharFrase(FRASE_DE_PRUEBA)}>
                    Probar la voz
                  </Btn>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card
          title={esc ? esc.titulo : 'Práctica'}
          actions={
            <div className="admin-actions">
              {empezo && (
                <Btn variant="ghost" disabled={pasoMario < 3 || pidiendoDev || ocupado} onClick={pedirDevolucion}>
                  {pidiendoDev ? 'Evaluando…' : 'Terminar y ver devolución'}
                </Btn>
              )}
              {empezo && (
                <Btn variant="ghost" onClick={reiniciar}>
                  Nueva práctica
                </Btn>
              )}
            </div>
          }
        >
          <div className="wa-chat ent-chat">
            <div className="wa-chat-body ent-log" ref={logRef}>
              {!empezo && (
                <div className="ent-vacio">
                  <p>
                    Elegí la situación y tu nivel, y tocá empezar. La otra persona abre la conversación en inglés y vos le contestás:
                    podés hablar con el micrófono o escribir. Si no sabés cómo decir algo, preguntáselo en español (“¿cómo se dice…?”) y el tutor te responde. Con la barra espaciadora prendés y apagás el micrófono.
                  </p>
                  <Btn onClick={empezar} disabled={!configurado || !escenarios.length}>
                    Empezar a practicar
                  </Btn>
                </div>
              )}
              {turnos
                .filter((t) => t.content)
                .map((t) => (
                  <div key={t.id} className={`ing-turno ing-turno--${t.role === 'user' ? 'yo' : 'ia'}`}>
                    <div className={`wa-msg ${t.role === 'user' ? 'wa-msg--out' : 'wa-msg--in'}${t.tutor ? ' ing-tutor' : ''}`}>
                      <small className="ent-quien">{t.role === 'user' ? 'Vos' : t.tutor ? 'Tutor' : 'Ellos'}</small>
                      <p>{t.content}</p>
                      {t.role === 'assistant' && !t.tutor && (
                        <div className="ing-acc">
                          <button type="button" onClick={() => escucharFrase(t.content)}>
                            🔊 Escuchar
                          </button>
                          <button type="button" onClick={() => traducir(t)}>
                            {t.traduccion ? 'Ocultar traducción' : 'Traducir'}
                          </button>
                        </div>
                      )}
                      {t.traduccion && <p className="ing-trad">{t.traduccion}</p>}
                    </div>
                    {t.role === 'user' && t.correccion && (
                      <div className={`ing-corr${t.correccion.correcto ? ' ing-corr--ok' : ''}`}>
                        {t.correccion.correcto ? (
                          <span>✓ Muy bien, suena natural.</span>
                        ) : (
                          <>
                            <p>
                              <strong>Mejor:</strong> {t.correccion.corregido}
                            </p>
                            {t.correccion.explicacion && <small>{t.correccion.explicacion}</small>}
                            {t.correccion.consejo && <small className="ing-consejo">💡 {t.correccion.consejo}</small>}
                            <button type="button" onClick={() => escucharFrase(t.correccion.corregido)}>
                              🔊 Escuchar cómo se dice
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              {parcial && (
                <div className="wa-msg wa-msg--out ent-parcial">
                  <p>{parcial}</p>
                </div>
              )}
              {esperando && (
                <div className="wa-msg wa-msg--in ai-pensando" aria-label="Thinking">
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {devolucion && <Devolucion d={devolucion} onEscuchar={escucharFrase} />}
            </div>

            {empezo && !devolucion && (
              <div className="ent-controles">
                {puedeDictar && (
                  <button
                    type="button"
                    className={`ent-mic${escuchando ? ' on' : ''}`}
                    disabled={!configurado || (ocupado && !hablando)}
                    onClick={() => (escuchando ? (dictadoRef.current?.detener(), dictadoEsRef.current?.detener()) : escuchar())}
                    aria-pressed={escuchando}
                    aria-label={escuchando ? 'Stop listening' : 'Speak'}
                  >
                    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" fill="currentColor" />
                    </svg>
                  </button>
                )}
                {puedeDictar && (
                  <button
                    type="button"
                    className="ing-es"
                    disabled={!configurado || escuchando || (ocupado && !hablando)}
                    onClick={() => escuchar(true)}
                    title="Hablá en español para preguntarle al tutor cómo se dice algo o qué significa"
                  >
                    ¿Cómo se dice…? <small>hablar en español</small>
                  </button>
                )}
                <div className="ent-estado" aria-live="polite">
                  {escuchando
                    ? 'Listening… hablá y se envía solo cuando termines'
                    : hablando
                      ? 'Hablando… tocá el micrófono para interrumpir'
                      : ocupado
                        ? 'Pensando…'
                        : puedeDictar
                          ? 'Tocá el micrófono (o la barra espaciadora) y hablá en inglés'
                          : 'Escribí tu respuesta en inglés'}
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
                    placeholder="…or type in English"
                    maxLength={400}
                    disabled={!configurado}
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

function Devolucion({ d, onEscuchar }) {
  return (
    <div className="ent-dev">
      <div className="ent-dev-top">
        <span className="ent-nota">{d.puntaje ?? '—'}<small>/10</small></span>
        <p>
          {d.nivelEstimado && <strong>Nivel que mostraste: {d.nivelEstimado}. </strong>}
          {d.resumen}
        </p>
      </div>
      <div className="coach-body">
        {d.loQueHizoBien?.length > 0 && (
          <section className="coach-sec coach-sec--ok">
            <h4>Lo que hiciste bien</h4>
            <ul>{d.loQueHizoBien.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {d.erroresFrecuentes?.length > 0 && (
          <section className="coach-sec">
            <h4>Errores para corregir</h4>
            <div className="coach-objs">
              {d.erroresFrecuentes.map((e, i) => (
                <article key={i}>
                  <small className="admin-muted">Dijiste: “{e.loQueDijo}”</small>
                  <strong>{e.correccion}</strong>
                  {e.explicacion && <p>{e.explicacion}</p>}
                  <button type="button" className="admin-link-btn" onClick={() => onEscuchar(e.correccion)}>
                    🔊 Escuchar
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {d.frasesMasNaturales?.length > 0 && (
          <section className="coach-sec">
            <h4>Cómo lo diría un nativo</h4>
            <div className="coach-objs">
              {d.frasesMasNaturales.map((f, i) => (
                <article key={i}>
                  {f.enVezDe && <small className="admin-muted">En vez de: “{f.enVezDe}”</small>}
                  <strong>{f.mejor}</strong>
                  <button type="button" className="admin-link-btn" onClick={() => onEscuchar(f.mejor)}>
                    🔊 Escuchar
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {d.vocabulario?.length > 0 && (
          <section className="coach-sec">
            <h4>Vocabulario útil para esta situación</h4>
            <div className="coach-objs">
              {d.vocabulario.map((v, i) => (
                <article key={i}>
                  <strong>{v.palabra}</strong>
                  {v.significado && <small className="admin-muted">{v.significado}</small>}
                  {v.ejemplo && <p>{v.ejemplo}</p>}
                  <button type="button" className="admin-link-btn" onClick={() => onEscuchar(`${v.palabra}. ${v.ejemplo || ''}`)}>
                    🔊 Escuchar
                  </button>
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
        <small className="admin-muted coach-pie">{d.modelo}</small>
      </div>
    </div>
  )
}
